import React from "react";
import { siteConfig } from "../../site.config.js";
import { getFileContent } from "@/lib/github";
import { ContentPage } from "@/components/layouts";
import { getMenuStructure } from "@/lib/content";
import { usePageContent, collectionName } from "@/lib/hooks";
import { ListMenu } from '@/components/menus'
import { useSelector } from 'react-redux'

export default function Page({
  content: initialContent,
  file: initialFile,
  menuStructure: initialMenuStructure,
  collection,
  context: initialContext

}) {
  const {
    pageContent,
    contentSource,
    menuStructure,
    handleContentChange,
    handlePageReset,
    context,
    content,
  } = usePageContent(initialContent, initialFile, initialMenuStructure, collection, initialContext);


  return (
    <ContentPage
      pageContent={pageContent}
      file={initialFile}
      content={content}
      menuStructure={menuStructure}
      handleContentChange={handleContentChange}
      handlePageReset={handlePageReset}
      collection={collection}
      context={context}
      menuComponent={ListMenu}
      contentSource={contentSource}
    />

  )
}

export async function getServerSideProps(context) {
  const file = "solutions/" + context.params.solution.join("/") ;
  let pageContent = "";
  if (!file.endsWith(".etherpad")) {
    pageContent = await getFileContent(
      siteConfig.content.solutions.owner,
      siteConfig.content.solutions.repo,
      siteConfig.content.solutions.branch,
      file
    );
  }

  const pageContentText = pageContent
    ? Buffer.from(pageContent).toString("utf-8")
    : "";

  const menuPromise = getMenuStructure(
    siteConfig,
    siteConfig.content.solutions
  );
  const menuStructure = await menuPromise;


  return {
    props: {
      content: pageContentText || null,
      file: file,
      menuStructure: menuStructure || null,
      collection: siteConfig.content.solutions,
      context: { file: file, ...collectionName(file, siteConfig.content.solutions) },
      key: context.params.solution

    },
  };
}
