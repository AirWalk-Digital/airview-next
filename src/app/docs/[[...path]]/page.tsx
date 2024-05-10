
import type { Metadata } from 'next'

import React from "react";
import { IndexTiles, LandingPage, MenuWrapper, ContentViewer, ContentLoader, ContentPrint } from "@/components/Layouts";
import { siteConfig } from "../../../../site.config";
import { notFound } from "next/navigation";
import { getFileContent } from "@/lib/Github";
import { getLogger } from '@/lib/Logger';
import type { ContentItem } from '@/lib/Types';
import { loadMenu } from '@/lib/Content/loadMenu';
const logger = getLogger().child({ namespace: 'docs/page' });

export const metadata: Metadata = {
  title: "Airview",
  description: "Airview AI",
};

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
    const file = path.join("/") as string;
    let pageContent;
    let pageContentText;
    let loading = false;
    const contentKey = params.path[0] as keyof typeof siteConfig.content;
    const contentConfig = {
      ...siteConfig?.content?.[contentKey],
      file: file,
    } as ContentItem;

    switch (params.path.length) {
      case 0:
        notFound();
      case 1:
        // index page
        const menuStructure = await loadMenu(siteConfig, contentConfig);
        logger.debug({ msg: 'menuStructure: ', menuStructure});
        return (
          <main>
            <MenuWrapper
              // title={`${siteConfig.title} | ${contentConfig?.path?.charAt(0).toUpperCase()}${contentConfig?.path?.slice(1)}`}
              menuComponent='HeaderMinimalMenu'
              menuStructure={menuStructure.primary}
              loading={loading}>
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
            pageContent = await getFileContent(owner, repo, branch, file);
            if (pageContent && pageContent.content ) {
              pageContentText = pageContent?.content
                  ? Buffer.from(pageContent.content).toString()
                  : "";
            }
          } else {
            notFound();
          }
        }
        
        break;
    }

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
              menuStructure={undefined}
              loading={true}>
        <ContentViewer pageContent={pageContentText} contributors={pageContent.contributors} context={ contentConfig } loading={loading} />
        </MenuWrapper>
      </main>
    );
  } else {
    notFound();
  }
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
