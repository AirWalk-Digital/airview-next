import React, { useState } from 'react'

import { baseTheme } from '../../constants/baseTheme';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { TopBar, ControlBar } from '@/components/dashboard';
import { Menu, NavigationDrawer, ButtonMenu } from '@/components/airview-ui';
import { PagedOutput } from '@/components/display/PagedOutput';
import { PresentationOutput } from '@/components/display/PresentationOutput';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { IconButton, Typography, MenuItem, Box, Alert, Grid, ButtonBase } from '@mui/material';

import { AsideAndMainContainer, Aside, Main } from '@/components/airview-ui';
import { TableOfContents } from '@/components/content';

export function SolutionView({
  children,
  frontmatter,
  file,
  content,
  menuStructure,
  handleContentChange,
  setEditMode,
  collection
}) {


  let tableOfContents = [];
  if (frontmatter && frontmatter.tableOfContents) {


  }
  // ControlBar
  const [controlBarOpen, setControlBarOpen] = useState(false);
  const handleEditMode = (mode) => {
    setEditMode(mode)
    setMenuOpen(!mode)
  }

  // console.log('SolutionView:menuStructure: ', menuStructure)
  const navDrawerWidth = 300;
  const topBarHeight = controlBarOpen ? 64 + 64 : 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [print, setPrint] = useState(false);
  const [presentation, setPresentation] = useState(false);

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);

  const { primary, relatedContent, knowledge, designs, chapters } = menuStructure || {};
  // // console.log('SolutionView:menuStructure: ', menuStructure)
  function handlePrint() {
    setPrint(!print);
    setMenuOpen(print);
  };

  function handlePresentation() {
    setPresentation(!presentation);
  };

  if (!print && !presentation) {
    return (
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
        <SolutionsMenu
          solutions={primary}
          open={menuOpen}
          top={topBarHeight}
          drawerWidth={navDrawerWidth}
        />
        <div
          style={{
            marginTop: topBarHeight,
            paddingLeft: menuOpen ? navDrawerWidth : 0,
            // paddingLeft: (print || !menuOpen) ? 0 : navDrawerWidth,

          }}
        >
          {/* {frontmatter  && <ServicesHeader frontmatter={frontmatter} controlCoverage={controlCoverage} />} */}
          <Typography variant="h1" component="h1" sx={{ pl: 0, mx: '2%' }}>{frontmatter?.title && frontmatter.title}</Typography>
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
            <Main sx={{}}>
              {children && children}
            </Main>
            <Aside sx={{ mt: '1%', displayPrint: 'none', display: print ? 'none' : '' }}>

              <ContentMenu
                content={relatedContent}
                // chapters={chapters}
                // knowledge={knowledge}
                // designs={designs}
                handleContentChange={handleContentChange}
                file={file}
              />
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
    )
  } else if (print) {
    return (
      <PagedOutput handlePrint={handlePrint} >
        <ThemeProvider theme={baseTheme}>
        <CssBaseline />
        {children && children}
        </ThemeProvider>
      </PagedOutput>
    )
  } else if (presentation) {
    return (
      <PresentationOutput handlePresentation={handlePresentation} refresh={false} content={content}>
        {children && children}
      </PresentationOutput>
    )
  }
}


function ContentMenu({ content, file, handleContentChange }) {
  let directory = file?.includes("/") ? file.split("/")[1] : file;
  // // console.log('ChaptersMenu:File ', file)
  let chaptersMenu = []
  if (content && content[directory]) {
    if (content[directory].chapters) {
      chaptersMenu.push(
        {
          groupTitle: "Chapters",
          links: content[directory].chapters
        }
      )
    }
    if (content[directory].knowledge) {
      chaptersMenu.push(
        {
          groupTitle: "Knowledge",
          links: content[directory].knowledge

        }
      )
    }
    if (content[directory].designs) {
      chaptersMenu.push(
        {
          groupTitle: "Designs",
          links: content[directory].designs
        }
      )
    }
  }
  if (chaptersMenu) {
    // return (null)

    return (
      <>
        <ButtonBase
          variant="text"
          onClick={() => handleContentChange(file, false)}
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
