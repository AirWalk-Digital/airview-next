
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
import { parse } from 'toml';

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
        const { content, data } = matter(config.value);
        frontmatter = { ...data, ...config.pageParms };
        config.value = matter.stringify(content, { ...frontmatter });
      } catch (error) {
        console.log(error)
      }

      const file = new VFile({ basename: 'example.mdx', value: config.value })
      if (frontmatter) { file.frontmatter = frontmatter };

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



function createControlMenu(controls) {
  try {
  const links = controls.map((control) => {
    const label = control.data.name || control.data.title || ''; // Adjust the property name according to your control data structure
    const url = control.file.split('/').pop();

    return {
      label,
      url,
    };
  });

  return [
    {
      groupTitle: "Controls",
      links: links
    }];
} catch (error) {
  return [
    {
      groupTitle: "Controls",
  links: [
    {
      label: "CONTROL-00000",
      url: "",
    },
  ],}]

  return [
    {
      groupTitle: "Controls",
      links: []
    }];
}};

export default function Page(content, controls, type) {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    console.log('useEffect: ', pageData)
    setPageData({ navItemsControls: controls, type: type});
    console.log('page:controls', controls)
    console.log('page:type', type)
  }, [controls, type]);

  
  const router = useRouter();
  let format = 'default';
  const context = { source: 'local', router: router }
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


  useEffect(() => {
    setConfig({ ...state, value: String(content.content), pageParms: router.query })

  }, []);


  // setConfig({ ...state, value: String(mdxContent(content, router.query)) })

  // Create a preview component that can handle errors with try-catch block; for catching invalid JS expressions errors that ErrorBoundary cannot catch.
  const Preview = () => {
    try {
      return state.file.result()
    } catch (error) {
      return <FallbackComponent error={error} />
    }
  };

  
  return (
<ServiceView
  frontmatter={state && state.file && state.file.frontmatter ? state.file.frontmatter : {}}
  context={context}
  pageData={pageData ? pageData : {}} >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* <Preview components={mdComponents} /> */}
        {state && state.file && state.file.result ? (<Preview components={mdComponents} />) : null}
      </ErrorBoundary>
    </ServiceView>
  )
};




function ServiceView({
  children, // will be a page or nested layout
  frontmatter = null, // frontmatter collected from the page and the mdx file
  context = null, // the context from the page to help with relative files and links
  pageData = null // controls for the menu
}) {
  let navItemsControls = null;
  console.log('PageData', pageData);
  if (pageData && pageData.navItemsControls ) {navItemsControls = createControlMenu(pageData.navItemsControls)} else {navItemsControls = [
    {
      groupTitle: "Controls",
      links: []
    }];}

  const navItemsDocs = [
    {
      groupTitle: "Infrastructure-as-Code",
      links: [
        {
          label: "terraform-azure-storage",
          url: "",
        },
      ],
    },
    {
      groupTitle: "Designs",
      links: [
        {
          label: "Static Content Website",
          url: "",
        },
        {
          label: "Data Lakes",
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
          menuTitle="Controls"
          menuItems={navItemsControls}
          initialCollapsed={false}
          loading={false}
          fetching={false}
        />
        <Menu
          menuTitle="Documentation"
          menuItems={navItemsDocs}
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
      ><Box sx={{ px: '5%' }}>
          {frontmatter.title && <Typography variant="h1" component="h1">{frontmatter.title}</Typography>}
          {pageData.type && <Typography variant="h1" component="h1">{pageData.type}</Typography>}

          <MDXProvider components={mdComponents(context)}>
            {children}
          </MDXProvider>
        </Box>
      </div>
    </ThemeProvider>
  )
}


export async function getStaticPaths() {
  let pages = [];
  let location = 'services';
  try {
    const files = await getAllFiles(location)

    const pages = files.map((file) => {

      if (file.endsWith('index.md') || file.endsWith('index.mdx')) {
        const filepath = file.split('/');
        filepath.pop();
        const joinedPath = filepath.join('/');
        return joinedPath;
      } else {
        return file
      }
    })

    // console.log('getStaticPaths: ',pages )
    return {
      fallback: true,
      paths: pages
    }
  } catch (error) {
    console.error(error)
    return {
      fallback: true,
      paths: pages
    }
  }


}
export async function getStaticProps(context) {
  let location = null;
  let type = 'unknown';
  let controls = [];

  if (context.params.parms.length === 2) {
    type = 'service';
    location = 'services/' + context.params.parms.join('/') + '/index.mdx';
  } else if (context.params.parms.length === 3) {
    type = 'control';
    location = 'services/' + context.params.parms.join('/');
  }

  try {
    if (type === 'service') {
      const controlLocation = 'services/' + context.params.parms.join('/');
      const files = await getAllFiles(controlLocation, '/**/*.toml');
  
      const controlPromises = files.map(async (file) => {
        const content = await getFileContent(file);
        const ext = file.split('.').pop();
  
        if (ext === 'toml') {
          return parse(content);
        } else if (ext === 'md' || ext === 'mdx') {
          return matter('---\n' + content + '\n---', { excerpt: true });
        }
      });
  
      controls = await Promise.all(controlPromises);
    }

    const content = await getFileContent(location);

    return {
      props: {
        content: content,
        controls: controls,
        type: type,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        content: [],
        controls: controls,
        type: type,
      },
    };
  }
}
