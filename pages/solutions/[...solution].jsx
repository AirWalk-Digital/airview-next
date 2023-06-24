
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
import { getMenuStructureSolutions } from '@/lib/content/menus';

import { Button } from '@mui/material';



export default function Page({
  content: initialContent,
  file,
  menuStructure: initialMenuStructure }) {

  const [pageContent, setContent] = useState({ content: undefined, frontmatter: undefined });

  const [content, setRawContent] = useState(initialContent);

  const [menuStructure, setMenuStructure] = useState(null);

  console.log('Solution:Page:file: ', file)

  useEffect(() => {

    let format;
    if (file && file.endsWith(".md")) {
      format = 'md';
    } else if (file && file.endsWith(".mdx")) {
      format = 'mdx';
    } else if (file && file.endsWith(".etherpad")) {
      format = 'mdx';
    }

    const { mdxContent, frontmatter } = useMDX(content, format);
    setContent({ content: mdxContent, frontmatter: frontmatter });
  }, [content])

  useEffect(() => {

    const fetchPadDetails = async (cacheKey) => {
      fetch(`/api/cache?key=${cacheKey}`)
        .then((res) => res.json())
        .then(data => {
          const padData = JSON.parse(data.content)
          if (padData.padID) {
            fetch(`/api/etherpad/pad?pad=${padData.padID}`)
              .then((res) => res.json())
              .then(data => {
                if (data.content) {
                  // setRawContent(data.content);
                  // Parse the existing frontmatter using gray-matter
                  let { content, data: frontmatter } = matter(data.content);
                  // Add padID to the frontmatter
                  frontmatter.padID = padData.padID;
                  // Stringify back to a markdown string
                  const contentWithPadID = matter.stringify(content, frontmatter);
                  setRawContent(contentWithPadID);
                }
              })

          }
          console.log('fetchPadDetails: ', padData)

        })
        .catch(error => {
          console.log(error)
        })
    }

    if (file && file.endsWith(".etherpad")) {
      console.log('fetching etherpad cache')
      const cacheKey = 'etherpad:new:/' + file
      fetchPadDetails(cacheKey)
    }

  }, [file])

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

      // Create a new object rather than mutating the existing one
      const newMenuStructure = {
        ...menuStructure,
        solutions: [
          ...(Array.isArray(initialMenuStructure?.solutions) ? initialMenuStructure.solutions : []),
          ...(Array.isArray(padsMenu?.collections?.solutions) ? padsMenu.collections.solutions : []),
        ],
        designs: [
          ...(Array.isArray(initialMenuStructure?.designs) ? initialMenuStructure.designs : []),
          ...(Array.isArray(padsMenu?.collections?.designs) ? padsMenu.collections.designs : []),
        ],
        knowledge: [
          ...(Array.isArray(initialMenuStructure?.knowledge) ? initialMenuStructure.knowledge : []),
          ...(Array.isArray(padsMenu?.collections?.knowledge) ? padsMenu.collections.knowledge : []),
        ],
      };
      setMenuStructure(newMenuStructure)
    };
    // console.log('initialMenuStructure: ', initialMenuStructure);
    fetchDataAndUpdateState();
  }, [initialMenuStructure]);


  if (pageContent.content && pageContent.frontmatter) {
    const Content = pageContent.content;

    return <SolutionView frontmatter={pageContent.frontmatter} file={file} content={content} menuStructure={menuStructure} >
      <MDXProvider components={mdComponents(context)}>
        <Content />
      </MDXProvider>
    </SolutionView>
  } else {
    return <SolutionView frontmatter={pageContent.frontmatter} file={file} menuStructure={menuStructure}>
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
  console.log('params: ', context.params.solution)
  const file = 'solutions/' + context.params.solution.join('/')
  const pageContent = await getFileContent(siteConfig.content.solutions.owner, siteConfig.content.solutions.repo, siteConfig.content.solutions.branch, file);
  const pageContentText = pageContent ? Buffer.from(pageContent).toString("utf-8") : '';
  const menuStructure = await getMenuStructureSolutions(siteConfig);

  return {
    props: {
      content: pageContentText || null,
      file: file,
      menuStructure: menuStructure || null
    },
  };
}

