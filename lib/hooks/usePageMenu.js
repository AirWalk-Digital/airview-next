import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
// import { useMDX } from "@/lib/content/mdx";
import { fetchPadDetails } from "@/lib/etherpad";
import { githubExternal } from "@/lib/content";
import * as provider from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
import { evaluateSync } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkUnwrapImages from 'remark-unwrap-images';
import withSlugs from "rehype-slug"
import withToc from "@stefanprobst/rehype-extract-toc"
import withTocExport from "@stefanprobst/rehype-extract-toc/mdx"
import * as matter from 'gray-matter';
import deepEqual from 'deep-equal';
import { useMDX } from '@/lib/content/mdx'

import path from 'path';



export function usePageMenu(initialMenuStructure, collection) {

  const [menuStructure, setMenuStructure] = useState(null);

  useEffect(() => { // add to the menu structure
    const fetchPadMenu = async () => {
      const res = await fetch(`/api/structure?cache=true`); // fetch draft content to add to the menus.
      const data = await res.json();
      return data;
    };

    const fetchDataAndUpdateState = async () => {
      const padsMenu = await fetchPadMenu();



      const newPrimary = (Array.isArray(initialMenuStructure?.primary)
        ? initialMenuStructure.primary
        : []).concat(Array.isArray(padsMenu?.collections[collection.path])
          ? padsMenu.collections[collection.path]
          : [])


      const newRelatedContent = deepMerge(
        initialMenuStructure?.relatedContent || {},
        padsMenu?.relatedContent || {})


      let mergedPrimary = newPrimary;
      newPrimary.forEach((item, index) => {
        mergedPrimary[index] = mergeObjects(newPrimary[index], padsMenu.relatedContent);
        // console.debug('fetchDataAndUpdateState:mergedPrimary[index]', mergedPrimary[index])

      });

      setMenuStructure({ primary: mergedPrimary, relatedContent: newRelatedContent });
    };

    fetchDataAndUpdateState();
  }, [initialMenuStructure]);

  return {
    menuStructure,
  };
}


// merge the child entries from Etherpad

function mergePadMenu(newMenuStructure, padsMenu) {
  let mergedStructure = newMenuStructure.primary;

  Object.keys(padsMenu.relatedContent).forEach(key => {

    newMenuStructure.primary.forEach((item, index) => {

      if (path.dirname(item.url) === '/' + key) {
        console.log('mergePadMenu: ', key, ' : ', padsMenu.relatedContent[key])
        if (!mergedStructure[index].children) {
          mergedStructure[index].children = [];
        }
        mergedStructure[index].children = deepMergeObj(mergedStructure[index].children, padsMenu.relatedContent[key])
      }
    })

  });

  return { ...newMenuStructure, primary: mergedStructure }

}


// Helper function for deep merge
function deepMerge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = deepMerge(target[key] || {}, source[key]);
      } else if (Array.isArray(source[key])) {
        if (Array.isArray(target[key])) {
          // Merge arrays while avoiding duplicates based on unique properties
          const uniqueItems = [];
          const map = new Map();

          [...target[key], ...source[key]].forEach(item => {
            const uniqueKey = item.url || item.label; // Use 'url' or 'label' as a unique key, whichever is available
            if (!map.has(uniqueKey)) {
              map.set(uniqueKey, true);
              uniqueItems.push(item);
            }
          });

          target[key] = uniqueItems;
        } else {
          target[key] = source[key];
        }
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}


function deepMergeObj(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] instanceof Object && target[key] instanceof Object) {
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

function mergeObjects(obj1 = {}, obj2 = {}) {

  // Check if obj1 and obj2 are valid objects. If not, return a new empty object or the valid one.
  if (!obj1 || typeof obj1 !== "object" || Array.isArray(obj1)) return obj2 || {};
  if (!obj2 || typeof obj2 !== "object" || Array.isArray(obj2)) return obj1;

  // Ensure obj1.url exists before attempting to split it.
  let directory = obj1.url ? obj1.url.split('/').slice(0, -1).join('/') : '';

  // Remove the leading '/' if it exists
  if (directory.startsWith('/')) {
    directory = directory.substring(1);
  }

  // Check if the directory key exists in the second object
  if (obj2[directory]) {

    // Ensure obj1.children is an object
    obj1.children = obj1.children || {};

    // Iterate over each category
    Object.keys(obj2[directory]).forEach(category => {
      // If category does not exist in obj1, create it
      if (!obj1.children[category]) {
        obj1.children[category] = [];
      }

      obj2[directory][category].forEach(item => {
        // Check if URL exists in obj1's category array
        if (!obj1.children[category].some(e => e.url === item.url)) {
          obj1.children[category].push(item);
        }
      });
    });
  }

  return obj1;
}




