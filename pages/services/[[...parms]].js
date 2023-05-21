
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { VFile } from 'vfile'
import { VFileMessage } from 'vfile-message'
import * as provider from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
// import {statistics} from 'vfile-statistics'
// import {reporter} from 'vfile-reporter'
import { evaluate } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkUnwrapImages from 'remark-unwrap-images';
import { Box, Typography } from '@mui/material';
// import remarkMath from 'remark-math'
import { ErrorBoundary } from 'react-error-boundary'
import { useDebounceFn } from 'ahooks'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { theme } from '../../constants/baseTheme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { mdComponents } from "../../constants/mdxProvider";
import * as matter from 'gray-matter';
import Topbar from '../../components/TopBar';

import { MDXProvider } from '@mdx-js/react';

import { Menu, NavigationDrawer } from '../../components/airview-ui';
import { getAllFiles, getFileContent } from '../../backend/filesystem';

function removeSection(pad, tagName) {
  const re = new RegExp("<" + tagName + "\\s+[^>]*>(.*?)</" + tagName + ">", "gs");
  return (pad.replace(re, ""));
}

function useMdx(defaults) {
  const [state, setState] = useState({ ...defaults, file: null })

  const { run: setConfig } = useDebounceFn(
    async (config) => {
      let frontmatter = null;
      // process frontmatter
      try {
        if (config.pageParms && config.pageParms.parms) { delete config.pageParms.parms };
        const { content, data } = matter(mdx);
        frontmatter = { ...data, ...config.pageParms };
        config.value = matter.stringify(content, { ...frontmatter });
      } catch (error) {
        console.log(error)
      }

      const file = new VFile({ basename: 'example.mdx', value: config.value })

      const capture = (name) => () => (tree) => {
        file.data[name] = tree
      }

      const remarkPlugins = []

      if (config.gfm) remarkPlugins.push(remarkGfm)
      if (config.frontmatter) {
        remarkPlugins.push(remarkFrontmatter);
        remarkPlugins.push(remarkMdxFrontmatter);
      }
      if (config.unwrapImages) remarkPlugins.push(remarkUnwrapImages)
      // remarkPlugins.push(capture('mdast'))

      try {
        file.result = (
          await evaluate(file, {
            ...provider,
            ...runtime,
            useDynamicImport: true,
            remarkPlugins,
            // rehypePlugins: [capture('hast')],
            // recmaPlugins: [capture('esast')],

          })
        ).default
      } catch (error) {
        // console.log('output:evalutate:Error: ', error)
        // console.log('output:evalutate:Error/Content: ', file)
        const message =
          error instanceof VFileMessage ? error : new VFileMessage(error)

        if (!file.messages.includes(message)) {
          file.messages.push(message)
        }

        message.fatal = true
      }
      // console.log('output:evalutate:Success/Content: ', file)
      setState({ ...config, file })
    },
    { leading: true, trailing: true, wait: 0 }
  )

  return [state, setConfig]
}

async function useNMdx(mdx, pageParms, setState) {
  let frontmatter = null;
  // process frontmatter
  try {
    if (pageParms && pageParms.parms) { delete pageParms.parms };
    const { content, data } = matter(mdx);
    frontmatter = { ...data, ...pageParms };
    mdx = matter.stringify(content, { ...frontmatter });
  } catch (error) {
    console.log(error)
  }
  const file = new VFile({ basename: 'example.mdx', value: mdx })

  if (frontmatter) { file.frontmatter = frontmatter };
  const capture = (name) => () => (tree) => {
    file.data[name] = tree
  }

  const remarkPlugins = []
  let config = {};

  if (config.gfm) remarkPlugins.push(remarkGfm)
  if (config.frontmatter) {
    remarkPlugins.push(remarkFrontmatter);
    remarkPlugins.push(remarkMdxFrontmatter);
  }
  if (config.unwrapImages) remarkPlugins.push(remarkUnwrapImages)
  // remarkPlugins.push(capture('mdast'))

  // process markdown
  try {
    file.result = (
      await evaluate(file, {
        ...provider,
        ...runtime,
        useDynamicImport: true,
        remarkPlugins,
        // rehypePlugins: [capture('hast')],
        // recmaPlugins: [capture('esast')],

      })
    ).default
  } catch (error) {
    // console.log('output:evalutate:Error: ', error)
    // console.log('output:evalutate:Error/Content: ', file)
    const message =
      error instanceof VFileMessage ? error : new VFileMessage(error)

    if (!file.messages.includes(message)) {
      file.messages.push(message)
    }

    message.fatal = true
  }
  // console.log('output:evalutate:Success/Content: ', file)
  setState(file);
  // setState({ ...config, file })
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  )
}

function FallbackComponent({ error }) {
  const message = new VFileMessage(error)
  message.fatal = true
  return (
    <pre>
      <code>{String(message)}</code>
    </pre>
  )
}



export default function Page(content) {
  const router = useRouter();
  let format = 'default';

  const defaultValue = `
    # No Content Loaded
    `;

  const [state, setConfig] = useMdx({
    gfm: true,
    frontmatter: true,
    math: false,
    unwrapImages: true,
    value: defaultValue
  })
  // useEffect(() => {
  //   if (content.content) {
  //     useMdx(content.content, router.query, setState)
  //   };
  //   console.log('useEffect:state :', state)
  // }, [content]);

  useEffect(() => {
    setConfig({ ...state, value: String(content.content) , pageParms: router.query })

  }, []);


  // setConfig({ ...state, value: String(mdxContent(content, router.query)) })

  // Create a preview component that can handle errors with try-catch block; for catching invalid JS expressions errors that ErrorBoundary cannot catch.
  const Preview = () => {
    try {
      console.log('/output:Preview:useCallback:state: ', state)

      return state.file.result()
    } catch (error) {
      console.log('/output:Preview:useCallback:Error: ', error)
      return <FallbackComponent error={error} />
    }
  };


  return (
    <DefaultView>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* <Preview components={mdComponents} /> */}
        {state && state.file && state.file.result ? (<Preview components={mdComponents} />) : null}
      </ErrorBoundary>
    </DefaultView>
  )
};




function DefaultView({
  children, // will be a page or nested layout
}) {

  const navItems = [
    {
      groupTitle: "Menu Group Title One",
      links: [
        {
          label: "Menu Item One",
          url: "",
        },
        {
          label: "Menu Item Two",
          url: "",
        },
      ],
    },
    {
      groupTitle: "Menu Group Title Two",
      links: [
        {
          label: "Menu Item One",
          url: "",
        },
        {
          label: "Menu Item Two",
          url: "",
        },
      ],
    },
  ];
  const navDrawerWidth = 300;
  const topBarHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Topbar onNavButtonClick={handleOnNavButtonClick}
        navOpen={menuOpen}
        menu={true}
        topBarHeight={topBarHeight} />
      <NavigationDrawer
        open={menuOpen}
        top={topBarHeight}
        drawerWidth={navDrawerWidth}
      >
        <Menu
          menuTitle="Main Navigation"
          menuItems={navItems}
          initialCollapsed={false}
          loading={false}
          fetching={false}
        />
      </NavigationDrawer>
      <div
        style={{
          marginTop: topBarHeight,
          paddingLeft: menuOpen ? navDrawerWidth : 0,
        }}
      ><Box sx={{ p: '5%' }}>
          <Typography variant="h1" component="h1">Title</Typography>
          <MDXProvider components={mdComponents}>
            {children}
          </MDXProvider>
        </Box>
      </div>
    </ThemeProvider>
  )
}


export async function getStaticPaths() {
  let paths = [];
  let location = 'services';
  try {
    const files = await getAllFiles(location)
    return {
      fallback: true,
      paths: files
    }
  } catch (error) {
    console.error(error)
    return {
      fallback: true,
      paths: files
    }
  }


}

export async function getStaticProps(context) {
  const location = 'services/' + context.params.parms.join('/') + '/index.mdx';
  try {
    const content = await getFileContent(location) // Pass null or an empty string for filePath
    console.log('getStaticProps:content: ', content)
    return {
      props: {
        content: content,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        content: [],
      },
    }
  }
}