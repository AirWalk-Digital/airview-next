
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
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { Stack } from '@mui/material'
import { Chip } from '@mui/material'
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
  console.log('createControlMenu:controls: ', controls)
  try {
    const links = controls.map((control) => {
      const label = control.data.id || ''; // Adjust the property name according to your control data structure
      const url = control.file;

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
    console.log('createControlMenu:error: ', error)

    return [
      {
        groupTitle: "Controls",
        links: [
          {
            label: "CONTROL-00000",
            url: "",
          },
        ],
      }]

    return [
      {
        groupTitle: "Controls",
        links: []
      }];
  }
};

export default function Page({ content, controls, type, menu, frontmatter }) {

  console.log('Page:menu: ', menu)
  const router = useRouter();
  const context = { source: 'local', router: router }

  if (type === 'service') {
    return (
      <ServiceView
        frontmatter={frontmatter ? frontmatter : {}}
        content={content ? content : {}}
        context={context}
        controls={controls} />
      //   <ErrorBoundary FallbackComponent={ErrorFallback}>
      //     {/* <Preview components={mdComponents} /> */}
      //     {state && state.file && state.file.result ? (<Preview components={mdComponents} />) : null}
      //   </ErrorBoundary>
      // </ServiceView>
    )
  } else if (type === 'csp') {
    return <CSPView menu={menu} content={content} frontmatter={frontmatter} context={context} />
  } else if (type === 'index') {
    return <IndexView menu={menu} />
  }

};

function Tile({ name, url }) {

  return (

    <Link href={url} underline="none"><Box
      sx={{
        bgcolor: 'background.paper',
        boxShadow: 0,
        border: 2,
        borderRadius: 2,
        p: 2,
        minWidth: 300,
      }}
    >
      <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
        {name}
      </Box>
    </Box></Link>
  )
}

function createMenu(menu) {
  console.log('createMenu:menu: ', menu)
  if (!menu) {
    return [
      {
        groupTitle: "N/A",
        links: []
      }]
  }
  let csp = [];
  let paths = [];
  let services = [];
  let navItems = [];

  // add CSPs
  menu.forEach((x, i) => {
    if (x && x.frontmatter && x.frontmatter.title) {
      console.log(x.file + ': ' + x.file.split('/').length)
      if (x && x.file.split('/').length === 4) {
        csp.push({ name: x.frontmatter.title, path: x.file.replace("/index.mdx", "") })
        paths.push(x.file.replace("/index.mdx", ""))
      }
    }
  });

  menu.forEach((x, i) => {
    if (x && x.frontmatter && x.frontmatter.title) {
      if (x && x.file.split('/').length === 5) {
        const path = x.file.split("/")
        services.push({ base: path.slice(0, 3).join("/"), label: x.frontmatter.title, url: x.file.replace("/index.mdx", "") })
      }
    }
  });

  paths.forEach((x, i) => {
    let links = [];
    services.forEach((y, i) => {
      if (x === y.base) {
        console.log('match: ', y)
        links.push({ label: y.label, url: y.url })
      }
    });
    let rootcsp = '';
    csp.forEach((z, i) => {
      if (x === z.path) {
        rootcsp = z.name
      }
    })
    navItems.push({ groupTitle: rootcsp, links: links })

  });

  return { navItems, csp }

}


function IndexView({
  menu, // the menu from staticProps
  children, // will be a page or nested layout
  frontmatter = null, // frontmatter collected from the page and the mdx file
  context = null, // the context from the page to help with relative files and links
  pageData = null // controls for the menu
}) {

  console.log('IndexView:menu: ', menu)


  const { navItems, csp } = createMenu(menu);
  console.log('IndexView:navItems: ', navItems)

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
          menuTitle="Services"
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
      ><Box sx={{ px: '5%' }}>
          <Typography variant="h1" component="h1">Services and Service Providers</Typography>

          <Container maxWidth="lg" sx={{ height: '100vh', mt: '10%' }}>
            <Grid container spacing={4} alignItems="stretch">
              {csp ? (
                csp.map((c, i) => <Tile key={i} name={c.name} url={c.path} />)
              ) : (
                null
              )}
            </Grid>
          </Container>

        </Box>
      </div>
    </ThemeProvider>
  )
}



function CSPView({
  menu, // the menu from staticProps
  children, // will be a page or nested layout
  content = null, // the context from the page to help with relative files and links
  frontmatter = null,
  pageData = null // controls for the menu
}) {

  console.log('IndexView:menu: ', menu)

  console.log('IndexView:content: ', content)

  console.log('IndexView:frontmatter: ', frontmatter)

  const { navItems, csp } = createMenu(menu);

  console.log('IndexView:navItems: ', navItems)
  let tiles = [];
  if (frontmatter && frontmatter.title) { tiles = navItems.filter(item => item.groupTitle === frontmatter.title)[0].links; }
  tiles = navItems.filter(item => item.groupTitle === "Microsoft Azure")[0].links;
  console.log('IndexView:tiles: ', tiles)

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
          menuTitle="Services"
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
      ><Box sx={{ px: '5%' }}>
          {frontmatter && frontmatter.title && <Typography variant="h1" component="h1">{frontmatter.title} Services</Typography>}

          <Container maxWidth="lg" sx={{ height: '100vh', mt: '10%' }}>
            <Grid container spacing={4} alignItems="stretch">
              {tiles ? (
                tiles.map((c, i) => <Tile key={i} name={c.label} url={c.url} />)
              ) : (
                null
              )}
            </Grid>
          </Container>

        </Box>
      </div>
    </ThemeProvider>
  )
}



function OldPage(content, controls, type) {
  const [pageData, setPageData] = useState(null);
  console.log('page:type', type)

  useEffect(() => {
    console.log('useEffect: ', pageData)
    setPageData({ navItemsControls: controls, type: type });
    console.log('page:controls', controls)
    // console.log('page:type', type)
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

  if (type === 'service') {
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
  } else if (type === 'csp') {
    return <h1>CSP</h1>
  } else if (type === 'index') {
    return <h1>index</h1>
  }

};

function ServicesHeader(frontmatter) {
  if (!frontmatter) { return <></> }
  frontmatter = frontmatter.frontmatter
  console.log('ServicesHeader:frontmatter: ', frontmatter)
  const iconcolor = 'primary';
  return (
    <>
      <Container sx={{ px: '0px', mb: '2%' }}>
        <Stack direction="row" spacing={1}>
          {frontmatter.status === 'approved' ? <Chip label="Approved for use" color="success" /> : <Chip label="Unapproved" color="error" />}
          {(frontmatter?.resilience?.redundancy) ? <Chip label={`Redundancy: ${frontmatter.resilience.redundancy}`} color="success" /> : <Chip label="No Redundancy info" color="error" />}
          {frontmatter?.resilience?.find(item => item.name === "availability") ? (
          <Chip
            label={`Availability: ${frontmatter.resilience.find(item => item.name === "availability").availability}`}
            color="success"
          />
        ) : (
          <Chip label="No SLA Defined" color="error" />
        )}

        </Stack>
      </Container>
      {/* <Container>

        <Grid container spacing={4} alignItems="stretch" sx={{ pt: '2%' }}>
          <Grid item xs={3} md={3} sx={{ mb: '20px' }}>

            <Box
              sx={{
                // bgcolor: 'background.paper',
                borderColor: 'error', //icon.color,
                boxShadow: 0,
                border: 1,
                borderRadius: 2,
                p: 2,
                // minWidth: 300,
              }}
            >
              <Grid item xs={8}>
                <Box lineHeight={1}>


                  <Box sx={{ fontSize: 16, color: 'text.secondary' }}>title</Box>
                  <Box sx={{ color: 'text.primary', fontSize: 34, fontWeight: 'medium' }}>
                    count
                  </Box>
                  <Box
                    sx={{
                      color: iconcolor,
                      display: 'inline',
                      fontWeight: 'bold',
                      mx: 0.5,
                      fontSize: 14,
                    }}
                  >
                    value 2
                  </Box>
                  <Box sx={{ color: iconcolor, display: 'inline', fontSize: 14 }}>
                    test 3
                  </Box>
                </Box>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container> */}
    </>
  )
}


function ServiceView({
  menu, // the menu from staticProps
  content, // will be a page or nested layout
  frontmatter = null, // frontmatter collected from the page and the mdx file
  context = null, // the context from the page to help with relative files and links
  pageData = null, // controls for the menu
  controls = null
}) {

  const { navItems, csp } = createMenu(menu);

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
    setConfig({ ...state, value: String(content), pageParms: context.query })

  }, []);
  const Preview = () => {
    try {
      return state.file.result()
    } catch (error) {
      return <FallbackComponent error={error} />
    }
  };



  let navItemsControls = null;
  console.log('PageData', pageData);
  if (controls) { navItemsControls = createControlMenu(controls) } else {
    navItemsControls = [
      {
        groupTitle: "Controls",
        links: []
      }];
  }
  console.log('navItemsControls :', navItemsControls)
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
          linkComponent={Link}
        />
        <Menu
          menuTitle="Documentation"
          menuItems={navItemsDocs}
          initialCollapsed={false}
          loading={false}
          fetching={false}
          linkComponent={Link}

        />
      </NavigationDrawer>
      <div
        style={{
          marginTop: topBarHeight,
          paddingLeft: menuOpen ? navDrawerWidth : 0,
        }}
      ><Box sx={{ px: '5%' }}>
          {frontmatter.title && <Typography variant="h1" component="h1">{frontmatter.title}</Typography>}
          {/* {pageData.type && <Typography variant="h1" component="h1">{pageData.type}</Typography>} */}
          {frontmatter && <ServicesHeader frontmatter={frontmatter} />}
          <MDXProvider components={mdComponents(context)}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              {/* <Preview components={mdComponents} /> */}
              {state && state.file && state.file.result ? (<Preview components={mdComponents} />) : null}
            </ErrorBoundary>

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
    pages.push('/services')
    console.log('getStaticPaths: ', pages)
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
  let menu = [];
  let content = '';


  if (context.params && context.params.parms && context.params.parms.length === 1) {
    type = 'csp';
    location = 'services/' + context.params.parms.join('/') + '/index.mdx';
  } else if (context.params && context.params.parms && context.params.parms.length === 2) {
    type = 'service';
    location = 'services/' + context.params.parms.join('/') + '/index.mdx';
  } else if (context.params && context.params.parms && context.params.parms.length === 3) {
    type = 'control';
    location = 'services/' + context.params.parms.join('/');
  } else { // index page ?
    type = 'index';
  }
  try {
    if (type === 'service') {
      const controlLocation = 'services/' + context.params.parms.join('/');
      const files = await getAllFiles(controlLocation, '/**/*.toml');

      const controlPromises = files.map(async (file) => {
        const content = await getFileContent(file);
        const ext = file.split('.').pop();

        if (ext === 'toml') {
          return { data: parse(content), file: file };
        } else if (ext === 'md' || ext === 'mdx') {
          return { data: matter('---\n' + content + '\n---', { excerpt: true }), file: file };
        }
      });

      controls = await Promise.all(controlPromises);

    } else if (type === 'index') {
      console.log('getStaticProps:index')

      // construct menu structure
      const controlLocation = 'services/';
      const files = await getAllFiles(controlLocation, '/**/*.md*');
      const pagePromises = files.map(async (file) => {
        const content = await getFileContent(file);
        const ext = file.split('.').pop();
        if (ext === 'md' || ext === 'mdx') {
          const matterData = matter(content, { excerpt: false }).data;
          return { file: file, frontmatter: matterData };

        }
      });

      menu = await Promise.all(pagePromises);
    } else if (type === 'csp') {

      // construct menu structure
      const controlLocation = 'services/' + context.params.parms.join('/');
      const files = await getAllFiles(controlLocation, '/**/*.md*');
      const pagePromises = files.map(async (file) => {
        const content = await getFileContent(file);
        const ext = file.split('.').pop();
        if (ext === 'md' || ext === 'mdx') {
          const matterData = matter(content, { excerpt: false }).data;
          return { file: file, frontmatter: matterData };
        }
      });

      menu = await Promise.all(pagePromises);
    }
    let frontmatter = [];
    let pageContent = {};
    if (location) {
      const fileContent = await getFileContent(location);
      console.log('getStaticProps:fileContent: ', fileContent)
      pageContent = await matter(fileContent);
      console.log('getStaticProps:pageContent: ', pageContent)

      // pageContent = content;
      // frontmatter = data;
    };

    console.log('getStaticProps:pageContent: ', pageContent)
    console.log('getStaticProps:location: ', location)


    return {
      props: {
        menu,
        content: pageContent?.content ?? null,
        frontmatter: pageContent?.data ?? null,
        controls: controls,
        type: type,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        menu,
        content: [],
        frontmatter: [],
        controls: controls,
        type: type,
      },
    };
  }
}
