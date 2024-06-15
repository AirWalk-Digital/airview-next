
import type { Metadata } from 'next'
import matter from 'gray-matter';

import React from "react";
import { IndexTiles, LandingPage, MenuWrapper, ContentViewer, ContentLoader, ContentPrint } from "@/components/Layouts";
import { siteConfig } from "../../../../site.config";
import { notFound } from "next/navigation";
import { getFileContent } from "@/lib/Github";
import { getLogger } from '@/lib/Logger';
import type { ContentItem, MatterData } from '@/lib/Types';
import { loadMenu, nestMenu } from '@/lib/Content/loadMenu';
const logger = getLogger().child({ namespace: 'docs/page' });
logger.level = 'error';
export const metadata: Metadata = {
  title: "Airview",
  description: "Airview AI",
};


async function checkFrontmatter(content: string, context: ContentItem) {
  const matterData = matter(content, {
              excerpt: false,
            }).data as MatterData;
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
  if (matterData && matterData.external_repo && matterData.external_owner && matterData.external_path && matterData.git_provider) {
    const { external_repo, external_owner, external_path } = matterData;
    const owner = external_owner as string;
    const repo = external_repo as string;
    const branch = context.branch
    const file = external_path as string;
    let pageContent;
    try {
      pageContent = await getFileContent({owner, repo, path: file});
    } catch (error) {
      logger.error({ msg: 'checkFrontmatter: ', error});
    }
    let linkedContent = "";
    if (pageContent && pageContent.content ) {
      linkedContent = pageContent?.content
        ? Buffer.from(pageContent.content).toString()
        : "";
    }
    return { content: linkedContent, context: { ...context, owner, repo, branch, file } };
    
  } else {
    return { content, context}
  }
}

export default async function Page({
  params,
}: {
  params: { path?: string[] };
}) {
  if (
    params.path &&
    params.path[0] &&
    siteConfig.content[params.path[0] as keyof typeof siteConfig.content]
  ) {
    let isPrint = false;
    let path = params.path;

    if (path[path.length - 1] === 'print') {
      path = path.slice(0, -1);
      isPrint = true;
    }

    let file = '';

    // if 'related_config' is somewhere in the path, then the file is the last element in the path
    if (path.includes('related_content')) {
      // join all the parts after related_config
      file = path.slice(path.indexOf('related_content') + 1).join("/") as string;
    } else {
      file = path.join("/") as string;
    }

    // const file = path.join("/") as string;
    let pageContent;
    let pageContentText;
    let loading = false;
    const contentKey = params.path[0] as keyof typeof siteConfig.content;
    const contentConfig = {
      ...siteConfig?.content?.[contentKey],
      file: file,
    } as ContentItem;

    const menuConfig = (contentConfig : ContentItem) => {
      if (contentConfig.menu && contentConfig.menu.collection ) {
        return siteConfig?.content?.[contentConfig?.menu?.collection as keyof typeof siteConfig.content] || contentConfig as ContentItem;
      } else {
        return contentConfig;
      }
    }

    switch (params.path.length) {
      case 0:
        notFound();
      case 1:
        // index page
        // const content = await loadMenu(siteConfig, contentConfig);
        const content = await loadMenu(siteConfig, menuConfig(contentConfig));
        const { menu: menuStructure } = nestMenu(content, 'docs');
        logger.debug({ msg: 'menuStructure: ', menuStructure});
        return (
          <main>
            <MenuWrapper
              // title={`${siteConfig.title} | ${contentConfig?.path?.charAt(0).toUpperCase()}${contentConfig?.path?.slice(1)}`}
              menuComponent='HeaderMinimalMenu'
              menuStructure={menuStructure}
              loading={loading}
              context={contentConfig}>
              { contentConfig ? <IndexTiles initialContext={{ ...contentConfig, source: '' }} /> : <></> }
              </MenuWrapper>
              </main>
        )

      default:
        // content page
        if (file.endsWith(".md") || file.endsWith(".mdx")) {
          // const contentKey = params.path[0] as keyof typeof siteConfig.content;
          // const contentConfig = siteConfig?.content?.[contentKey];

          if (contentConfig?.owner && contentConfig?.repo && contentConfig?.branch && file) {
            const { owner, repo, branch } = contentConfig;
            pageContent = await getFileContent({owner, repo, path: file, branch});
            if (pageContent && pageContent.content ) {
              pageContentText = pageContent?.content
                  ? Buffer.from(pageContent.content).toString()
                  : "";
            }

            const { content: linkedPageContentText, context } = await checkFrontmatter(pageContentText || '', contentConfig); // check for frontmatter context
            pageContentText = linkedPageContentText;
            
            logger.debug({ msg: 'context: ', context});
            

            const content = await loadMenu(siteConfig, menuConfig(contentConfig));
            const { menu: menuStructure } = nestMenu(content, 'docs');

            if (pageContent && pageContent.content && pageContentText ) {

              if (isPrint) {
                return (
                  <main>
                    <ContentPrint>
                    <ContentLoader pageContent={pageContentText} context={ contentConfig } loading={loading} />
                    </ContentPrint>
                  </main>
                );
              }
              
            return (
              <main>
                <MenuWrapper
                      // title={`${siteConfig.title} | ${contentConfig?.path?.charAt(0).toUpperCase()}${contentConfig?.path?.slice(1)}`}
                      menuComponent='HeaderMinimalMenu'
                      menuStructure={menuStructure}
                      loading={loading}
                        context={contentConfig}>
                <ContentViewer pageContent={pageContentText} contributors={pageContent.contributors} context={ contentConfig } loading={loading} relatedContent={content.relatedContent} />
                </MenuWrapper>
              </main>
            );
          } else {
            notFound();
          }


          } else {
            notFound();
          }
        }
        
        break;
    }
    notFound();

  } else {
    return (
      <main>
        <LandingPage />
      </main>
    );
  }
}

// export async function getServerSideProps(context) {
//   let file;
//   let type = "";
//   let tiles = [];
//   // console.log("/[...path]]:getServerSideProps:context: ", context);
//   if (context.params.path && siteConfig.content[context.params.path[0]]) {
//     file = context.params.path.join("/");
//     let pageContent = "";
//     let pageContentText;
//     switch (context.params.path.length) {
//       case 1:
//         type = "index";
//         file = context.params.path.join("/");
//         const allTiles = await getFrontMatter(
//           siteConfig.content[context.params.path[0]]
//         );
//           console.log("allTiles: ", allTiles);
//         tiles = allTiles.filter((tile) => {
//           const parts = tile.file.split("/"); // Split the file path by '/'
//           const fileName = parts[parts.length - 1]; // Get the last part (file name)
//           // Check if the path has exactly 3 parts and the file name is 'index.md' or 'index.mdx'
//           return (
//             parts.length === 3 &&
//             (fileName === "_index.md" || fileName === "_index.mdx")
//           );
//         });
//         break;
//       default:
//         if (!file.endsWith(".etherpad")) {
//           pageContent = await getFileContent(
//             siteConfig.content[context.params.path[0]].owner,
//             siteConfig.content[context.params.path[0]].repo,
//             siteConfig.content[context.params.path[0]].branch,
//             file
//           );
//         }

//         pageContentText = pageContent
//           ? Buffer.from(pageContent).toString("utf-8")
//           : "";
//         type = "content";
//         file = context.params.path.join("/");
//         break;
//     }

//     return {
//       props: {
//         type: type,
//         content: pageContentText || "",
//         context: {
//           file: file,
//           ...collectionName(file, siteConfig.content[context.params.path[0]]),
//         },
//         tiles: tiles || null,
//         key: context.params.path,
//       },
//     };
//   } else if (context.resolvedUrl === "/") {
//     type = "home";

//     return {
//       props: {
//         type: type,
//         content: null,
//         context: null,
//         key: "home",
//       },
//     };
//   } else {
//     type = "404";
//     return { notFound: true };
//   }
// }
