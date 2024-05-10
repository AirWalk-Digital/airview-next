// import { useState, useEffect } from "react";

import matter from 'gray-matter';
import path from 'path';

// import { getContent } from '@/components/Layouts/lib/getTiles';
import { getBranchSha, getDirStructure } from '@/lib/Github';
import { getLogger } from '@/lib/Logger';
import { cacheRead, cacheWrite } from '@/lib/Redis';
import type {
  ContentItem,
  FileContent,
  FrontMatter,
  SiteConfig,
} from '@/lib/Types';

const logger = getLogger().child({ namespace: 'lib/Content/loadMenu' });

interface MatterData {
  title: string;
  [key: string]: Date | string;
}

interface Content {
  label: string;
  url: string;
}

interface Directory {
  [key: string]: Content[];
}

interface RelatedContent {
  [key: string]: Directory;
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

      // console.log('getMenuStructure')

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
        relatedContent[directory] = { chapters: [] as Content[] };
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
  siteConfig: SiteConfig,
) {
  // logger.debug({ function: 'getPrimaryMenu', contentConfig });
  // have we cached the directory structure?
  const cacheKey = `menu:${contentConfig.path}:${branchSha}`;
  // Check if the content is in the cache
  let cachedContent;
  try {
    cachedContent = JSON.parse(await cacheRead(cacheKey));
  } catch (error) {
    // Handle the error when JSON parsing fails (invalid data).
    logger.error({
      function: 'getMenu',
      msg: 'Error parsing cached content',
      error,
    });
    cachedContent = null; // Or use a default value if required.
  }
  if (cachedContent && cachedContent.length > 0) {
    logger.info({ function: 'getMenu', msg: '[Cache][HIT]', cacheKey });
    // If the content was found in the cache, return it
    // return cachedContent;
  }
  logger.info({ function: 'getMenu', msg: '[Cache][MISS]', cacheKey });
  // load the file structure
  const files = await getDirStructure(
    contentConfig.owner,
    contentConfig.repo,
    contentConfig.branch,
    contentConfig.path,
    '.md*',
  );
  // logger.debug({ function: 'getPrimaryMenu', msg: 'getDirStructure', files });

  const contentPromises = files.map(async (file) => {
    let matterData: MatterData | null = null;
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
    await cacheWrite(cacheKey, JSON.stringify(menu)); // cache for 24 hours
  } catch (error) {
    logger.error({
      function: 'getMenu',
      msg: 'Error writing cache:',
      cacheKey,
      error,
    });
  }
  return menu;
}

export async function loadMenu(
  siteConfig: SiteConfig,
  collection: ContentItem,
): Promise<{ primary: any[]; relatedContent: any }> {
  const branchSha = await getBranchSha(
    collection.owner,
    collection.repo,
    collection.branch,
  );

  const primary = await getMenu(branchSha, collection, siteConfig);
  const { relatedContent } = primary;
  // get all related config.
  let mergedRelatedContent = relatedContent;

  const getMenuPromises = (collection.collections ?? []).map(
    async (collectionItem: string) => {
      if (!relatedContent[collectionItem]) {
        relatedContent[collectionItem] = {};
      }
      const contentFolder = await getMenu(
        branchSha,
        siteConfig.content[
          collectionItem as keyof typeof siteConfig.content
        ] as ContentItem,
        siteConfig,
      );
      // relatedContent[collectionItem] = contentFolder.relatedContent;
      mergedRelatedContent = {
        ...mergedRelatedContent,
        ...contentFolder.relatedContent,
      };
    },
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

  return { primary: primary.primary, relatedContent: mergedRelatedContent };
}

// export async function loadMenuOld(
//   // siteConfig: SiteContent,
//   collection: ContentItem,
// ): Promise<{ primary: any[]; relatedContent: any }> {
//   // branch of the primary collection

//   logger.debug({ msg: 'loadMenu: ', collection });
//   const branchSha = await getBranchSha(
//     collection.owner,
//     collection.repo,
//     collection.branch,
//   );

//   const cacheKey = `menus:${collection.path}:${branchSha}`;
//   // Check if the content is in the cache
//   let cachedContent;
//   try {
//     cachedContent = JSON.parse(await cacheRead(cacheKey));
//   } catch (error) {
//     // Handle the error when JSON parsing fails (invalid data).
//     // console.error('Error parsing cached content:', error);
//     cachedContent = null; // Or use a default value if required.
//   }
//   if (cachedContent) {
//     console.info('[getMenuStructure][Cache][HIT]:', cacheKey);
//     // If the content was found in the cache, return it
//     return cachedContent;
//   }
//   console.info('[getMenuStructure][Cache][MISS]:', cacheKey);

//   const parent = 'siteConfig.path';
//   const primary = await getContent(collection);
//   // console.info('[getMenuStructure][primary]:', primary)

//   const relatedFiles = {}; // all the files in related collections
//   const relatedContent = {}; // only the files that are children of the primary content

//   const collections = [
//     'services',
//     'providers',
//     'solutions',
//     'knowledge',
//     'designs',
//     'customers',
//     'projects',
//     'products',
//   ];

//   const primaryMenu = [];
//   // const chapterFiles = {};
//   // const knowledgeFiles = {};

//   const indexFiles = new Set();

//   // First pass: Find index.md files
//   for (const x of primary) {
//     if (
//       x.file &&
//       x.file.path &&
//       x.file.path.split('/').length === 3 &&
//       x.file.path.match(/(_index\.md*|index\.md*)$/) &&
//       x.frontmatter &&
//       x.frontmatter.title
//     ) {
//       primaryMenu.push({
//         label: x.frontmatter.title,
//         url: x.file.path.startsWith('/') ? x.file.path : `/${x.file.path}`,
//       });
//       indexFiles.add(path.dirname(x.file.path)); // Add directory name to the Set
//     }
//   }

//   // const mergedMenu = mergePadMenu(primaryMenu, relatedContent);

//   const content = { primary: primaryMenu, relatedContent };
//   // const util = require('util')
//   // console.log('primaryMenu: ', util.inspect(primaryMenu, false, null, true /* enable colors */))
//   // console.log('mergedMenu: ', util.inspect(mergedMenu, false, null, true /* enable colors */))
//   await cacheWrite(cacheKey, JSON.stringify(content), 60 * 60 * 24); // cache for 24 hours
//   return content;
// }

// export async function loadMenu2(
//   siteConfig: SiteContent,
//   collection: ContentItem,
// ): Promise<{ primary: any[]; relatedContent: any }> {
//   // branch of the primary collection
//   const branchSha = await getBranchSha(
//     collection.owner,
//     collection.repo,
//     collection.branch,
//   );

//   const cacheKey = `menus:${collection.path}:${branchSha}`;
//   // Check if the content is in the cache
//   let cachedContent;
//   try {
//     cachedContent = JSON.parse(await cacheRead(cacheKey));
//   } catch (error) {
//     // Handle the error when JSON parsing fails (invalid data).
//     // console.error('Error parsing cached content:', error);
//     cachedContent = null; // Or use a default value if required.
//   }
//   if (cachedContent) {
//     logger.info({ msg: '[loadMenu][Cache][HIT]:', cacheKey });
//     // If the content was found in the cache, return it
//     // return cachedContent;
//   }
//   logger.info({ msg: '[loadMenu][Cache][MISS]:', cacheKey });

//   // const parent = 'siteConfig.path';
//   // fetch the primary content for the collection.
//   const primary = await getContent(branchSha, collection);
//   // console.info('[getMenuStructure][primary]:', primary)

//   const relatedFiles = {}; // all the files in related collections
//   const relatedContent = {}; // only the files that are children of the primary content
//   const collections = collection.collections || [];
//   // const collections = [
//   //   'services',
//   //   'providers',
//   //   'solutions',
//   //   'knowledge',
//   //   'designs',
//   //   'customers',
//   //   'projects',
//   //   'products',
//   // ];

//   const primaryMenu = [];
//   // const chapterFiles = {};
//   // const knowledgeFiles = {};

//   const indexFiles = new Set();

//   // First pass: Find index.md files
//   for (const x of primary) {
//     if (
//       x.file &&
//       x.file.path &&
//       x.file.path.split('/').length === 3 &&
//       x.file.path.match(/(_index\.md*|index\.md*)$/) &&
//       x.frontmatter &&
//       x.frontmatter.title
//     ) {
//       primaryMenu.push({
//         label: x.frontmatter.title,
//         url: x.file.path.startsWith('/') ? x.file.path : `/${x.file.path}`,
//       });
//       indexFiles.add(path.dirname(x.file.path)); // Add directory name to the Set
//     }
//   }

//   // Second pass: Process non-index.md files
//   for (const x of primary) {
//     if (
//       x.file &&
//       x.file.path &&
//       x.file.path.split('/').length > 2 && // skip any files in the root of the directory
//       !x.file.path.match(/(_index\.md*|index\.md*)$/) &&
//       x.frontmatter &&
//       x.frontmatter.title
//     ) {
//       // let directory = x.file.split("/")[1]; // Extract directory name
//       const directory = path.dirname(x.file.path);

//       // console.log('getMenuStructure')

//       // const collection = x.file.path.split('/')[0]; // Extract directory name
//       // Only add file to solutionMenu if there is no corresponding index.md
//       if (!indexFiles.has(directory)) {
//         primaryMenu.push({
//           label: x.frontmatter.title,
//           url: x.file.path.startsWith('/') ? x.file.path : `/${x.file.path}`,
//         });
//       }

//       // Check if the key exists in the relatedContent object
//       if (!relatedContent[directory]) {
//         relatedContent[directory] = {};
//       }
//       // check we have a section for the type of parent
//       if (!relatedContent[directory].chapters) {
//         relatedContent[directory].chapters = [];
//       }
//       // add the related content
//       relatedContent[directory].chapters.push({
//         label: x.frontmatter.title,
//         url: x.file.path.startsWith('/') ? x.file.path : `/${x.file.path}`,
//       });
//     }
//   }

//   const siteContent = siteConfig.content;

//   for (const collectionItem of collections) {
//     if (!relatedFiles[collectionItem]) {
//       relatedFiles[collectionItem] = {};
//     }
//     relatedFiles[collectionItem] = await getContent(
//       branchSha,
//       siteConfig.content[collectionItem],
//     );
//     // // console.log('relatedFiles[collectionItem]: ', relatedFiles[collectionItem])

//     for (const x of relatedFiles[collectionItem]) {
//       if (
//         x.file &&
//         x.file.path &&
//         x.file.path.split('/').length > 2 && // skip any files in the root of the directory
//         x.frontmatter &&
//         x.frontmatter.title
//       ) {
//         for (const key in siteContent) {
//           if (siteContent.hasOwnProperty(key)) {
//             const contentDetails = siteContent[key];
//             if (x.frontmatter[contentDetails.reference]) {
//               const directory = x.frontmatter[contentDetails.reference]; // is already the directory name

//               if (!relatedContent[directory]) {
//                 relatedContent[directory] = {};
//               }
//               // check we have a section for the type of parent
//               if (!relatedContent[directory][collectionItem]) {
//                 relatedContent[directory][collectionItem] = [];
//               }
//               // add the related content
//               relatedContent[directory][collectionItem].push({
//                 label: x.frontmatter.title,
//                 url: x.file.path.startsWith('/')
//                   ? x.file.path
//                   : `/${x.file.path}`,
//               });
//             }
//           }
//         }
//       }
//     }
//   }

//   const mergedMenu = mergePadMenu(primaryMenu, relatedContent);

//   const content = { primary: mergedMenu, relatedContent };
//   // const util = require('util')
//   // console.log('primaryMenu: ', util.inspect(primaryMenu, false, null, true /* enable colors */))
//   // console.log('mergedMenu: ', util.inspect(mergedMenu, false, null, true /* enable colors */))
//   await cacheWrite(cacheKey, JSON.stringify(content), 60 * 60 * 24); // cache for 24 hours
//   logger.info({ msg: '[Menu]', content });

//   return content;
// }

// // merge the child entries

// function mergePadMenu(menuA, menuB) {
//   const mergedStructure = menuA;
//   // console.log('mergePadMenu:menuA ', menuA)
//   // console.log('mergePadMenu:menuB ', menuB)

//   Object.keys(menuB).forEach((key) => {
//     menuA.forEach((item, index) => {
//       if (path.dirname(item.url) === `/${key}`) {
//         // console.log('mergePadMenu: /', key, ' : ', path.dirname(item.url))

//         if (!mergedStructure[index].children) {
//           mergedStructure[index].children = [];
//         }
//         mergedStructure[index].children = menuB[key];
//       }
//     });
//   });
//   // console.log('mergePadMenu:mergedStructure: ', mergedStructure)

//   return mergedStructure;
// }

// export function usePageMenu(initialContext) {

//   const [menuStructure, setMenuStructure] = useState([]);

//   const collection = () => {
//     if (initialContext.menu && initialContext.menu.collection) {
//       return siteConfig.content[siteConfig.content[initialContext.menu.collection].path]
//     } else {
//       return initialContext
//     }
//   }

//   useEffect(() => { // populate the menu structure

//     const fetchMenu = async () => {
//       const res = await fetch(`/api/menu?collection=${collection().path}`); // fetch draft content to add to the menus.
//       const data = await res.json();
//       setMenuStructure(data);
//     };

//     fetchMenu();

//   }, []);

//   return {
//     menuStructure,
//   };
// }

// // Helper function for deep merge
// function deepMerge(target, source) {
//   for (const key in source) {
//     if (source.hasOwnProperty(key)) {
//       if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
//         target[key] = deepMerge(target[key] || {}, source[key]);
//       } else if (Array.isArray(source[key])) {
//         if (Array.isArray(target[key])) {
//           // Merge arrays while avoiding duplicates based on unique properties
//           const uniqueItems = [];
//           const map = new Map();

//           [...target[key], ...source[key]].forEach(item => {
//             const uniqueKey = item.url || item.label; // Use 'url' or 'label' as a unique key, whichever is available
//             if (!map.has(uniqueKey)) {
//               map.set(uniqueKey, true);
//               uniqueItems.push(item);
//             }
//           });

//           target[key] = uniqueItems;
//         } else {
//           target[key] = source[key];
//         }
//       } else {
//         target[key] = source[key];
//       }
//     }
//   }
//   return target;
// }

// function deepMergeObj(target, source) {
//   for (const key in source) {
//     if (source.hasOwnProperty(key)) {
//       if (source[key] instanceof Object && target[key] instanceof Object) {
//         deepMerge(target[key], source[key]);
//       } else {
//         target[key] = source[key];
//       }
//     }
//   }
//   return target;
// }
