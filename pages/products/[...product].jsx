import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'

import { siteConfig } from "../../site.config.js";
import { mdComponents } from "../../constants/mdxProvider.js";
import * as matter from "gray-matter";
import { MDXProvider } from "@mdx-js/react";
import { getAllFiles, getFileContent } from "@/lib/github";
import { useMDX } from "@/lib/content/mdx";

import { ContentPage } from "@/components/content";

import { FullScreenSpinner } from "@/components/dashboard/index.js";
import { dirname, basename } from "path";

import { Button } from "@mui/material";
import { fetchPadDetails } from "@/lib/etherpad";
import { getMenuStructure, githubExternal } from "@/lib/content";
import { groupMenu } from "@/lib/content/menu";
import { ContentWrapperContext } from '@/components/content'
import { usePageContent } from "@/lib/hooks";


export default function Page({
  content: initialContent,
  file: initialFile,
  menuStructure: initialMenuStructure,
  collection
}) {

  const {
    pageContent,
    file,
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
  // frontMatterCallback={frontMatterCallback} 
  contentSource={contentSource}
   />

  )
}




export async function getServerSideProps(context) {
  // // console.log('params: ', context.params.solution)
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


  const menuStructure = await getMenuStructure(
    siteConfig,
    siteConfig.content.products
  );

  return {
    props: {
      content: pageContentText || null,
      file: file,
      menuStructure: menuStructure || null,
      collection: siteConfig.content.products,
    },
  };
}








function mergeObjects(obj1, obj2) {
  if (!obj1 || typeof obj1 !== "object") {
    return obj2;
  }
  if (!obj2 || typeof obj2 !== "object") {
    return obj1;
  }

  const merged = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (Array.isArray(obj2[key])) {
        if (merged.hasOwnProperty(key) && Array.isArray(merged[key])) {
          merged[key] = [...merged[key], ...obj2[key]];
        } else {
          merged[key] = obj2[key];
        }
      } else {
        merged[key] = mergeObjects(merged[key], obj2[key]);
      }
    }
  }

  return merged;
}
