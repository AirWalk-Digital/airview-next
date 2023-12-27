"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchPadDetails } from "@/lib/etherpad";
import { githubExternal } from "@/lib/content";
import * as provider from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
import { evaluateSync } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkUnwrapImages from "remark-unwrap-images";
import withSlugs from "rehype-slug";
import withToc from "@stefanprobst/rehype-extract-toc";
import withTocExport from "@stefanprobst/rehype-extract-toc/mdx";
import * as matter from "gray-matter";
import deepEqual from "deep-equal";
import { useMDX } from "@/lib/content/mdx";
import path from "path";
import { siteConfig } from "../../site.config.js";
import store from "@/lib/redux/store";
import { getMenuStructure } from "@/lib/content";
import { setBranch } from "@/lib/redux/reducers/branchSlice";
import { useDispatch } from "react-redux";
import {
  FullHeaderMenu,
  HeaderMinimalMenu,
  ListMenu,
  DummyMenu,
} from "@/components/menus";

// usePageContent
// takes the content, the filename (from the path), the menuStructure created at build time, and the collection (the page type)
// and handles the rendering and processing of the content - including swapping content from within the same page.
// ----- callback functions ----
// handleContentChange - accepts a URL (the path to the new content) and relative (bool) to
// handlePageReset - resets the page back to the primary landing point
// setEditMode,
// frontMatterCallback - allows a downstream component to update the frontmatter (i.e. from Etherpad)

export function usePageContent(initialContent, initialContext) {
  const [pageContent, setPageContent] = useState({
    content: undefined,
    frontmatter: undefined,
  });

  const [content, setContent] = useState(initialContent);
  const [contentSource, setContentSource] = useState(null);
  const [menuStructure, setMenuStructure] = useState([]);
  const [relPage, setRelPage] = useState(); // this loads direct links to the content using ?page=/whatever query parameter
  const [editMode, setEditMode] = useState(false);
  const [context, setContext] = useState(initialContext);
  const dispatch = useDispatch();

  console.debug("usePageContent:initialContext: ", initialContext);

  const collection = () => {
    if (initialContext.menu && initialContext.menu.collection) {
      console.debug(
        "usePageContent:collection: ",
        siteConfig.content[
          siteConfig.content[initialContext.menu.collection].path
        ]
      );
      return siteConfig.content[
        siteConfig.content[initialContext.menu.collection].path
      ];
    } else {
      console.debug("usePageContent:collection: ", initialContext);
      return initialContext;
    }
  };

  const editFromQuery = useRouter()?.query?.edit ?? null; // ?edit=true query parameter
  const queryBranch = useRouter()?.query?.branch ?? null; // ?branch=whatever query parameter
  const pageFromQueryString = useRouter()?.query?.page ?? null; // ?page=/whatever query parameter

  useEffect(() => {
    // when the context changes, reprocess it
    if (pageFromQueryString && relPage != pageFromQueryString) {
      // there is a direct link to a file via a queryparameter
      console.debug(
        "usePageContent:pageFromQueryString: ",
        pageFromQueryString
      );
      setRelPage(pageFromQueryString);
      relativeContent(relPage);
    }
    loadContent(context, content);
  }, [context]);

  useEffect(() => {
    // populate the menu structure

    const fetchMenu = async () => {
      const res = await fetch(`/api/menu?collection=${collection().path}`); // fetch draft content to add to the menus.
      const data = await res.json();
      setMenuStructure(data);
    };

    fetchMenu();
  }, [context]);

  useEffect(() => {
    // run and reprocess the files and branches.
    console.debug("usePageContent:useEffect:queryBranch: ", queryBranch);
    console.debug("usePageContent:useEffect:context: ", context);

    const updateReduxContext = async (newContext) => {
      await dispatch(setBranch(newContext));
    };

    if (editFromQuery) {
      console.debug("usePageContent:queryEdit: ", editFromQuery);
      setEditMode(true);
    } // set the edit mode from the query parameter ?edit=true

    if (queryBranch && context.branch != queryBranch) {
      const newContext = { ...context, branch: queryBranch };
      console.debug("usePageContent:queryBranch:newContext: ", newContext);
      setContext(newContext);
      updateReduxContext(newContext);
      handleContentChange(context.file);
      // setControlBarOpen(true);
      // setControlBarOpen(true)
      // setChangeBranch(true)
    } // set the branch from the query parameter ?branch=
  }, []);

  function loadContent(context, content) {
    console.debug("usePageContent:loadContent:context: ", context);
    console.debug(
      "usePageContent:loadContent:content: ",
      content.substring(0, 100)
    );

    if (content && context && context.file && context.file.endsWith(".md")) {
      // load normal markdown files
      setContentSource("api");

      const { mdxContent, frontmatter } = useMDX(
        content ? content : initialContent,
        "md"
      );
      // if (frontmatter.external_repo || frontmatter.external) {
      //   githubExternalContent(frontmatter, context);
      // }
      setPageContent({ content: mdxContent, frontmatter: frontmatter });
    } else if (
      content &&
      context &&
      context.file &&
      context.file.endsWith(".mdx")
    ) {
      // load MDX files
      setContentSource("api");
      const { mdxContent, frontmatter } = useMDX(
        content ? content : initialContent,
        "mdx"
      );

      // if (frontmatter.external_repo || frontmatter.external) { // the content is a link to elsewhere in Github. load it.
      //   githubExternalContent(frontmatter, context);
      // }
      setPageContent({ content: mdxContent, frontmatter: frontmatter });
    } else if (
      content &&
      context &&
      context.file &&
      context.file.endsWith(".etherpad")
    ) {
      // load etherpad files
      loadPad(context.file);
    } else {
      console.debug("usePageContent:loadContent:NO_CONTENT");
      const placeholder_content = `## Error 404
      #### No content found.
      
      This may be due to the file you're trying to access being on a different branch to the one you're currently viewing.`;
      const { mdxContent, frontmatter } = useMDX(placeholder_content, "mdx");

      setPageContent({ content: mdxContent, frontmatter: frontmatter });
    }
  }

  // const frontMatterCallback = (frontmatter) => {
  //   setContent({ frontmatter: frontmatter })
  // }

  const handlePageReset = () => {
    console.log(
      "usePageContent:handlePageReset:initialContext: ",
      initialContext
    );
    setContext(initialContext);
    setContent(initialContent);
    setRelPage("");
    clearQueryParams();
    loadContent(initialContext, initialContent);
  };

  const handleContentChange = async (url, relative) => {
    // setFile(url);
    if (typeof window !== "undefined") {
      console.debug("usePageContent:handleContentChange:url: ", url, relative);
      console.debug("usePageContent:handleContentChange:relPage: ", relPage);

      if (relative === true) {
        // it's a relative page, so set the values
        setQueryParams(url);
        setRelPage(url);
      }

      if (url && url.endsWith(".etherpad")) {
        const cacheKey = "etherpad:/" + url;
        const { frontmatter } = await fetchPadDetails(cacheKey);
        setContent({ content: null, frontmatter: frontmatter });
        setContext({ ...context, file: url, ...frontmatter?.context });
        setContentSource("etherpad:" + frontmatter.padID);
      } else if (url) {
        setContentSource("api");

        const currentState = store.getState();
        const reduxCollection = currentState?.branch[context?.path];
        let branch = reduxCollection?.branch;

        console.debug(
          "usePageContent:handleContentChange:reduxCollection: ",
          reduxCollection
        );
        console.debug("usePageContent:handleContentChange:branch: ", branch);
        console.debug("usePageContent:handleContentChange:url: ", url);
        console.debug("usePageContent:handleContentChange:context: ", context);

        try {
          const response = await fetch(
            `/api/content/github/${context.owner}/${context.repo}?branch=${branch}&path=${url}`
          );
          if (response.ok) {
            const data = await response.text();
            console.debug("usePageContent:handleContentChange:data: ", data);

            setContent(data);
            const newContext = { ...reduxCollection, file: url };

            if (url && url.endsWith(".md")) {
              // load normal markdown files
              setContentSource("api");

              const { mdxContent, frontmatter } = useMDX(data, "md");
              if (frontmatter.external_repo || frontmatter.external) {
                const { newContent: extContent, newContext: extContext } =
                  await githubExternal(frontmatter, newContext);
                const {
                  mdxContent: mdxExtContent,
                  frontmatter: extFrontmatter,
                } = useMDX(extContent, "md");
                if (extContext && !deepEqual(context, extContext)) {
                  setContext(extContext);
                }
                setPageContent({
                  content: mdxExtContent,
                  frontmatter: extFrontmatter,
                });
              } else {
                setContext(newContext); // force a refresh of the page
                setPageContent({
                  content: mdxContent,
                  frontmatter: frontmatter,
                });
              }
            } else if (url && url.endsWith(".mdx")) {
              // load MDX files
              setContentSource("api");
              const { mdxContent, frontmatter } = useMDX(data, "mdx");

              if (frontmatter.external_repo || frontmatter.external) {
                const { newContent: extContent, newContext: extContext } =
                  await githubExternal(frontmatter, newContext);
                const {
                  mdxContent: mdxExtContent,
                  frontmatter: extFrontmatter,
                } = useMDX(extContent, "md");
                if (extContext && !deepEqual(context, extContext)) {
                  setContext(extContext);
                }
                setPageContent({
                  content: mdxExtContent,
                  frontmatter: extFrontmatter,
                });
              } else {
                setContext(newContext); // force a refresh of the page
                setPageContent({
                  content: mdxContent,
                  frontmatter: frontmatter,
                });
              }
            } else if (url && url.endsWith(".etherpad")) {
              // load etherpad files
              loadPad(url);
            }
          } else {
            throw new Error(
              "usePageContent:handleContentChange:Error fetching files"
            );
          }
        } catch (error) {
          console.error(
            "usePageContent:handleContentChange:Error fetching files: ",
            error
          );
        }
      }
    }
  };

  const loadPad = async (file) => {
    const cacheKey = "etherpad:/" + file;
    const { frontmatter } = await fetchPadDetails(cacheKey);
    setContentSource("etherpad:" + frontmatter.padID);
  };

  const relativeContent = async (file) => {
    await handleContentChange(file, true);
  };

  const githubExternalContent = async (frontmatter, existingContext) => {
    const { newContent, newContext } = await githubExternal(
      frontmatter,
      existingContext
    );
    // setFile(file);
    if (newContext && !deepEqual(context, newContext)) {
      setContext(newContext);
      // console.log('useEffect:githubExternalContent/newContent: ', newContent)
      // console.log('useEffect:githubExternalContent/newContext: ', newContext)
    }
    setContent(newContent);
  };

  function clearQueryParams() {
    if (typeof window !== "undefined") {
      let url = new URL(window.location.href);

      // If there is a 'branch' query parameter, keep it
      if (url.searchParams.has("branch")) {
        let branch = url.searchParams.get("branch");
        url.searchParams.set("branch", branch);
      }
      // If there is an 'edit' query parameter, keep it
      if (url.searchParams.has("edit")) {
        let edit = url.searchParams.get("edit");
        url.searchParams.set("edit", edit);
      }
      // Remove 'page' query parameter

      url.searchParams.delete("page");

      window.history.replaceState({}, document.title, url);
    }
  }
  function setQueryParams(path) {
    if (typeof window !== "undefined") {
      let url = new URL(window.location.href);
      url.searchParams.set("page", path);

      // If there is a 'branch' query parameter, keep it
      if (url.searchParams.has("branch")) {
        let branch = url.searchParams.get("branch");
        url.searchParams.set("branch", branch);
      }
      // If there is an 'edit' query parameter, keep it
      if (url.searchParams.has("edit")) {
        let edit = url.searchParams.get("edit");
        url.searchParams.set("edit", edit);
      }

      window.history.replaceState({}, document.title, url);
    }
  }

  let returnObject = {
    pageContent,
    contentSource,
    menuStructure,
    handleContentChange,
    handlePageReset,
    context,
    content,
    editMode,
  };

  let debugObject = { ...returnObject };
  delete debugObject.menuStructure;

  console.debug("Return object: ", JSON.stringify(debugObject, null, 2));

  return returnObject;

  return returnObject;
}

export function collectionName(url, collection) {
  // console.debug('collectionName:url', url)

  const fileCollection = url && url.includes("/") ? url.split("/")[0] : "";
  // console.debug('collectionName:fileCollection', fileCollection)

  if (siteConfig.content[fileCollection]) {
    const newCollection = siteConfig.content[fileCollection];
    // console.debug('collectionName:newCollection', newCollection)

    return newCollection;
  } else {
    return collection;
  }
}

export const LeftMenuOpen = (context) => {
  if (context && context.menu && context.menu.component) {
    switch (context.menu.component) {
      case "DummyMenu":
        return false;
      default:
        return true;
    }
  } else {
    return true;
  }
};

export const LeftMenuFunction = (context) => {
  if (context && context.menu && context.menu.component) {
    switch (context.menu.component) {
      case "DummyMenu":
        return DummyMenu;
      case "FullHeaderMenu":
        return FullHeaderMenu;
      case "HeaderMinimalMenu":
        return HeaderMinimalMenu;
      case "ListMenu":
        return ListMenu;
      default:
        return FullHeaderMenu;
    }
  } else {
    return FullHeaderMenu;
  }
};
