import { getLogger } from '@/lib/Logger';
import type {
  File,
  LinkItem,
  MenuStructure,
  RelatedContent,
} from '@/lib/Types';

import { getCollectionFiles, getRelatedFiles } from './Storage';

const logger = getLogger().child({ namespace: 'lib/Menu' });

logger.level = 'debug';

// this is a complex function.
// if we only pass the collection name, we get all the files in the collection only, with no related files.
// example:
// [
//   {
//     "label": "Kubernetes",
//     "url": "/collections/solutions/solutions/kubernetes/_index.md",
//     "type": "published",
//    }
// ]
// if we pass the collection name and the pageCollection name, we structure the response around the page collection.
// logic: for each element in the pageCollection. get it's children and add them to the menu. then get the children of the children
// example:
//  [
//   {
//     "label": "AWS",
//     "url": "/providers/aes/_index.md",
//     "type": "published",
//     "links": [
//        {
//         "label": "EC2",
//          "url": "/services/ec2/_index.md",
//          "type": "published"
//        },
//      ]
//    }
//  ]

export async function menuStructure(
  collectionName: string,
  pageCollection: string
): Promise<MenuStructure[]> {
  // Retrieve all files in the specified collection

  logger.debug({ function: 'menuStructure', collectionName, pageCollection });
  let files: File[] = [];

  if (pageCollection) {
    files = await getCollectionFiles(pageCollection);
  } else {
    files = await getCollectionFiles(collectionName);
  }
  const menu: MenuStructure[] = [];

  // Collect promises for all related files
  if (files.length === 0) {
    return menu;
  }
  logger.debug({
    function: 'menuStructure',
    files: files.map((file) => file.name),
  });
  const relatedFilesPromises = files.map(async (file) => {
    const { frontmatter, type } = file;
    const label = frontmatter?.title || file.name;
    const url = `/${collectionName}/${file.name}`;

    // Create the base MenuStructure item for this file
    const menuItem: MenuStructure = { label, url, type, links: [] };

    let relatedFiles: File[] = [];
    // Get related files for this file and add them as links
    if (pageCollection) {
      relatedFiles = await getRelatedFiles(file.name);
      const relatedLinks: LinkItem[] = relatedFiles.map((relatedFile) => ({
        label: relatedFile?.frontmatter?.title || relatedFile.name,
        url: `/${relatedFile.name}`,
        type: relatedFile.type,
      }));
      if (relatedLinks.length > 0) {
        menuItem.links = relatedLinks;
      }
    }
    // Add links to the MenuStructure item if there are related files

    return menuItem;
  });

  // Wait for all menu items to be built concurrently
  const menuItems = await Promise.all(relatedFilesPromises);

  // Add all menu items to the main menu array
  menu.push(...menuItems);

  return menu;
}

export async function loadRelated(file: string): Promise<RelatedContent> {
  if (!file) {
    throw new Error('file is undefined');
  }
  const relatedContent: RelatedContent = {};

  const relatedFiles = await getRelatedFiles(file);
  logger.debug({
    function: 'loadRelated',
    file,
    relatedFiles,
  });
  relatedFiles.forEach((relatedFile) => {
    if (!relatedFile) return;
    // get the first part of the path which is the collection name
    const directory = relatedFile.name.split('/')[0];
    if (!directory) {
      logger.error({
        function: 'loadRelated',
        msg: 'No directory found',
        file: relatedFile,
      });
      return;
    }
    if (!relatedContent[directory]) {
      relatedContent[directory] = [];
    }
    relatedContent[directory].push({
      label: relatedFile.frontmatter?.title || relatedFile.name,
      url: `/${relatedFile.name}`,
      type: relatedFile.type,
    });
  });

  // const primary = await getCollectionFiles(collection);

  // logger.debug({ function: 'loadRelated', primary, collection });

  // // // Process related content for each sub-collection item
  // // const relatedContentPromises = (collection.collections ?? []).map(
  // //   async (collectionItem: string) => {
  // //     const collectionFiles = await getCollectionFiles(collectionItem);
  // //     const collectionRelatedContent: RelatedContent = {};
  // if (primary.length !== 0) {
  //   // check if there are any files in the collection
  //   await Promise.all(
  //     primary.map(async (file) => {
  //       const relatedFiles = await getRelatedFiles(file.name);
  //       logger.debug({
  //         function: 'loadRelated',
  //         file: file.name,
  //         relatedFiles,
  //       });

  //       // relatedContent[file.name] = relatedFiles.map((relatedFile) => ({
  //       //   label: relatedFile.frontmatter?.title || relatedFile.name,
  //       //   url: `/${relatedFile.name}`,
  //       // }));

  //       relatedFiles.forEach((relatedFile) => {
  //         if (!relatedFile) return;
  //         // get the first part of the path which is the collection name
  //         const directory = relatedFile.name.split('/')[0];
  //         if (!directory) {
  //           logger.error({
  //             function: 'loadRelated',
  //             msg: 'No directory found',
  //             file: relatedFile,
  //           });
  //           return;
  //         }
  //         if (!relatedContent[directory]) {
  //           relatedContent[directory] = [];
  //         }
  //         relatedContent[directory].push({
  //           label: relatedFile.frontmatter?.title || relatedFile.name,
  //           url: `/${relatedFile.name}`,
  //           type: relatedFile.type,
  //         });
  //       });
  //     })
  //   );
  // }

  //   // Merge into main relatedContent object
  //   relatedContent = deepMergeObj(relatedContent, collectionRelatedContent);
  // }
  // );

  // await Promise.all(relatedContentPromises);
  logger.debug({ function: 'loadRelated', msg: 'final', relatedContent });
  return relatedContent;
}

// export async function loadMenu(
//   siteConfig: SiteConfig,
//   collection?: ContentItem
// ): Promise<{ primary: any[]; relatedContent: any }> {
//   if (!collection) {
//     throw new Error('Collection is undefined');
//   }

//   getCollectionFiles(collection.reference).then((elements: any) => {
//     logger.info(elements);
//   });

//   const primary = await getMenu(branchSha, collection, siteConfig);
//   // const { relatedContent } = primary;
//   let relatedContent: RelatedContent = {};
//   // const mergedRelatedContent = relatedContent;

//   if (primary.relatedContent) {
//     relatedContent = deepMergeObj(relatedContent, primary.relatedContent);
//   }
//   // get all related config.

//   const getMenuPromises = (collection.collections ?? []).map(
//     async (collectionItem: string) => {
//       // if (!relatedContent[collectionItem]) {
//       //   relatedContent[collectionItem] = {};
//       // }
//       const contentFolder = await getMenu(
//         branchSha,
//         siteConfig.content[
//           collectionItem as keyof typeof siteConfig.content
//         ] as ContentItem,
//         siteConfig
//       );

//       relatedContent = deepMergeObj(
//         relatedContent,
//         contentFolder.relatedContent
//       );
//       // relatedContent[collectionItem] = contentFolder.relatedContent;
//       // mergedRelatedContent = {
//       //   ...mergedRelatedContent,
//       //   ...contentFolder.relatedContent,
//       // };
//     }
//   );

//   await Promise.all(getMenuPromises);
//   logger.debug({
//     function: 'loadMenu',
//     msg: 'primary menu',
//     primay: primary,
//   });

//   return { primary: primary.primary, relatedContent };
// }

// export async function getMenu(
//   branchSha: string,
//   contentConfig: ContentItem,
//   siteConfig: SiteConfig
// ) {
//   // logger.debug({ function: 'getPrimaryMenu', contentConfig });
//   // have we cached the directory structure?
//   const cachedMenuKey = `menu:${contentConfig.path}:${branchSha}`;
//   // Check if the content is in the cache
//   let cachedMenu;
//   try {
//     cachedMenu = JSON.parse(await cacheRead(cachedMenuKey));
//   } catch (error) {
//     // Handle the error when JSON parsing fails (invalid data).
//     logger.error({
//       function: 'getMenu',
//       msg: 'Error parsing cached content',
//       error,
//     });
//     cachedMenu = null; // Or use a default value if required.
//   }
//   if (cachedMenu && cachedMenu.length > 0) {
//     logger.info({ function: 'getMenu', msg: '[Cache][HIT]', cachedMenuKey });
//     // If the content was found in the cache, return it
//     // return cachedMenu;
//   }
//   logger.info({ function: 'getMenu', msg: '[Cache][MISS]', cachedMenuKey });
//   // load the file structure
//   const files = await getDirStructure(
//     contentConfig.owner,
//     contentConfig.repo,
//     contentConfig.branch,
//     contentConfig.path,
//     '.md*'
//   );
//   // logger.debug({ function: 'getPrimaryMenu', msg: 'getDirStructure', files });

//   const contentPromises = files.map(async (file) => {
//     let matterData: MatterData | null = null;
//     const cacheKey = `github:frontmatter:${file.path}:${file.sha}`;
//     const cachedContent = await cacheRead(cacheKey);
//     if (cachedContent) {
//       return JSON.parse(cachedContent);
//     }
//     try {
//       if (file.download_url) {
//         const downloadResponse = await fetch(file.download_url);
//         const downloadBuffer = await downloadResponse.arrayBuffer();
//         const textDecoder = new TextDecoder('utf-8');

//         if (downloadBuffer) {
//           matterData = matter(textDecoder.decode(downloadBuffer), {
//             excerpt: false,
//           }).data as MatterData;
//         }
//       }
//       // convert dates to strings
//       if (matterData) {
//         Object.keys(matterData).forEach((key) => {
//           if (
//             matterData &&
//             matterData[key] &&
//             matterData[key] instanceof Date
//           ) {
//             matterData[key] = (matterData[key] as Date).toISOString();
//           }
//         });
//       }
//       await cacheWrite(
//         cacheKey,
//         JSON.stringify({ file, frontmatter: matterData })
//       ); // cache perpetually a reference to the file
//       return { file, frontmatter: matterData as FrontMatter };
//     } catch (error) {
//       logger.error({
//         function: 'getMenu',
//         msg: 'Error parsing frontmatter:',
//         file,
//         error,
//       });
//       return { file: null, frontmatter: null };
//     }
//   });
//   const content: FileContent[] = await Promise.all(contentPromises);
//   // logger.debug({ function: 'getMenu', msg: 'content', content });
//   const menu = convertToMenu(content, siteConfig);
//   // logger.debug({ function: 'getMenu', msg: 'menu', menu });
//   // write the cache
//   try {
//     await cacheWrite(cachedMenuKey, JSON.stringify(menu)); // cache for 24 hours
//   } catch (error) {
//     logger.error({
//       function: 'getMenu',
//       msg: 'Error writing cache:',
//       cachedMenuKey,
//       error,
//     });
//   }
//   return menu;
// }

// export async function loadMenu(
//   siteConfig: SiteConfig,
//   collection?: ContentItem
// ): Promise<{ primary: any[]; relatedContent: any }> {
//   if (!collection) {
//     throw new Error('Collection is undefined');
//   }
//   const branchSha = await getBranchSha(
//     collection.owner,
//     collection.repo,
//     collection.branch
//   );

//   const primary = await getMenu(branchSha, collection, siteConfig);
//   // const { relatedContent } = primary;
//   let relatedContent: RelatedContent = {};
//   // const mergedRelatedContent = relatedContent;

//   if (primary.relatedContent) {
//     relatedContent = deepMergeObj(relatedContent, primary.relatedContent);
//   }
//   // get all related config.

//   const getMenuPromises = (collection.collections ?? []).map(
//     async (collectionItem: string) => {
//       // if (!relatedContent[collectionItem]) {
//       //   relatedContent[collectionItem] = {};
//       // }
//       const contentFolder = await getMenu(
//         branchSha,
//         siteConfig.content[
//           collectionItem as keyof typeof siteConfig.content
//         ] as ContentItem,
//         siteConfig
//       );

//       relatedContent = deepMergeObj(
//         relatedContent,
//         contentFolder.relatedContent
//       );
//       // relatedContent[collectionItem] = contentFolder.relatedContent;
//       // mergedRelatedContent = {
//       //   ...mergedRelatedContent,
//       //   ...contentFolder.relatedContent,
//       // };
//     }
//   );

//   await Promise.all(getMenuPromises);
//   logger.debug({
//     function: 'loadMenu',
//     msg: 'primary menu',
//     primay: primary,
//   });
//   // logger.debug({
//   //   function: 'loadMenu',
//   //   msg: 'primary menu',
//   //   primay: primary.primary,
//   // });
//   // logger.debug({
//   //   function: 'loadMenu',
//   //   msg: 'relatedContent',
//   //   mergedRelatedContent,
//   // });

//   return { primary: primary.primary, relatedContent };
// }
