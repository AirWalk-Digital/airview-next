
import React, { useState, useEffect } from 'react'
import { siteConfig } from "../../site.config.js";
import { mdComponents } from "../../constants/mdxProvider.js";
import * as matter from 'gray-matter';
import { MDXProvider } from '@mdx-js/react';
import { getAllFiles, getFileContent } from '@/lib/github'
import { useMDX } from '@/lib/content/mdx'

import { ContentView } from '@/components/content'

import { FullScreenSpinner } from '@/components/dashboard/index.js';
import { dirname, basename } from 'path';

import { Button } from '@mui/material';
import { fetchPadDetails } from '@/lib/etherpad'
import { getMenuStructure } from '@/lib/content';
import { groupMenu } from '@/lib/content/menu'


export default function Page({
  content: initialContent,
  file,
  menuStructure: initialMenuStructure,
  pageStructure: initialPageStructure }) {

  const [pageContent, setContent] = useState({ content: undefined, frontmatter: undefined });

  const [content, setRawContent] = useState(initialContent);
  const [pageStructure, setPageStructure] = useState(null);
  const [menuStructure, setMenuStructure] = useState(initialMenuStructure);
  const [rev, setRev] = useState(0);

  const handleContentClick = async (url, label) => {
    // console.log('Content Clicked: label: ', label, ' url: ', url)

    if (url && url.endsWith(".etherpad")) { // load the pad
      const cacheKey = 'etherpad:/' + url
      const { rev, rawContent, frontmatter } = await fetchPadDetails(cacheKey);
      const pad = await fetchPadDetails(cacheKey);
      // console.log('handleContentClick: ', pad)

      if (pad.rawContent && pad.frontmatter) {
        setRev(pad.rev);
        setRawContent(matter.stringify(pad.rawContent, pad.frontmatter));
      }
    } else if (url) { // load from github
      try {
        const response = await fetch(`/api/content/${siteConfig.content.providers.owner}/${siteConfig.content.providers.repo}?branch=${siteConfig.content.providers.branch}&path=${url}`);
        if (response.ok) {
          const data = await response.text();
          setRawContent(data);
        } else {
          throw new Error('Error fetching files');
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    }


  };

  useEffect(() => {
    // console.log('useEffect:MDX:File: ', file)
    let format;
    if (file && file.endsWith(".md")) {
      format = 'md';
    } else if (file && file.endsWith(".mdx")) {
      format = 'mdx';
    } else if (file && file.endsWith(".etherpad")) {
      format = 'mdx';
    } else {
      format = 'mdx;'
    }
    const { mdxContent, frontmatter } = useMDX(content, format);
    setContent({ content: mdxContent, frontmatter: frontmatter });
  }, [content])

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = 'etherpad:new:/' + file;
      try {
        const pad = await fetchPadDetails(cacheKey);
        return pad;
      } catch (error) {
        console.error('Error fetching pad details:', error);
        return null;
      }
    };

    if (file && file.endsWith(".etherpad")) {
      const fetchDataAndSetState = async () => {
        const padDetails = await fetchData();
        // console.log('useEffect:fetchData1: ', padDetails);

        if (padDetails && padDetails.rawContent && padDetails.frontmatter) {
          // console.log('useEffect:fetchData2: ', padDetails);

          setRev(padDetails.rev);
          setRawContent(matter.stringify(padDetails.rawContent, padDetails.frontmatter));
        }
      };

      fetchDataAndSetState();
    }
  }, [file]);



  const context = { file: file, ...siteConfig.content.customers };

  // load additional menu items from the Etherpad cache
  useEffect(() => {
    const fetchPadMenu = async () => {
      const res = await fetch(`/api/structure?cache=true`);
      const data = await res.json();
      return data;
    };

    const fetchDataAndUpdateState = async () => {
      const padsMenu = await fetchPadMenu();

      let directory = file && file.includes("/") ? file.split("/")[1] : '';


      const newPageStructure = mergeObjects(padsMenu, initialPageStructure);

      const newMenuStructure2 = {
        ...initialPageStructure,
        primary: [
          ...(Array.isArray(initialPageStructure?.primary) ? initialPageStructure.primary : []),
          ...(Array.isArray(padsMenu?.collections?.providers) ? padsMenu.collections.providers : []),
        ],
        relatedContent: {
          ...initialPageStructure?.relatedContent,
          ...Object.keys(padsMenu?.relatedContent || {}).reduce((acc, key) => {
            acc[key] = {
              ...initialPageStructure?.relatedContent?.[key],
              ...padsMenu?.relatedContent?.[key]
            };
            return acc;
          }, {})
        }
      };
      // console.log('fetchDataAndUpdateState:padsMenu: ', padsMenu);

      // console.log('fetchDataAndUpdateState:newMenuStructure: ', newPageStructure);

      setPageStructure(newPageStructure);

      const newMenuStructure = groupMenu(newPageStructure)
      setMenuStructure(newMenuStructure)

    };

    // // console.log('initialMenuStructure: ', initialMenuStructure);
    fetchDataAndUpdateState();
  }, [initialPageStructure]);


  if (pageContent.content && pageContent.frontmatter) {
    const Content = pageContent.content;

    return <ContentView frontmatter={pageContent.frontmatter} file={file} content={content} menuStructure={menuStructure} pageStructure={pageStructure} handleContentClick={handleContentClick} siteConfig={siteConfig} >
      <MDXProvider components={mdComponents(context)}>
        <Content />
      </MDXProvider>
    </ContentView>
  } else {
    return <ContentView frontmatter={pageContent.frontmatter} file={file} menuStructure={menuStructure} pageStructure={pageStructure} handleContentClick={handleContentClick} siteConfig={siteConfig}>
      <MDXProvider components={mdComponents(context)}>
        <FullScreenSpinner />
      </MDXProvider>
    </ContentView>
  }
};

export async function getStaticPaths() {
  let pages = [];
  try {
    const pageFiles = await getAllFiles(siteConfig.content.customers.owner, siteConfig.content.customers.repo, siteConfig.content.customers.branch, siteConfig.content.customers.path, true, '.md*');
    pages = pageFiles
      .filter((file) => basename(file) !== 'README.md')
      .map((file) => { return '/' + file });

    return {
      fallback: true,
      paths: pages
    }
  } catch (error) {
    console.error(error)
    return {
      fallback: true,
      paths: pages
    }
  }
}

export async function getStaticProps(context) {
  // // console.log('params: ', context.params.solution)
  const file = 'customers/' + context.params.customer.join('/')
  let pageContent = '';
  if (!file.endsWith(".etherpad")) { pageContent = await getFileContent(siteConfig.content.customers.owner, siteConfig.content.customers.repo, siteConfig.content.customers.branch, file); };
  const pageContentText = pageContent ? Buffer.from(pageContent).toString("utf-8") : '';

  const structurePromise = getMenuStructure(siteConfig, siteConfig.content.customers);

  const pageStructure = await structurePromise

  const groupedMenu = groupMenu(pageStructure);
  // const menuStructure = await getMenuStructure(siteConfig, siteConfig.content.providers);

  return {
    props: {
      content: pageContentText || null,
      file: file,
      menuStructure: groupedMenu || null,
      pageStructure: pageStructure || null
    },
  };
}


function mergeObjects(obj1, obj2) {
  if (!obj1 || typeof obj1 !== 'object') {
    return obj2;
  }
  if (!obj2 || typeof obj2 !== 'object') {
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
