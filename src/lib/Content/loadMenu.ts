// import { useState, useEffect } from "react";

import matter from 'gray-matter';
import path from 'path';

// import { default as siteConfig } from '@/config';
// import { getContent } from '@/components/Layouts/lib/getTiles';
import { getBranchSha, getDirStructure } from '@/lib/Github';
import { getLogger } from '@/lib/Logger';
import { cacheRead, cacheWrite } from '@/lib/Redis';
import type {
  ContentItem,
  FileContent,
  FrontMatter,
  InputMenu,
  LinkItem,
  MatterData,
  MenuItem,
  MenuStructure,
  RelatedContent,
  SiteConfig,
} from '@/lib/Types';

const logger = getLogger().child({ namespace: 'lib/Content/loadMenu' });
logger.level = 'error';

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

type AnyObject = { [key: string]: any };

function deepMergeObj(initialTarget: AnyObject, source: AnyObject): AnyObject {
  const target = { ...initialTarget };

  Object.keys(source).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (
        sourceValue instanceof Object &&
        !Array.isArray(sourceValue) &&
        targetValue instanceof Object
      ) {
        target[key] = deepMergeObj(targetValue, sourceValue);
      } else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        target[key] = [...targetValue, ...sourceValue];
      } else {
        target[key] = sourceValue;
      }
    }
  });

  return target;
}

export const menuConfig = (
  siteConfig: SiteConfig,
  contentConfig: ContentItem
) => {
  if (contentConfig.menu && contentConfig.menu.collection) {
    return (
      siteConfig?.content?.[
        contentConfig?.menu?.collection as keyof typeof siteConfig.content
      ] || (contentConfig as ContentItem)
    );
  }
  return contentConfig;
};

export function nestMenu(
  menuInput: InputMenu,
  prefix?: string
): { menu: MenuStructure[] } {
  const nestedMenu: MenuStructure[] = menuInput.primary.map((item) => {
    const urlKey = item.url.slice(0, item.url.lastIndexOf('/'));
    const content = menuInput.relatedContent[urlKey];

    // Creating a new object instead of modifying the original item
    const newItem = { ...item };
    if (prefix) {
      newItem.url = `/${prefix}/${item.url}`;
    } else {
      newItem.url = `/${item.url}`;
    }
    if (content) {
      const menuItems: MenuItem[] = Object.keys(content).map((groupTitle) => ({
        groupTitle: capitalizeFirstLetter(groupTitle),
        links:
          content[groupTitle]?.map((link) => ({
            label: link.label,
            url: prefix ? `/${prefix}/${link.url}` : `/${link.url}`,
          })) ?? [],
      }));
      newItem.menuItems = menuItems;
    }

    return newItem;
  });

  return { menu: nestedMenu };
}

export function convertToMenu(primary: FileContent[], siteConfig: SiteConfig) {
  const primaryMenu = [];
  const siteContent = siteConfig.content;
  // const chapterFiles = {};
  // const knowledgeFiles = {};

  const indexFiles = new Set();

  // First pass: Find index.md files
  for (const x of primary) {
    if (
      x.file &&
      x.file.path &&
      x.file.path.split('/').length === 3 &&
      x.file.path.match(/(_index\.md$|_index\.mdx$|index\.md$|index\.mdx$)/) &&
      x.frontmatter &&
      x.frontmatter.title
    ) {
      primaryMenu.push({
        label: x.frontmatter.title,
        url: x.file.path,
        // url: x.file.path.startsWith('/') ? x.file.path : `/${x.file.path}`,
      });
      indexFiles.add(path.dirname(x.file.path)); // Add directory name to the Set
    }
  }
  let relatedContent: RelatedContent = {};
  // Second pass: Process non-index.md files
  for (const x of primary) {
    if (
      x.file &&
      x.file.path &&
      x.file.path.split('/').length > 2 && // skip any files in the root of the directory
      !x.file.path.match(/(_index\.md$|_index\.mdx$|index\.md$|index\.mdx$)/) &&
      x.frontmatter &&
      x.frontmatter.title
    ) {
      // let directory = x.file.split("/")[1]; // Extract directory name
      const directory = path.dirname(x.file.path);

      // logger.log('getMenuStructure')

      // const collection = x.file.path.split('/')[0]; // Extract directory name
      // Only add file to solutionMenu if there is no corresponding index.md
      // if (!indexFiles.has(directory)) {
      //   primaryMenu.push({
      //     label: x.frontmatter.title,
      //     url: x.file.path.startsWith('/') ? x.file.path : `/${x.file.path}`,
      //   });
      // }

      // Check if the key exists in the relatedContent object
      if (relatedContent && !relatedContent[directory]) {
        relatedContent[directory] = { chapters: [] as LinkItem[] };
      }
      relatedContent[directory]?.chapters!.push({
        label: x.frontmatter.title,
        url: x.file.path,
        // url: x.file.path.startsWith('/') ? x.file.path : `${x.file.path}`,
      });
      // check we have a section for the type of parent
      // if (!relatedContent[directory]?.chapters) {
      //   relatedContent[directory].chapters = [] as Content[];
      // }
      // add the related content
    }
  }
  // find all related content and map against the top level
  for (const x of primary) {
    if (
      x.file &&
      x.file.path &&
      x.file.path.split('/').length > 2 && // skip any files in the root of the directory
      x.frontmatter &&
      x.frontmatter.title
    ) {
      for (const key of Object.keys(siteContent)) {
        const contentDetails: ContentItem = siteContent[
          key as keyof typeof siteContent
        ] as ContentItem;
        if (
          x.frontmatter[contentDetails.reference] &&
          typeof x.frontmatter[contentDetails.reference] === 'string'
        ) {
          const parentDirectory = x.frontmatter[
            contentDetails.reference
          ] as string;
          const directory = x.file.path.split('/')[0];
          relatedContent = relatedContent ?? {};

          if (parentDirectory && relatedContent) {
            // Ensure the parent directory key exists in relatedContent with a default object
            if (!relatedContent[parentDirectory]) {
              relatedContent[parentDirectory] = {};
            }

            // Safely access or initialize the directory key under parentDirectory
            if (parentDirectory && directory) {
              relatedContent[parentDirectory]![directory] =
                relatedContent[parentDirectory]?.[directory] ?? [];

              // Push the new content to the appropriate directory array
              // TypeScript should now understand that this cannot be undefined
              if (
                relatedContent &&
                parentDirectory &&
                directory &&
                relatedContent[parentDirectory] &&
                relatedContent[parentDirectory]![directory] &&
                Array.isArray(relatedContent[parentDirectory]![directory])
              ) {
                relatedContent[parentDirectory]![directory]!.push({
                  label: x.frontmatter.title,
                  url: x.file.path,
                });
              }
            }
          }
        }
      }
    }
  }
  return { primary: primaryMenu, relatedContent };
}

export async function getMenu(
  branchSha: string,
  contentConfig: ContentItem,
  siteConfig: SiteConfig
) {
  // logger.debug({ function: 'getPrimaryMenu', contentConfig });
  // have we cached the directory structure?
  const cachedMenuKey = `menu:${contentConfig.path}:${branchSha}`;
  // Check if the content is in the cache
  let cachedMenu;
  try {
    cachedMenu = JSON.parse(await cacheRead(cachedMenuKey));
  } catch (error) {
    // Handle the error when JSON parsing fails (invalid data).
    logger.error({
      function: 'getMenu',
      msg: 'Error parsing cached content',
      error,
    });
    cachedMenu = null; // Or use a default value if required.
  }
  if (cachedMenu && cachedMenu.length > 0) {
    logger.info({ function: 'getMenu', msg: '[Cache][HIT]', cachedMenuKey });
    // If the content was found in the cache, return it
    // return cachedMenu;
  }
  logger.info({ function: 'getMenu', msg: '[Cache][MISS]', cachedMenuKey });
  // load the file structure
  const files = await getDirStructure(
    contentConfig.owner,
    contentConfig.repo,
    contentConfig.branch,
    contentConfig.path,
    '.md*'
  );
  // logger.debug({ function: 'getPrimaryMenu', msg: 'getDirStructure', files });

  const contentPromises = files.map(async (file) => {
    let matterData: MatterData | null = null;
    const cacheKey = `github:frontmatter:${file.path}:${file.sha}`;
    const cachedContent = await cacheRead(cacheKey);
    if (cachedContent) {
      return JSON.parse(cachedContent);
    }
    try {
      if (file.download_url) {
        const downloadResponse = await fetch(file.download_url);
        const downloadBuffer = await downloadResponse.arrayBuffer();
        const textDecoder = new TextDecoder('utf-8');

        if (downloadBuffer) {
          matterData = matter(textDecoder.decode(downloadBuffer), {
            excerpt: false,
          }).data as MatterData;
        }
      }
      // convert dates to strings
      if (matterData) {
        Object.keys(matterData).forEach((key) => {
          if (
            matterData &&
            matterData[key] &&
            matterData[key] instanceof Date
          ) {
            matterData[key] = (matterData[key] as Date).toISOString();
          }
        });
      }
      await cacheWrite(
        cacheKey,
        JSON.stringify({ file, frontmatter: matterData })
      ); // cache perpetually a reference to the file
      return { file, frontmatter: matterData as FrontMatter };
    } catch (error) {
      logger.error({
        function: 'getMenu',
        msg: 'Error parsing frontmatter:',
        file,
        error,
      });
      return { file: null, frontmatter: null };
    }
  });
  const content: FileContent[] = await Promise.all(contentPromises);
  // logger.debug({ function: 'getMenu', msg: 'content', content });
  const menu = convertToMenu(content, siteConfig);
  // logger.debug({ function: 'getMenu', msg: 'menu', menu });
  // write the cache
  try {
    await cacheWrite(cachedMenuKey, JSON.stringify(menu)); // cache for 24 hours
  } catch (error) {
    logger.error({
      function: 'getMenu',
      msg: 'Error writing cache:',
      cachedMenuKey,
      error,
    });
  }
  return menu;
}

export async function loadMenu(
  siteConfig: SiteConfig,
  collection?: ContentItem
): Promise<{ primary: any[]; relatedContent: any }> {
  if (!collection) {
    throw new Error('Collection is undefined');
  }
  const branchSha = await getBranchSha(
    collection.owner,
    collection.repo,
    collection.branch
  );

  const primary = await getMenu(branchSha, collection, siteConfig);
  // const { relatedContent } = primary;
  let relatedContent: RelatedContent = {};
  // const mergedRelatedContent = relatedContent;

  if (primary.relatedContent) {
    relatedContent = deepMergeObj(relatedContent, primary.relatedContent);
  }
  // get all related config.

  const getMenuPromises = (collection.collections ?? []).map(
    async (collectionItem: string) => {
      // if (!relatedContent[collectionItem]) {
      //   relatedContent[collectionItem] = {};
      // }
      const contentFolder = await getMenu(
        branchSha,
        siteConfig.content[
          collectionItem as keyof typeof siteConfig.content
        ] as ContentItem,
        siteConfig
      );

      relatedContent = deepMergeObj(
        relatedContent,
        contentFolder.relatedContent
      );
      // relatedContent[collectionItem] = contentFolder.relatedContent;
      // mergedRelatedContent = {
      //   ...mergedRelatedContent,
      //   ...contentFolder.relatedContent,
      // };
    }
  );

  await Promise.all(getMenuPromises);
  logger.debug({
    function: 'loadMenu',
    msg: 'primary menu',
    primay: primary,
  });
  // logger.debug({
  //   function: 'loadMenu',
  //   msg: 'primary menu',
  //   primay: primary.primary,
  // });
  // logger.debug({
  //   function: 'loadMenu',
  //   msg: 'relatedContent',
  //   mergedRelatedContent,
  // });

  return { primary: primary.primary, relatedContent };
}
