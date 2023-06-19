
import React from 'react'
import { siteConfig } from "../../site.config.js";
import * as matter from 'gray-matter';
import { getAllFiles, getFileContent } from '@/lib/github'
import { IndexView } from '@/components/solutions'

export default function Page({ solutions, knowledge }) {
  return <IndexView knowledge={knowledge} solutions={solutions} />
};

export async function getStaticProps(context) {
  // construct menu structure

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

  return {
    props: {
      solutions: solutionsContent,
      knowledge: knowledgeContent
    },
  };
}

