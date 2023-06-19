import React, { useState, useEffect, useRef } from 'react'

import { ErrorBoundary } from 'react-error-boundary'
import { baseTheme } from '../../constants/baseTheme';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { mdComponents } from "../../constants/mdxProvider";
import Link from '@mui/material/Link';
import { Stack } from '@mui/material'
import { Chip } from '@mui/material'
import { TopBar } from '@/components/dashboard';
import { MiniStatisticsCard } from "@/components/dashboard";
import { MDXProvider } from '@mdx-js/react';
import { Menu, ButtonMenu, NavigationDrawer } from '@/components/airview-ui';
import { ControlTable } from '@/components/compliance/ControlTable';
import { ControlDataDisplay } from '@/components/compliance/ControlData';
import { useMdx } from '@/lib/content/mdx'
import Container from '@mui/material/Container';
import CloseIcon from '@mui/icons-material/Close';
import { PagedOutput } from '@/components/display/PagedOutput';
import { PresentationOutput } from '@/components/display/PresentationOutput';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, MenuItem, Box, Alert, Grid } from '@mui/material';
import { Container as MuiContainer } from "@mui/material";
import SlideshowIcon from '@mui/icons-material/Slideshow';

import {

  AsideAndMainContainer,
  Aside,
  Main,

} from '@/components/airview-ui';

import { Previewer } from 'pagedjs'

import { Tile } from '@/components/dashboard/Tiles'
import path from 'path';

import { siteConfig } from "../../site.config.js";

export function SolutionView({
  knowledge,
  solutions,
  designs,
  children,
  frontmatter,
  file,
  content
}) {


  const navDrawerWidth = 300;
  const topBarHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [controlUrl, setControlUrl] = useState('');
  const [print, setPrint] = useState(false);
  const [presentation, setPresentation] = useState(false);

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);

  const { solutionMenu, chapterFiles, knowledgeFiles, designFiles } = fileStructure(solutions)

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
        />

        <SolutionsMenu
          solutions={solutionMenu}
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
          <Typography variant="h1" component="h1" sx={{ mx: '2%' }}>{frontmatter?.title && frontmatter.title}</Typography>
          {frontmatter?.format === 'presentation' && <Box sx={{ background: 'rgb(229, 246, 253)', px: '10%' }}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Alert severity="info">This is a presentation. View in presentation mode by clicking </Alert>
              </Grid>
              <Grid item>
                <IconButton
                  size="medium"
                  onClick={() => handlePresentation()}
                  color="inherit"
                >
                  <SlideshowIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>}
          <AsideAndMainContainer>
            <Main sx={{ mt: '1%' }}>
              {children && children}
            </Main>
            <Aside sx={{ displayPrint: 'none', display: print ? 'none' : '' }}>
              <ChaptersMenu
                chapters={chapterFiles}
                file={file}
                open={menuOpen}
                top={topBarHeight}
                drawerWidth={navDrawerWidth}
              />
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


function ChaptersMenu({ chapters, file, open, top, drawerWidth }) {
  // console.log('ChaptersMenu: ', chapters)
  // console.log('ChaptersMenu:File ', file)
  let directory = file.split("/")[1]; // Extract directory name
  const chaptersMenu = [
    {
      groupTitle: "",
      links: chapters[directory]
    }
  ]

  return (
    <Menu
      menuTitle="Chapters"
      menuItems={chaptersMenu}
      initialCollapsed={false}
      loading={false}
      fetching={false}
    />
  );
}


function SolutionsMenu({ solutions, open, top, drawerWidth }) {
  // console.log('SolutionsMenu: ', solutions)

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


function fileStructure(solutions, knowledge) {
  const solutionMenu = [];
  const chapterFiles = {};
  const indexFiles = new Set();

  // First pass: Find index.md files
  for (let x of solutions) {
    if (
      x.file &&
      x.file.split('/').length === 3 &&
      x.file.match(/(_index\.md*|index\.md*)$/) &&
      x.frontmatter &&
      x.frontmatter.title
    ) {
      solutionMenu.push({
        label: x.frontmatter.title,
        url: x.file,
      });
      indexFiles.add(x.file.split("/")[1]); // Add directory name to the Set
    }
  }

  // Second pass: Process non-index.md files
  for (let x of solutions) {
    if (
      x.file &&
      x.file.split('/').length > 2 && // skip any files in the root of the directory
      !x.file.match(/(_index\.md*|index\.md*)$/) &&
      x.frontmatter &&
      x.frontmatter.title
    ) {
      let directory = x.file.split("/")[1]; // Extract directory name

      // Only add file to solutionMenu if there is no corresponding index.md
      if (!indexFiles.has(directory)) {
        solutionMenu.push({
          label: x.frontmatter.title,
          url: x.file,
        });
      }

      // Check if the key exists in the chapterFiles object
      if (!chapterFiles[directory]) {
        chapterFiles[directory] = [];
      }
      chapterFiles[directory].push({
        label: x.frontmatter.title,
        url: '/' + x.file,
      });
    }
  }
  return { solutionMenu, chapterFiles, knowledgeFiles: null, designFiles: null };
}
