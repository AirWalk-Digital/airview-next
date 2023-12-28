// You can use this code in a separate component that's imported in your pages.
// import type { CodeBlockEditorDescriptor } from '@mdxeditor/editor';

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// const EditorStateContext = createContext();
// import store from "@/lib/redux/store";
import { siteConfig } from "../../site.config.js";
import { usePageContent, collectionName, usePageMenu, LeftMenuFunction, LeftMenu, LeftMenuOpen } from "@/lib/hooks";

import { baseTheme } from "../../constants/baseTheme";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getFileContent } from "@/lib/github";
import Paper from '@mui/material/Paper';


export default function Page({
  content: initialContent,
  context: initialContext,
}) {
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  

  const {
    pageContent,
    contentSource,
    menuStructure,
    handleContentChange,
    handlePageReset,
    context,
    content,
    editMode,
  } = usePageContent(
    initialContent,
    initialContext
  );

    console.log("pageContent: ", pageContent);
    console.log("initialContent: ", initialContent);
  const Content = () => {
      const Page = pageContent.content;
      // return <h1>test</h1>;
      return <Page />;
  };

  return (
    <ThemeProvider theme={baseTheme}>
          <CssBaseline />
          <Paper elevation={0} sx={{p:'5%'}}>
   {pageContent.frontmatter &&  <Content/>}
   </Paper>
      </ThemeProvider>
  );
}


export async function getServerSideProps(context) {

  const initialContext = {
    source: "github",
    repo: "airwalk_patterns",
    owner: "airwalk-digital",
    branch: "1-testing",
    path: "knowledge",
    reference: "knowledge",
    file: "/knowledge/m_d_x_test_page/_index.mdx",
    menu: { component: "DummyMenu", collection: null },
  };

      const pageContent = await getFileContent(
        initialContext.owner,
        initialContext.repo,
        initialContext.branch,
        initialContext.file
      );
    
    const pageContentText = pageContent
      ? Buffer.from(pageContent).toString("utf-8")
      : "";

    return {
      props: {
        content: pageContentText || "",
        context: initialContext,
      },
    };
}
