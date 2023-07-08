import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'

import { siteConfig } from "../../site.config.js";
import { mdComponents } from "../../constants/mdxProvider.js";
import * as matter from "gray-matter";
import { MDXProvider } from "@mdx-js/react";
import { getAllFiles, getFileContent } from "@/lib/github";
import { useMDX } from "@/lib/content/mdx";

import { ContentPage } from "@/components/content";

import { FullScreenSpinner } from "@/components/dashboard/index.js";
import { dirname, basename } from "path";

import { Button } from "@mui/material";
import { fetchPadDetails } from "@/lib/etherpad";
import { getMenuStructure, githubExternal } from "@/lib/content";
import { groupMenu } from "@/lib/content/menu";
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


  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(initialFile);
  const [content, setRawContent] = useState(initialContent);
  const [context, setContext ] = useState({ file: file, ...siteConfig.content.products });
  const [contentSource, setContentSource] = useState(null);
  const [menuStructure, setMenuStructure] = useState(null);
  const [relPage, setRelPage] = useState(useRouter()?.query?.page ?? null)
  const frontMatterCallback = (frontmatter) => {
    setContent({ frontmatter: frontmatter })
  }

  // const context = { file: file, ...siteConfig.content.products };

  function clearQueryParams() {
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
  async function handleContentChange(url, relative) {
    console.log("useEffect:relative: ", relative);
    setFile(url);
    if (relative != true && relPage) {
      clearQueryParams()
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
          `/api/content/github/${collection.owner}/${collection.repo}?branch=${collection.branch}&path=${url}`
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

    const githubExternalContent = async (frontmatter, existingContext) => {
      const { file, content, context } = await githubExternal(frontmatter, existingContext);

      // console.log('Product:useEffect:githubExternal:function: ', githubExternal(frontmatter, context))
      console.log('Product:useEffect:githubExternal:content: ', content)
      console.log('Product:useEffect:githubExternal:file: ', file)
      setContext(context);
      setFile(file);
      setRawContent(content);
    }
    // const relPage = router?.query?.page ?? null;
    console.log('Solutions:useEffect:relPage: ', relPage)

    if (relPage) {
      relativeContent(relPage)
    }

    if (file && file.endsWith(".md")) {
      setContentSource('api')
      const { mdxContent, frontmatter } = useMDX(content ? content : initialContent, 'md');
      if (frontmatter.external_repo || frontmatter.external) {
        githubExternalContent(frontmatter, context)

      }
      console.log('ContentPage:frontmatter: ', frontmatter)
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

    // // console.log('initialMenuStructure: ', initialMenuStructure);
    fetchDataAndUpdateState();

  }, [initialMenuStructure]);




  if (pageContent.content && pageContent.frontmatter) {
    console.log('pageContent has content: ', pageContent)
    const Content = pageContent.content;
    return <ContentWrapperContext><ContentPage frontmatter={pageContent.frontmatter} file={initialFile} content={content} menuStructure={menuStructure} handleContentChange={handleContentChange} setEditMode={setEditMode} collection={collection}>
      <MDXProvider components={mdComponents(context)}>
        <Content />
      </MDXProvider>
    </ContentPage>
    </ContentWrapperContext>
  } else if (file && contentSource && contentSource.startsWith('etherpad')) {
    return <ContentWrapperContext><ContentPage frontmatter={pageContent.frontmatter} file={initialFile} content={content} menuStructure={menuStructure} handleContentChange={handleContentChange} setEditMode={setEditMode} collection={collection}>
      <MDXProvider components={mdComponents(context)}>
        <Etherpad file={file} frontMatterCallback={frontMatterCallback} editMode={editMode} />
      </MDXProvider>
    </ContentPage>
    </ContentWrapperContext>

  } else {
    return (
      <ContentWrapperContext>
        <ContentPage
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
        </ContentPage>
      </ContentWrapperContext>
    );
  }
}



//   if (pageContent.content && pageContent.frontmatter) {
//     const Content = pageContent.content;

//     return (
//       <ContentPage
//         frontmatter={pageContent.frontmatter}
//         file={file}
//         content={content}
//         menuStructure={menuStructure}
//         pageStructure={pageStructure}
//         handleContentClick={handleContentClick}
//         siteConfig={siteConfig}
//       >
//         <MDXProvider components={mdComponents(context)}>
//           <Content />
//         </MDXProvider>
//       </ContentPage>
//     );
//   } else {
//     return (
//       <ContentPage
//         frontmatter={pageContent.frontmatter}
//         file={file}
//         menuStructure={menuStructure}
//         pageStructure={pageStructure}
//         handleContentClick={handleContentClick}
//         siteConfig={siteConfig}
//       >
//         <MDXProvider components={mdComponents(context)}>
//           <FullScreenSpinner />
//         </MDXProvider>
//       </ContentPage>
//     );
//   }
// }

// export async function getServerSideProps(context) {
//   // // console.log('params: ', context.params.solution)
//   const file = "products/" + context.params.product.join("/");
//   let pageContent = "";
//   if (!file.endsWith(".etherpad")) {
//     pageContent = await getFileContent(
//       siteConfig.content.products.owner,
//       siteConfig.content.products.repo,
//       siteConfig.content.products.branch,
//       file
//     );
//   }
//   const pageContentText = pageContent
//     ? Buffer.from(pageContent).toString("utf-8")
//     : "";

//   const structurePromise = getMenuStructure(
//     siteConfig,
//     siteConfig.content.products
//   );

//   const pageStructure = await structurePromise;

//   const groupedMenu = groupMenu(pageStructure);
//   // const menuStructure = await getMenuStructure(siteConfig, siteConfig.content.providers);

//   return {
//     props: {
//       content: pageContentText || null,
//       file: file,
//       menuStructure: groupedMenu || null,
//       pageStructure: pageStructure || null,
//     },
//   };
// }



export async function getServerSideProps(context) {
  // // console.log('params: ', context.params.solution)
  const file = "products/" + context.params.product.join("/");
  let pageContent = "";
  if (!file.endsWith(".etherpad")) {
    pageContent = await getFileContent(
      siteConfig.content.products.owner,
      siteConfig.content.products.repo,
      siteConfig.content.products.branch,
      file
    );
  }

  const pageContentText = pageContent
    ? Buffer.from(pageContent).toString("utf-8")
    : "";


  const menuStructure = await getMenuStructure(
    siteConfig,
    siteConfig.content.products
  );

  return {
    props: {
      content: pageContentText || null,
      file: file,
      menuStructure: menuStructure || null,
      collection: siteConfig.content.products,
    },
  };
}








function mergeObjects(obj1, obj2) {
  if (!obj1 || typeof obj1 !== "object") {
    return obj2;
  }
  if (!obj2 || typeof obj2 !== "object") {
    return obj1;
  }

  const merged = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (Array.isArray(obj2[key])) {
        if (merged.hasOwnProperty(key) && Array.isArray(merged[key])) {
          merged[key] = [...merged[key], ...obj2[key]];
        } else {
          merged[key] = obj2[key];
        }
      } else {
        merged[key] = mergeObjects(merged[key], obj2[key]);
      }
    }
  }

  return merged;
}
