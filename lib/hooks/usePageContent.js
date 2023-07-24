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

function loadMDX(source, format = 'mdx', wrapper = null) {
  const remarkPlugins = [];
  remarkPlugins.push(remarkGfm);
  remarkPlugins.push(remarkFrontmatter);
  remarkPlugins.push(remarkMdxFrontmatter);
  remarkPlugins.push(remarkUnwrapImages);

  const rehypePlugins = [];

  rehypePlugins.push(withSlugs);
  rehypePlugins.push(withToc);
  rehypePlugins.push(withTocExport)


  if (wrapper) {
    const { data, content } = matter(source);
    const wrappedMDX = `<${wrapper}>${content}</${wrapper}>`
    const exports = evaluateSync(wrappedMDX, {
      ...provider,
      ...runtime,
      useDynamicImport: true,
      format: format,
      remarkPlugins,
      rehypePlugins
    });
    let frontmatter = exports?.frontmatter || {}
    frontmatter.tableOfContents = exports.tableOfContents
    return { mdxContent: exports.default, frontmatter: frontmatter };
  } else {

    const exports = evaluateSync(source, {
      ...provider,
      ...runtime,
      useDynamicImport: true,
      format: format,
      remarkPlugins,
      rehypePlugins
    });
    let frontmatter = exports?.frontmatter || {}
    frontmatter.tableOfContents = exports.tableOfContents
    return { mdxContent: exports.default, frontmatter: frontmatter };
  }
}

// usePageContent
// takes the content, the filename (from the path), the menuStructure created at build time, and the collection (the page type)
// and handles the rendering and processing of the content - including swapping content from within the same page.
// ----- callback functions ----
// handleContentChange - accepts a URL (the path to the new content) and relative (bool) to 
// setEditMode,
// frontMatterCallback


export function usePageContent(initialContent, initialFile, initialMenuStructure, collection) {
  const [pageContent, setPageContent] = useState({
    content: undefined,
    frontmatter: undefined,
  });
  const [file, setFile] = useState(initialFile);

  const [content, setContent] = useState(initialContent);
  const [contentSource, setContentSource] = useState(null);
  const [menuStructure, setMenuStructure] = useState(null);
  const [relPage, setRelPage] = useState(useRouter()?.query?.page ?? null); // this loads direct links to the content using ?page=/whatever query parameter
  const [editMode, setEditMode] = useState(false);
  const [context, setContext] = useState({ file: initialFile, ...collection });


  const frontMatterCallback = (frontmatter) => {
    setContent({ frontmatter: frontmatter })
  }

  const handlePageReset = async () => {
    setContext({ file: initialFile, ...collection });
    setContent(initialContent);
    clearQueryParams();
    setRelPage(null);
  }

  const handleContentChange = async (url, relative) => {
    setContext({ file: url })
    // setFile(url);
    if (relative !== true && relPage) { // it's not a relative page, clear the previous one
      clearQueryParams();
      setRelPage(null);
    }
    if (url && url.endsWith(".etherpad")) {
      const cacheKey = 'etherpad:/' + url;
      const { frontmatter } = await fetchPadDetails(cacheKey);
      setContentSource('etherpad:' + frontmatter.padID);
    } else if (url) {
      setContentSource('api');
      try {
        const response = await fetch(
          `/api/content/github/${collection.owner}/${collection.repo}?branch=${collection.branch}&path=${url}`
        );
        if (response.ok) {
          const data = await response.text();
          setContent(data);
          setContext(context); // force a refresh of the page
        } else {
          throw new Error("Error fetching files");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }
  };

  useEffect(() => { // when the context changes, reprocess it
    console.log('useEffect[context]:context: ', context)
    console.log('useEffect[context]:relPage: ', relPage)

    const loadPad = async (file) => {
      const cacheKey = 'etherpad:/' + file;
      const { frontmatter } = await fetchPadDetails(cacheKey);
      setContentSource('etherpad:' + frontmatter.padID);
    };

    const relativeContent = async (file) => {
      await handleContentChange(file, true);
    };

    const githubExternalContent = async (frontmatter, existingContext) => {
      const { newContent, newContext } = await githubExternal(frontmatter, existingContext);
      // setFile(file);
      if (newContext && !deepEqual(context, newContext)) {
        setContext(newContext);
        // console.log('useEffect:githubExternalContent/newContent: ', newContent)
        console.log('useEffect:githubExternalContent/newContext: ', newContext)

      }
      setContent(newContent);
    };

    if (relPage) { // there is a direct link to a file via a queryparameter
      relativeContent(relPage);
    }


    if (context && context.file && context.file.endsWith(".md")) { // load normal markdown files
      setContentSource('api');
      console.log('useEffect[context][.md]')

      const { mdxContent, frontmatter } = loadMDX(content ? content : initialContent, 'md');
      if (frontmatter.external_repo || frontmatter.external) {
        githubExternalContent(frontmatter, context);
      } else {
        console.log('n')
        // const newContext = { file: context.path, ...collection }
        // if (!deepEqual(context, newContext)) {
        //   logObjectDifferences(context,newContext)
        //   setContext(newContext);
        // }


      }
      setPageContent({ content: mdxContent, frontmatter: frontmatter });

    } else if (context && context.file && context.file.endsWith(".mdx")) { // load MDX files
      setContentSource('api');
      const { mdxContent, frontmatter } = loadMDX(content ? content : initialContent, 'mdx');

      if (frontmatter.external_repo || frontmatter.external) { // the content is a link to elsewhere in Github. load it.
        githubExternalContent(frontmatter, context);
      }
      setPageContent({ content: mdxContent, frontmatter: frontmatter });
    } else if (context && context.file && context.file.endsWith(".etherpad")) { // load etherpad files
      loadPad(context.file);
    }
  }, [context]);


  function logObjectDifferences(oldObj, newObj) {
    const diff = {};

    // Compare oldObj and newObj properties
    for (const key in newObj) {
      if (oldObj[key] !== newObj[key]) {
        diff[key] = {
          old: oldObj[key],
          new: newObj[key],
        };
      }
    }

    // Log the differences to the console
    console.log('Object Differences:');
    console.log(diff);
  }

  useEffect(() => { // add to the menu structure
    const fetchPadMenu = async () => {
      const res = await fetch(`/api/structure?cache=true`); // fetch draft content to add to the menus.
      const data = await res.json();
      return data;
    };

    const fetchDataAndUpdateState = async () => {
      const padsMenu = await fetchPadMenu();

      // let directory = file && file.includes("/") ? file.split("/")[1] : "";

      const newMenuStructure = {
        ...initialMenuStructure,
        primary: [
          ...(Array.isArray(initialMenuStructure?.primary)
            ? initialMenuStructure.primary
            : []),
          ...(Array.isArray(padsMenu?.collections?.products)
            ? padsMenu.collections.products
            : []),
        ],
        relatedContent: {
          ...initialMenuStructure?.relatedContent,
          ...Object.keys(padsMenu?.relatedContent || {}).reduce((acc, key) => {
            acc[key] = {
              ...initialMenuStructure?.relatedContent?.[key],
              ...padsMenu?.relatedContent?.[key],
            };
            return acc;
          }, {}),
        },
      };
      setMenuStructure(newMenuStructure);
    };

    fetchDataAndUpdateState();
  }, [initialMenuStructure]);

  function clearQueryParams() {
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }

  return {
    pageContent,
    // file,
    contentSource,
    menuStructure,
    handleContentChange,
    handlePageReset,
    // relPage,
    setEditMode,
    context,
    content,
    frontMatterCallback,
  };
}
