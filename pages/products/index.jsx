import React from "react";
import { siteConfig } from "../../site.config.js";
import * as matter from "gray-matter";
import { getAllFiles, getFileContent } from "@/lib/github";
import { IndexView } from "@/components/content";
import { getMenuStructure, groupMenu } from "@/lib/content";

export default function Page({ tiles, menuStructure }) {
  return (
    <IndexView menuStructure={menuStructure} title="Products" tiles={tiles} />
  );
}

async function getFrontMatter(config) {
  const files = await getAllFiles(
    config.owner,
    config.repo,
    config.branch,
    config.path,
    true,
    ".md*"
  );
  const filesPromises = files.map((file) => {
    return getFileContent(config.owner, config.repo, config.branch, file)
      .then((content) => {
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
      .catch((error) => {
        // console.error(`Error processing file ${file}: ${error}`);
        return { file: null, frontmatter: null };
      });
  });
  return await Promise.all(filesPromises);
}

export async function getServerSideProps(context) {
  // export async function getServerSideProps(context) {
  // construct menu structure

  const tiles = await getFrontMatter(siteConfig.content.products);
  const menuPromise = getMenuStructure(
    siteConfig,
    siteConfig.content.products
  );
  const menuStructure = await menuPromise;
  const groupedMenu = groupMenu(menuStructure);

  return {
    props: {
      menuStructure: groupedMenu,
      tiles: tiles,
    },
  };
}
