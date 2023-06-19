
import React, { useState, useEffect } from 'react'
import { siteConfig } from "../../site.config.js";
import { mdComponents } from "../../constants/mdxProvider";
import * as matter from 'gray-matter';
import { parse } from 'toml';
import { MDXProvider } from '@mdx-js/react';
import { getAllFiles, getFileContent } from '@/lib/github'
import { useMDX } from '@/lib/content/mdx'

import { SolutionView } from '@/components/solutions'

import { FullScreenSpinner } from '@/components/dashboard/index.js';
import { dirname, basename } from 'path';

export default function Page({
  knowledge,
  solutions,
  designs,
  content,
  file }) {

  const [pageContent, setContent] = useState({ content: undefined, frontmatter: undefined });

  useEffect(() => {
    let format;
    if (file.endsWith(".md")) {
      format = 'md';
    } else {
      format = 'mdx';
    }

    // if (content) {content = '<SlidePage>\n' + content + '\n</SlidePage>'}

    const { mdxContent, frontmatter } = useMDX(content, format);
    setContent({ content: mdxContent, frontmatter: frontmatter });
  }, [content])

  const context = { file: file, ...siteConfig.content.solutions };

  if (pageContent.content && pageContent.frontmatter) {
    const Content = pageContent.content;
    return <SolutionView solutions={solutions} designs={designs} knowledge={knowledge} frontmatter={pageContent.frontmatter} file={file} content={content} >
      <MDXProvider components={mdComponents(context)}>
        <Content />
      </MDXProvider>
    </SolutionView>
  } else {
    return <SolutionView solutions={solutions} designs={designs} knowledge={knowledge} frontmatter={pageContent.frontmatter} file={file} >
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
    // const pages = services.map((file) => {
    //   return file
    // })
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

  const solutions = await getAllFiles(siteConfig.content.solutions.owner, siteConfig.content.solutions.repo, siteConfig.content.solutions.branch, siteConfig.content.solutions.path, true, '.md*');
  const knowledge = await getAllFiles(siteConfig.content.knowledge.owner, siteConfig.content.knowledge.repo, siteConfig.content.knowledge.branch, siteConfig.content.knowledge.path, true, '.md*');

  const solutionsContentPromises = solutions.map((file) => {
    return getFileContent(
      siteConfig.content.solutions.owner,
      siteConfig.content.solutions.repo,
      siteConfig.content.solutions.branch,
      file
    )
      .then(content => {
        const matterData = matter(content, { excerpt: false }).data || null;
        if (matterData) {
          for (let key in matterData) {
            if (matterData[key] instanceof Date) {
              matterData[key] = matterData[key].toISOString();
            }
          }
        }
        return { file: file, frontmatter: matterData };
      })
      .catch(error => {
        // console.error(`Error processing file ${file}: ${error}`);
        return { file: null, frontmatter: null };
      });
  });

  const solutionsContent = await Promise.all(solutionsContentPromises);

  const knowledgeContentPromises = knowledge.map((file) => {
    return getFileContent(
      siteConfig.content.knowledge.owner,
      siteConfig.content.knowledge.repo,
      siteConfig.content.knowledge.branch,
      file
    )
      .then(content => {
        const matterData = matter(content, { excerpt: false }).data || null;
        return { file: file, frontmatter: matterData };
      })
      .catch(error => {
        console.error(`Error processing file ${file}: ${error}`);
        return null; // or however you want to handle errors for each file
      });
  });

  const knowledgeContent = await Promise.all(knowledgeContentPromises);

  const file = 'solutions/' + context.params.solution.join('/')
  const pageContent = await getFileContent(siteConfig.content.solutions.owner, siteConfig.content.solutions.repo, siteConfig.content.solutions.branch, file);
  const pageContentText = pageContent ? Buffer.from(pageContent).toString("utf-8") : '';

  return {
    props: {
      solutions: solutionsContent,
      knowledge: knowledgeContent,
      designs: null,
      content: pageContentText || null,
      file: file,
    },
  };
}

