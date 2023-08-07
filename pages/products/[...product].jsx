import React from "react";
import { siteConfig } from "../../site.config.js";
import { getFileContent } from "@/lib/github";
import { ContentPage } from "@/components/content";
import { getMenuStructure } from "@/lib/content";
import { usePageContent } from "@/lib/hooks";
import { HeaderMinimalMenu } from '@/components/dashboard/Menus'

export default function Page({
  content: initialContent,
  file: initialFile,
  menuStructure: initialMenuStructure,
  collection
}) {

  const {
    pageContent,
    contentSource,
    menuStructure,
    handleContentChange,
    handlePageReset,
    context,
    content,
  } = usePageContent(initialContent, initialFile, initialMenuStructure, collection);

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
      menuComponent={HeaderMinimalMenu}
      contentSource={contentSource}
    />

  )
}

export async function getServerSideProps(context) {
  const file = "products/" + context.params.product.join("/");
  let pageContent = "";
  if (!file.endsWith(".etherpad")) {
    pageContent = await getFileContent(
      siteConfig.content.products.owner,
      siteConfig.content.products.repo,
      siteConfig.content.products.branch,
      file
    );
  }

  const pageContentText = pageContent
    ? Buffer.from(pageContent).toString("utf-8")
    : "";

  const menuPromise = getMenuStructure(
    siteConfig,
    siteConfig.content.products
  );
  const menuStructure = await menuPromise;


  return {
    props: {
      content: pageContentText || null,
      file: file,
      menuStructure: menuStructure || null,
      collection: siteConfig.content.products,
    },
  };
}
