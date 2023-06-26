
import React, { useState, useEffect } from 'react'
import { siteConfig } from "../../site.config.js";
import { mdComponents } from "../../constants/mdxProvider";
import * as matter from 'gray-matter';
import { MDXProvider } from '@mdx-js/react';
import { getAllFiles, getFileContent } from '@/lib/github'
import { useMDX } from '@/lib/content/mdx'

import { SolutionView } from '@/components/solutions'

import { FullScreenSpinner } from '@/components/dashboard/index.js';
import { dirname, basename } from 'path';
import { getMenuStructure } from '@/lib/content/menus';

import { Button } from '@mui/material';
import { fetchPadDetails } from '@/lib/etherpad'


export default function Page({
  content: initialContent,
  file,
  menuStructure: initialMenuStructure }) {

  const [pageContent, setContent] = useState({ content: undefined, frontmatter: undefined });

  const [content, setRawContent] = useState(initialContent);

  const [menuStructure, setMenuStructure] = useState(null);
  const [rev, setRev] = useState(0);

  const handleContentClick = async (url, label) => {
    console.log('Content Clicked: label: ', label, ' url: ', url)

    if (url && url.endsWith(".etherpad")) { // load the pad
      const cacheKey = 'etherpad:new:/' + url
      const { rev, rawContent, frontmatter } = await fetchPadDetails(cacheKey);
      const pad = await fetchPadDetails(cacheKey);
      console.log('handleContentClick: ', pad)

      if (pad.rawContent && pad.frontmatter) {
        setRev(pad.rev);
        setRawContent(matter.stringify(pad.rawContent, pad.frontmatter));
      }
    } else if (url) { // load from github
      try {
        const response = await fetch(`/api/content/${siteConfig.content.solutions.owner}/${siteConfig.content.solutions.repo}?branch=${siteConfig.content.solutions.branch}&path=${url}`);
        if (response.ok) {
          const data = await response.text();
          // console.log('handleContentClick:data: ', data);
          // const content = Buffer.from(data ?? "", "base64").toString("utf8");
          // console.log('handleContentClick:content: ', content);
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
    console.log('useEffect:MDX:File: ', file)
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
        console.log('useEffect:fetchData1: ', padDetails);
  
        if (padDetails && padDetails.rawContent && padDetails.frontmatter) {
          console.log('useEffect:fetchData2: ', padDetails);
  
          setRev(padDetails.rev);
          setRawContent(matter.stringify(padDetails.rawContent, padDetails.frontmatter));
        }
      };
  
      fetchDataAndSetState();
    }
  }, [file]);
  


  const context = { file: file, ...siteConfig.content.solutions };

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

      const newMenuStructure = {
        ...initialMenuStructure,
        primary: [
          ...(Array.isArray(initialMenuStructure?.primary) ? initialMenuStructure.primary : []),
          ...(Array.isArray(padsMenu?.collections?.solutions) ? padsMenu.collections.solutions : []),
        ],
        relatedContent: {
          ...initialMenuStructure?.relatedContent,
          ...Object.keys(padsMenu?.relatedContent || {}).reduce((acc, key) => {
            acc[key] = {
              ...initialMenuStructure?.relatedContent?.[key],
              ...padsMenu?.relatedContent?.[key]
            };
            return acc;
          }, {})
        }
      };

      console.log('fetchDataAndUpdateState:newMenuStructure: ', newMenuStructure);

      setMenuStructure(newMenuStructure);
    };

    // console.log('initialMenuStructure: ', initialMenuStructure);
    fetchDataAndUpdateState();
  }, [initialMenuStructure]);


  if (pageContent.content && pageContent.frontmatter) {
    const Content = pageContent.content;

    return <SolutionView frontmatter={pageContent.frontmatter} file={file} content={content} menuStructure={menuStructure} handleContentClick={handleContentClick}>
      <MDXProvider components={mdComponents(context)}>
        <Content />
      </MDXProvider>
    </SolutionView>
  } else {
    return <SolutionView frontmatter={pageContent.frontmatter} file={file} menuStructure={menuStructure} handleContentClick={handleContentClick}>
      <MDXProvider components={mdComponents(context)}>
        <FullScreenSpinner />
      </MDXProvider>
    </SolutionView>
  }
};

export async function getStaticPaths() {
  let pages = [];
  try {
    const solutions = await getAllFiles(siteConfig.content.solutions.owner, siteConfig.content.solutions.repo, siteConfig.content.solutions.branch, siteConfig.content.solutions.path, true, '.md*');
    pages = solutions
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
  // console.log('params: ', context.params.solution)
  const file = 'solutions/' + context.params.solution.join('/')
  let pageContent = '';
  if (!file.endsWith(".etherpad")) { pageContent = await getFileContent(siteConfig.content.solutions.owner, siteConfig.content.solutions.repo, siteConfig.content.solutions.branch, file); };
  const pageContentText = pageContent ? Buffer.from(pageContent).toString("utf-8") : '';
  const menuStructure = await getMenuStructure(siteConfig, siteConfig.content.solutions);

  return {
    props: {
      content: pageContentText || null,
      file: file,
      menuStructure: menuStructure || null
    },
  };
}

