import React, { useEffect, useState, useCallback } from 'react'

import { baseTheme } from '../../constants/baseTheme';
import { MDXProvider } from "@mdx-js/react";
import { mdComponents } from "../../constants/mdxProvider.js";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { TopBar, ControlBar } from '@/components/dashboard';
import { Menu, NavigationDrawer, ButtonMenu } from '@/components/airview-ui';
import { PagedOutput } from '@/components/display/PagedOutput';
import { PresentationOutput } from '@/components/display/PresentationOutput';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { IconButton, Typography, MenuItem, Box, Alert, Grid, ButtonBase } from '@mui/material';
import { FullScreenSpinner } from "@/components/dashboard/index.js";

import { AsideAndMainContainer, Aside, Main } from '@/components/airview-ui';
import { TableOfContents } from '@/components/content';
import { ContentWrapperContext } from '@/components/content';
import { Etherpad } from '@/components/etherpad';
import deepEqual from 'deep-equal';
import path from 'path';

export function ContentPage({
  pageContent,
  file,
  content,
  menuStructure,
  handleContentChange,
  handlePageReset,
  collection,
  context,
  menuComponent,
  headerComponent = null,
  sideComponent = null
}) {

  const [frontmatter, setFrontmatter] = useState(pageContent.frontmatter);
  const MenuComponent = menuComponent;
  const HeaderComponent = headerComponent;
  const SideComponent = sideComponent;

  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };

  // Use useCallback to memoize the frontMatterCallback function
  const frontMatterCallback = useCallback((newFrontmatter) => {
    if (!isEmptyObject(newFrontmatter) && !deepEqual(frontmatter, newFrontmatter)) {
      setFrontmatter(newFrontmatter);
    }
  }, [frontmatter]); // Make sure to include frontmatter in the dependency array


  // ControlBar
  const [controlBarOpen, setControlBarOpen] = useState(false);
  const handleEditMode = (mode) => {
    setEditMode(mode)
    setMenuOpen(!mode)
  }

  const navDrawerWidth = 300;
  const topBarHeight = controlBarOpen ? 64 + 64 : 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [print, setPrint] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [editMode, setEditMode] = useState(false);


  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);

  const { primary, relatedContent } = menuStructure || {};
  function handlePrint() {
    setPrint(!print);
    setMenuOpen(print);
  };

  function handlePresentation() {
    setPresentation(!presentation);
  };

  // let Content = <h1>tesr</h1>;
  // let Content = FullScreenSpinner ;

  const Content = () => {
    if (context && context.file && context.file.endsWith('.etherpad')) {
      return <Etherpad file={context.file} frontMatterCallback={frontMatterCallback} editMode={editMode} />
    } else if (context && pageContent.content && pageContent.frontmatter) {
      const Page = pageContent.content;
      return <Page />;
    } else {
      return <FullScreenSpinner />
    }
  }

  useEffect(() => { // update the frontmatter
    if (pageContent.frontmatter) {
      setFrontmatter(pageContent.frontmatter);
    }
  }, [pageContent.frontmatter]);

  if (!print && !presentation) {
    return (
      <ContentWrapperContext>
        <ThemeProvider theme={baseTheme}>
          <CssBaseline />
          <TopBar onNavButtonClick={handleOnNavButtonClick}
            navOpen={menuOpen}
            menu={true}
            topBarHeight={topBarHeight}
            handlePrint={handlePrint}
            handlePresentation={frontmatter?.format === 'presentation' ? handlePresentation : null}
            handleMore={() => setControlBarOpen(controlBarOpen => !controlBarOpen)}
          />
          <ControlBar open={controlBarOpen} height={64}
            handleEdit={handleEditMode}
            handlePrint={handlePrint}
            handlePresentation={frontmatter?.format === 'presentation' ? handlePresentation : null}
            collection={collection}
          />



          {menuStructure && <MenuComponent
            menu={menuStructure.primary}
            open={menuOpen}
            top={topBarHeight}
            drawerWidth={navDrawerWidth}
          />}
          <div
            style={{
              marginTop: topBarHeight,
              paddingLeft: menuOpen ? navDrawerWidth : 0,
              // paddingLeft: (print || !menuOpen) ? 0 : navDrawerWidth,

            }}
          >
            {
              headerComponent ? (
                <HeaderComponent frontmatter={frontmatter} />
              ) : (
                <Typography variant="h1" component="h1" sx={{ pl: 0, mx: '2%' }}>{frontmatter?.title && frontmatter.title}</Typography>
              )
            }
            {frontmatter?.format === 'presentation' && <Grid container alignItems="center" spacing={1} style={{ textAlign: 'center' }} sx={{ background: 'rgb(229, 246, 253)', px: '10px' }}>
              <Grid xs="auto" item>
                <Alert severity="info">This is a presentation. View in presentation mode by clicking </Alert>
              </Grid>
              <Grid item>
                <IconButton
                  size="medium"
                  onClick={handlePresentation}
                  color="inherit"
                >
                  <SlideshowIcon />
                </IconButton>
              </Grid>
              <Grid xs />
            </Grid>
            }

            {frontmatter?.padID && <Grid container alignItems="center" spacing={1} style={{ textAlign: 'center' }} sx={{ background: 'rgb(229, 246, 253)', px: '10px' }}>
              <Grid>
                <Alert severity="info">This is draft content from Etherpad edit here: </Alert>
              </Grid>
              <Grid>
                <IconButton
                  size="medium"
                  // onClick={handlePresentation}
                  color="inherit"
                >
                  <SlideshowIcon />
                </IconButton>
              </Grid>
              <Grid />
            </Grid>
            }

            <AsideAndMainContainer>
              {/* <Main sx={{}}> */}
              <Main>
                <MDXProvider components={mdComponents(context)}>
                  <><Content /></>
                </MDXProvider>
              </Main>
              <Aside sx={{ displayPrint: 'none', display: print ? 'none' : '' }}>

                <ContentMenu
                  content={relatedContent}
                  context={context}
                  // knowledge={knowledge}
                  // designs={designs}
                  handleContentChange={handleContentChange}
                  handlePageReset={handlePageReset}
                  file={file}
                />
                { sideComponent && <SideComponent /> }
                {frontmatter?.tableOfContents && <TableOfContents tableOfContents={frontmatter.tableOfContents} />}

                {/* <ButtonMenu
                menuTitle="Controls"
                menuItems={createControlMenu(controls)}
                initialCollapsed={false}
                loading={false}
                fetching={false}
                handleButtonClick={handleControlClick}
              /> */}

              </Aside>
            </AsideAndMainContainer>
          </div>
        </ThemeProvider>
      </ContentWrapperContext>
    )
  } else if (print) {
    return (
      <ContentWrapperContext>
        <PagedOutput handlePrint={handlePrint} >
          <ThemeProvider theme={baseTheme}>
            <CssBaseline />
            <MDXProvider components={mdComponents(context)}>
              <><Content /></>
            </MDXProvider>
          </ThemeProvider>
        </PagedOutput>
      </ContentWrapperContext>
    )
  } else if (presentation) {
    return (
      <ContentWrapperContext>
        <PresentationOutput handlePresentation={handlePresentation} refresh={false} content={content}>
          <MDXProvider components={mdComponents(context)}>
            <><Content /></>
          </MDXProvider>
        </PresentationOutput>
      </ContentWrapperContext>
    )
  }
}


function ContentMenu({ content, file, handleContentChange, handlePageReset, context }) {
  // let directory = file?.includes("/") ? file.split("/")[1] : file;

  let directory = path.dirname(file);

  // console.log('ContentMenu:directory ', directory)
  // console.log('ContentMenu:collection ', context)

  let chaptersMenu = []
  if (content && content[directory]) {
    for (let collectionItem of context.collections) {
      if (content[directory][collectionItem]) {
        chaptersMenu.push(
          {
            groupTitle: collectionItem.path,
            links: content[directory][collectionItem]
          }
        )
      } 
    }
  
    


    // if (content[directory].chapters) {
    //   chaptersMenu.push(
    //     {
    //       groupTitle: "Chapters",
    //       links: content[directory].chapters
    //     }
    //   )
    // }
    // if (content[directory].knowledge) {
    //   chaptersMenu.push(
    //     {
    //       groupTitle: "Knowledge",
    //       links: content[directory].knowledge

    //     }
    //   )
    // }
    // if (content[directory].designs) {
    //   chaptersMenu.push(
    //     {
    //       groupTitle: "Designs",
    //       links: content[directory].designs
    //     }
    //   )
    // }
  }
  if (chaptersMenu) {
    // return (null)

    return (
      <>
        <ButtonBase
          variant="text"
          onClick={() => handlePageReset()}
          sx={{
            textDecoration: "none",
            textTransform: 'none',
            textAlign: 'left',
            fontWeight: 'bold',
            color: 'secondary.main',
            mb: '5%'
          }}
        >Main Content</ButtonBase>

        <ButtonMenu
          menuTitle="Related Content"
          menuItems={chaptersMenu}
          initialCollapsed={false}
          loading={false}
          fetching={false}
          handleButtonClick={handleContentChange}
        /></>

    )
    // return (
    //   <Menu
    //     menuTitle="Content"
    //     menuItems={chaptersMenu}
    //     initialCollapsed={false}
    //     loading={false}
    //     fetching={false}
    //   />
    // );
  }
}




function SolutionsMenu({ solutions, open, top, drawerWidth }) {
  // // console.log('SolutionsMenu: ', solutions)

  return (
    <NavigationDrawer
      open={open}
      top={top}
      drawerWidth={drawerWidth}
    >
      {solutions && solutions.map((c, i) => <Link key={i} href={c.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}><MenuItem sx={{ pl: '0', color: 'text.secondary' }}>
        {c.label}</MenuItem></Link>)}
    </NavigationDrawer>
  );
}


function LeftMenu({ menu, open, top, drawerWidth }) {

  // console.log('LeftMenu:menu: ', menu)

  return (
    <NavigationDrawer
      open={open}
      top={top}
      drawerWidth={drawerWidth}
    >
      {menu &&
        menu.length > 0 &&
        menu.map((c) => (
          <React.Fragment key={c.label}>
            <Link href={c.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}>
              <h3 sx={{ pl: '0', color: 'text.secondary' }}>{c.label}</h3>
            </Link>
            {c.children && <L2Menu menu={c.children} />}
          </React.Fragment>
        ))}

    </NavigationDrawer>
  );
}

const L2Menu = ({ menu }) => {
  return (
    <>
      {menu && Object.entries(menu).map(([key, children]) => (
        <div key={key}>
          <Menu
            key={key}
            menuTitle={capitalizeFirstLetter(key)}
            menuItems={[{ links: children }]}
            initialCollapsed={true}
            loading={false}
            fetching={false}
            linkComponent={Link}
          />

          {/* 
        <h3 sx={{ pl: '0', color: 'text.secondary', textTransform: 'capitalize' }}>
          {key}
        </h3>
        {children && children.map((item, index) => (
          <Link key={index} href={item.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}>
            <MenuItem sx={{ pl: '0', color: 'text.secondary'}}>
               {item.label}</MenuItem>
          </Link>
        ))} */}
        </div>
      ))}
    </>
  );
};

// {menu.map((c, i) =>  <Link key={i} href={c.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}><MenuItem sx={{ pl: '0', color: 'text.secondary'}}>
//                 {c.label}</MenuItem></Link>)}




function BasicLeftMenu({ menu, open, top, drawerWidth }) {
  // console.log('BasicLeftMenu: ', menu)

  return (
    <NavigationDrawer
      open={open}
      top={top}
      drawerWidth={drawerWidth}
    >
      {menu && menu.map((c, i) => <Link key={i} href={c.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}><MenuItem sx={{ pl: '0', color: 'text.secondary' }}>
        {c.label}</MenuItem></Link>)}
    </NavigationDrawer>
  );
}



const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};


