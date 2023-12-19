import React from "react";
import { siteConfig } from "../../site.config.js";
import { parse } from "toml";
import { getAllFiles, getFileContent } from "@/lib/github";
import { usePageContent, collectionName, usePageMenu } from "@/lib/hooks";
import { getMenuStructure, groupMenu, getFrontMatter } from "@/lib/content";

import { ContentPage, IndexView } from "@/components/layouts";
import {
  FullHeaderMenu,
  HeaderMinimalMenu,
  DummyMenu,
} from "@/components/menus";
// import { ServicesHeader } from "@/components/headers";
import LandingPage from "@/components/landingpage";
import { dirname } from "path";

export default function Page({
  type,
  content: initialContent,
  file: initialFile,
  menuStructure: initialMenuStructure,
  collection,
  context: initialContext,
  tiles,
  loading,
}) {


  const LeftMenuOpen = () => {

    if (collection && collection.menu && collection.menu) {

      switch (collection.menu.component) {

        case "DummyMenu":

          return false;
        default:
          return true;
      }
    } else {
      return true;
    }
  };

  const LeftMenuFunction = () => {
    if (collection && collection.menu && collection.menu.component) {
      switch (collection.menu.component) {
        case "DummyMenu":
          return DummyMenu;
        case "FullHeaderMenu":
          return FullHeaderMenu;
        case "HeaderMinimalMenu":
          return HeaderMinimalMenu;
        default:
          return FullHeaderMenu;
      }
    } else {
      return FullHeaderMenu;
    }
  };



  if (type === "home") {
    return <LandingPage />;
  } else if (type === "index") {
    if (loading) {
      return (
        <IndexView
          menuStructure={null}
          title=""
          tiles={null}
          menuComponent={HeaderMinimalMenu}
          loading={true}
        />
      );
    }
    const { menuStructure } = usePageMenu(initialMenuStructure, collection);

    return (
      <IndexView
        menuStructure={menuStructure}
        title=""
        tiles={tiles}
        menuComponent={LeftMenuFunction()}
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
    } = usePageContent(
      initialContent,
      initialFile,
      initialMenuStructure,
      collection,
      initialContext
    );

    return (
      <ContentPage
        pageContent={pageContent}
        file={initialFile}
        content={content}
        menuStructure={menuStructure}
        handleContentChange={handleContentChange}
        handlePageReset={handlePageReset}
        collection={initialContext}
        context={context}
        menuComponent={LeftMenuFunction()}
        menuOpen={LeftMenuOpen()}
        contentSource={contentSource}
        
        // headerComponent={(props) => (
        //   <ServicesHeader {...props} extraData={controls} />
        // )}
        // sideComponent={(props) => <ControlsMenu {...props} controls={controls} />}
        isLoading={loading}
      />
    );
  }
}

export async function getServerSideProps(context) {
  let file;
  let type = "";
  let tiles = [];
  if (context.params.path) {
    file = context.params.path.join("/");
    let pageContent = "";
    if (!file.endsWith(".etherpad")) {
      pageContent = await getFileContent(
        siteConfig.content[context.params.path[0]].owner,
        siteConfig.content[context.params.path[0]].repo,
        siteConfig.content[context.params.path[0]].branch,
        file
      );
    }

    const menuContext = () => {
      if (siteConfig.content[context.params.path[0]].menu && siteConfig.content[context.params.path[0]].menu.collection) {
        return siteConfig.content[siteConfig.content[context.params.path[0]].menu.collection]
      } else {
        return siteConfig.content[context.params.path[0]]
      }
    }

    const pageContentText = pageContent
      ? Buffer.from(pageContent).toString("utf-8")
      : "";

    const menuPromise = getMenuStructure(
      siteConfig,
      menuContext()
    );
    const menuStructure = await menuPromise;

    console.log(
      "/[...path]]:getServerSideProps: ",
      collectionName(file, context.params.path[0])
    );

    const collection = collectionName(
      file,
      siteConfig.content[context.params.path[0]]
    );
    console.log("/[...path]]:getServerSideProps:collection: ", collection);

    switch (context.params.path.length) {
      case 1:
        type = "index";
        file = context.params.path.join("/");
        const allTiles = await getFrontMatter(
          siteConfig.content[context.params.path[0]]
        );

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
        type = "content";
        file = context.params.path.join("/");
        break;
    }

    return {
      props: {
        type: type,
        content: pageContentText || "",
        file: file,
        menuStructure: menuStructure || "",
        collection: siteConfig.content[collection.path],
        context: {
          file: file,
          ...collectionName(file, siteConfig.content[context.params.path[0]]),
        },
        tiles: tiles || null,
        key: context.params.path,
      },
    };
  } else {
    type = "home";

    return {
      props: {
        type: type,
        content: null,
        file: null,
        menuStructure: null,
        collection: null,
        context: null,
        key: "home",
      },
    };
  }
}
