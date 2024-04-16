import React from "react";
import { siteConfig } from "../../site.config.js";
import { parse } from "toml";
import { getAllFiles, getFileContent } from "@/lib/github";
import {
  usePageContent,
  collectionName,
  usePageMenu,
  LeftMenuFunction,
  LeftMenu,
  LeftMenuOpen,
} from "@/lib/hooks";
import { getMenuStructure, groupMenu, getFrontMatter } from "@/lib/content";

import { ContentPage, IndexView } from "@/components/layouts";
import { HeaderMinimalMenu } from "@/components/menus";
// import { ServicesHeader } from "@/components/headers";
import LandingPage from "@/components/landingpage";
import { dirname } from "path";

export default function Page({
  type,
  content: initialContent,
  context: initialContext,
  tiles,
  loading,
}) {
  if (type === "home") {
    return <LandingPage />;
  } else if (type === "404") {
    return <LandingPage />;
  } else if (type === "index") {
    if (loading) {
      return (
        <IndexView
          menuStructure={null}
          title="`${siteConfig.title} | ${context.path.charAt(0).toUpperCase()}${context.path.slice(1)}`"
          tiles={null}
          menuComponent={HeaderMinimalMenu}
          loading={true}
        />
      );
    }
    const { menuStructure } = usePageMenu(initialContext);

    return (
      <IndexView
        menuStructure={menuStructure}
        title={`${siteConfig.title} | ${initialContext.path.charAt(0).toUpperCase()}${initialContext.path.slice(1)}`}
        tiles={tiles}
        menuComponent={LeftMenuFunction(initialContext)}
        initialContext={initialContext}
      />
    );
  } else {
    const {
      pageContent,
      contentSource,
      menuStructure,
      handleContentChange,
      handlePageReset,
      context,
      content,
      editMode,
    } = usePageContent(initialContent, initialContext);

    console.debug("[[...path]]/index:editMode: ", editMode);

    return (
      <ContentPage
        pageContent={pageContent}
        title={`${siteConfig.title} | ${context.path.charAt(0).toUpperCase()}${context.path.slice(1)}`}
        content={content}
        menuStructure={menuStructure}
        handleContentChange={handleContentChange}
        handlePageReset={handlePageReset}
        collection={initialContext}
        context={context}
        menuComponent={LeftMenuFunction(context)}
        isLoading={loading}
        headerComponent={null}
        sideComponent={null}
        menuOpen={LeftMenuOpen(context)}
      />
    );
  }
}

export async function getServerSideProps(context) {
  let file;
  let type = "";
  let tiles = [];
  // console.log("/[...path]]:getServerSideProps:context: ", context);
  if (context.params.path && siteConfig.content[context.params.path[0]]) {
    file = context.params.path.join("/");
    let pageContent = "";
    let pageContentText;
    switch (context.params.path.length) {
      case 1:
        type = "index";
        file = context.params.path.join("/");
        const allTiles = await getFrontMatter(
          siteConfig.content[context.params.path[0]]
        );
          console.log("allTiles: ", allTiles);
        tiles = allTiles.filter((tile) => {
          const parts = tile.file.split("/"); // Split the file path by '/'
          const fileName = parts[parts.length - 1]; // Get the last part (file name)
          // Check if the path has exactly 3 parts and the file name is 'index.md' or 'index.mdx'
          return (
            parts.length === 3 &&
            (fileName === "_index.md" || fileName === "_index.mdx")
          );
        });
        break;
      default:
        if (!file.endsWith(".etherpad")) {
          pageContent = await getFileContent(
            siteConfig.content[context.params.path[0]].owner,
            siteConfig.content[context.params.path[0]].repo,
            siteConfig.content[context.params.path[0]].branch,
            file
          );
        }
    
        pageContentText = pageContent
          ? Buffer.from(pageContent).toString("utf-8")
          : "";
        type = "content";
        file = context.params.path.join("/");
        break;
    }

    return {
      props: {
        type: type,
        content: pageContentText || "",
        context: {
          file: file,
          ...collectionName(file, siteConfig.content[context.params.path[0]]),
        },
        tiles: tiles || null,
        key: context.params.path,
      },
    };
  } else if (context.resolvedUrl === "/") {
    type = "home";

    return {
      props: {
        type: type,
        content: null,
        context: null,
        key: "home",
      },
    };
  } else {
    type = "404";
    return { notFound: true };
  }
}
