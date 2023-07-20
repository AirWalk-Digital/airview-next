import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useMDX } from "@/lib/content/mdx";
import { fetchPadDetails } from "@/lib/etherpad";
import { githubExternal } from "@/lib/content";

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
  const handleContentChange = async (url, relative) => {
    setFile(url);
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
        } else {
          throw new Error("Error fetching files");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }
  };

  useEffect(() => { // when the content or the file changes, reprocess it
    const loadPad = async (file) => {
      const cacheKey = 'etherpad:/' + file;
      const { frontmatter } = await fetchPadDetails(cacheKey);
      setContentSource('etherpad:' + frontmatter.padID);
    };

    const relativeContent = async (file) => {
      await handleContentChange(file, true);
    };

    const githubExternalContent = async (frontmatter, existingContext) => {
      const { file, content, context } = await githubExternal(frontmatter, existingContext);
      setFile(file);
      setContext(context);
      setContent(content);
    };

    if (relPage) { // there is a direct link to a file via a queryparameter
      relativeContent(relPage);
    }
    

    if (file && file.endsWith(".md")) { // load normal markdown files
      setContentSource('api');
      const { mdxContent, frontmatter } = useMDX(content ? content : initialContent, 'md');
      if (frontmatter.external_repo || frontmatter.external) {
        githubExternalContent(frontmatter, context);
      } else {
        setContext({ file: file, ...collection });
        setFile(file);

      }
      setPageContent({ content: mdxContent, frontmatter: frontmatter });
    
    } else if (file && file.endsWith(".mdx")) { // load MDX files
      setContentSource('api');
      const { mdxContent, frontmatter } = useMDX(content ? content : initialContent, 'mdx');
      if (frontmatter.external_repo || frontmatter.external) { // the content is a link to elsewhere in Github. load it.
        githubExternalContent(frontmatter, context);
      } else {
        setContext({ file: file, ...collection });
        setFile(file);

      }
      setPageContent({ content: mdxContent, frontmatter: frontmatter });
    } else if (file && file.endsWith(".etherpad")) { // load etherpad files
      loadPad(file);
    }
  }, [file, content]);

  useEffect(() => {
    const fetchPadMenu = async () => {
      const res = await fetch(`/api/structure?cache=true`); // fetch draft content to add to the menus.
      const data = await res.json();
      return data;
    };

    const fetchDataAndUpdateState = async () => {
      const padsMenu = await fetchPadMenu();

      let directory = file && file.includes("/") ? file.split("/")[1] : "";

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
    file,
    contentSource,
    menuStructure,
    handleContentChange,
    // relPage,
    setEditMode,
    context,
    content,
    frontMatterCallback
  };
}
