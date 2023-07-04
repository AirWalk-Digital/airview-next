import React, { useState, useEffect } from "react";
import { siteConfig } from "../../site.config.js";
import { mdComponents } from "../../constants/mdxProvider";
import * as matter from "gray-matter";
import { MDXProvider } from "@mdx-js/react";
import { useMDX } from "@/lib/content/mdx";

import { SolutionView } from "@/components/solutions";
import { getFileContent } from "@/lib/github";

import { FullScreenSpinner } from "@/components/dashboard/index.js";
import { dirname, basename } from "path";
import { getMenuStructure } from "@/lib/content";

import { Button } from "@mui/material";
import { fetchPadDetails } from "@/lib/etherpad";

import { Etherpad } from "@/components/etherpad";
import { useRouter } from 'next/router'

import { ContentWrapperContext } from '@/components/content'

export default function Page({
  content: initialContent,
  file: initialFile,
  menuStructure: initialMenuStructure,
  collection
}) {
  const [pageContent, setContent] = useState({
    content: undefined,
    frontmatter: undefined,
  });

  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(initialFile);
  const [content, setRawContent] = useState(initialContent);
  const [contentSource, setContentSource] = useState(null);
  const [menuStructure, setMenuStructure] = useState(null);
  const [relPage, setRelPage] = useState(useRouter()?.query?.page ?? null)
  const frontMatterCallback = (frontmatter) => {
    setContent({frontmatter: frontmatter})
  }
  
  // const relPage = useRouter()?.query?.page ?? null;

  const handleContentChangeOld = async (url, label) => {
    // console.log("Content Clicked: label: ", label, " url: ", url);

    if (url && url.endsWith(".etherpad")) { // load the pad
      const cacheKey = 'etherpad:/' + url
      const { frontmatter } = await fetchPadDetails(cacheKey);
      setContentSource('etherpad:' + frontmatter.padID);
      // const pad = await fetchPadDetails(cacheKey);
      // // console.log("handleContentChange: ", pad);

      // if (pad.rawContent && pad.frontmatter) {
      //   setRev(pad.rev);
      //   setRawContent(matter.stringify(pad.rawContent, pad.frontmatter));
      // }
    } else if (url) {
      setContentSource('api')
      // load from github
      try {
        const response = await fetch(
          `/api/content/github/${siteConfig.content.solutions.owner}/${siteConfig.content.solutions.repo}?branch=${siteConfig.content.solutions.branch}&path=${url}`
        );
        if (response.ok) {
          const data = await response.text();
          setRawContent(data);
        } else {
          throw new Error("Error fetching files");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }
  };

  function clearQueryParams() {
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
  async function handleContentChange(url, relative) {
    console.log("useEffect:relative: ", relative);
    setFile(url);
    if (relative != true && relPage) {
      const { asPath } = router
      const urlPath = asPath.split("?")[0]
      clearQueryParams()
      // router.push({ urlPath }, undefined, { shallow: true });
      console.log("useEffect:router:urlPath: ", urlPath);
      setRelPage(null);
      //
    };
    // setRelPage(null);
    if (url && url.endsWith(".etherpad")) { // load the pad
      const cacheKey = 'etherpad:/' + url
      const { frontmatter } = await fetchPadDetails(cacheKey);
      setContentSource('etherpad:' + frontmatter.padID);
      // const pad = await fetchPadDetails(cacheKey);
      // // console.log("handleContentChange: ", pad);

      // if (pad.rawContent && pad.frontmatter) {
      //   setRev(pad.rev);
      //   setRawContent(matter.stringify(pad.rawContent, pad.frontmatter));
      // }
    } else if (url) {
      setContentSource('api')
      // load from github
      try {
        const response = await fetch(
          `/api/content/github/${siteConfig.content.solutions.owner}/${siteConfig.content.solutions.repo}?branch=${siteConfig.content.solutions.branch}&path=${url}`
        );
        if (response.ok) {
          const data = await response.text();
          setRawContent(data);
        } else {
          throw new Error("Error fetching files");
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }
  };

  
  useEffect(() => {
    const loadPad = async (file) => {
      const cacheKey = 'etherpad:/' + file
      const { frontmatter } = await fetchPadDetails(cacheKey);
      setContentSource('etherpad:' + frontmatter.padID);
    };

    const relativeContent = async (file) => {
      await handleContentChange(file, true)
    };
    // const relPage = router?.query?.page ?? null;
    console.log('Solutions:useEffect:relPage: ', relPage)

    if (relPage) {
      relativeContent(relPage)
    }

    if (file && file.endsWith(".md")) {
      setContentSource('api')
      const { mdxContent, frontmatter } = useMDX(content ? content : initialContent, 'md');
      setContent({ content: mdxContent, frontmatter: frontmatter });
    } else if (file && file.endsWith(".mdx")) {
      setContentSource('api')
      console.log('useEffect:BuildMDX:format: ', 'mdx')
      const { mdxContent, frontmatter } = useMDX(content ? content : initialContent, 'mdx');
      setContent({ content: mdxContent, frontmatter: frontmatter });
    } else if (file && file.endsWith(".etherpad")) {
      loadPad(file)
    }
    // const { mdxContent, frontmatter } = useMDX(content ? content : initialContent, format);
    // setContent({ content: mdxContent, frontmatter: frontmatter});

  }, [file, content]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const cacheKey = 'etherpad:/' + file;
  //     try {
  //       const pad = await fetchPadDetails(cacheKey);
  //       return pad;
  //     } catch (error) {
  //       console.error("Error fetching pad details:", error);
  //       return null;
  //     }
  //   };

  //   if (file && file.endsWith(".etherpad")) {

  //     const fetchDataAndSetState = async () => {
  //       const padDetails = await fetchData();
  //       // console.log("useEffect:fetchData1: ", padDetails);

  //       if (padDetails && padDetails.rawContent && padDetails.frontmatter) {
  //         setContentSource('etherpad:' + padDetails.frontmatter.padID);

  //         // console.log('useEffect:fetchData2: ', padDetails);

  //         setRev(padDetails.rev);
  //         setRawContent(
  //           matter.stringify(padDetails.rawContent, padDetails.frontmatter)
  //         );
  //       }
  //     };

  //     fetchDataAndSetState();
  //   } else {
  //     setContentSource('git')
  //   }
  // }, [file]);

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

      let directory = file && file.includes("/") ? file.split("/")[1] : "";

      const newMenuStructure = {
        ...initialMenuStructure,
        primary: [
          ...(Array.isArray(initialMenuStructure?.primary)
            ? initialMenuStructure.primary
            : []),
          ...(Array.isArray(padsMenu?.collections?.solutions)
            ? padsMenu.collections.solutions
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

    // // console.log('initialMenuStructure: ', initialMenuStructure);
    fetchDataAndUpdateState();

  }, [initialMenuStructure]);



  if (pageContent.content && pageContent.frontmatter) {
    console.log('pageContent has content: ', pageContent)
    const Content = pageContent.content;
    return <ContentWrapperContext><SolutionView frontmatter={pageContent.frontmatter} file={initialFile} content={content} menuStructure={menuStructure} handleContentChange={handleContentChange} setEditMode={setEditMode} collection={collection}>
      <MDXProvider components={mdComponents(context)}>
        <Content />
      </MDXProvider>
    </SolutionView>
    </ContentWrapperContext>
  } else if (file && contentSource && contentSource.startsWith('etherpad')) {
    return <ContentWrapperContext><SolutionView frontmatter={pageContent.frontmatter} file={initialFile} content={content} menuStructure={menuStructure} handleContentChange={handleContentChange} setEditMode={setEditMode} collection={collection}>
      <MDXProvider components={mdComponents(context)}>
        <Etherpad file={file} frontMatterCallback={frontMatterCallback} editMode={editMode} />
      </MDXProvider>
    </SolutionView>
    </ContentWrapperContext>

  } else {
    return (
      <ContentWrapperContext>
      <SolutionView
        frontmatter={pageContent.frontmatter}
        file={file}
        menuStructure={menuStructure}
        handleContentChange={handleContentChange}
        setEditMode={setEditMode}
        collection={collection}
      >
        <MDXProvider components={mdComponents(context)}>
          <FullScreenSpinner />
        </MDXProvider>
      </SolutionView>
      </ContentWrapperContext>
    );
  }
}

export async function getServerSideProps(context) {
  // // console.log('params: ', context.params.solution)
  const file = "solutions/" + context.params.solution.join("/");
  let pageContent = "";
  if (!file.endsWith(".etherpad")) {
    pageContent = await getFileContent(
      siteConfig.content.solutions.owner,
      siteConfig.content.solutions.repo,
      siteConfig.content.solutions.branch,
      file
    );
  }


  const pageContentText = pageContent
    ? Buffer.from(pageContent).toString("utf-8")
    : "";


  const menuStructure = await getMenuStructure(
    siteConfig,
    siteConfig.content.solutions
  );

  return {
    props: {
      content: pageContentText || null,
      file: file,
      menuStructure: menuStructure || null,
      collection: siteConfig.content.solutions,
    },
  };
}
