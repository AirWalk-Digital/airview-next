import React, { useState } from 'react'

import { baseTheme } from '../../constants/baseTheme';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { TopBar } from '@/components/dashboard';
import { Menu, NavigationDrawer } from '@/components/airview-ui';
import { PagedOutput } from '@/components/display/PagedOutput';
import { PresentationOutput } from '@/components/display/PresentationOutput';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { IconButton, Typography, MenuItem, Box, Alert, Grid } from '@mui/material';

import { AsideAndMainContainer, Aside, Main } from '@/components/airview-ui';

export function SolutionView({
  children,
  frontmatter,
  file,
  content,
  menuStructure
}) {


  console.log('SolutionView:frontmatter: ', frontmatter)
  const navDrawerWidth = 300;
  const topBarHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [print, setPrint] = useState(false);
  const [presentation, setPresentation] = useState(false);

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);

  const { solutions, chapters, knowledge, designs } = menuStructure || {};
  // console.log('SolutionView:menuStructure: ', menuStructure)
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
          solutions={solutions}
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
              <Grid xs="auto">
                <Alert severity="info">This is a presentation. View in presentation mode by clicking </Alert>
              </Grid>
              <Grid >
                <IconButton
                  size="medium"
                  onClick={handlePresentation}
                  color="inherit"
                >
                  <SlideshowIcon />
                </IconButton>
              </Grid>
              <Grid xs/>
            </Grid>
            }

{frontmatter.padID && <Grid container alignItems="center" spacing={1} style={{ textAlign: 'center' }} sx={{ background: 'rgb(229, 246, 253)', px: '10px' }}>
<Grid xs="auto">
                <Alert severity="info">This is draft content from Etherpad edit here: </Alert>
              </Grid>
              <Grid >
                <IconButton
                  size="medium"
                  // onClick={handlePresentation}
                  color="inherit"
                >
                  <SlideshowIcon />
                </IconButton>
              </Grid>
              <Grid xs/>
            </Grid>
            }

          <AsideAndMainContainer>
            <Main sx={{}}>
              {children && children}
            </Main>
            <Aside sx={{ mt: '1%', displayPrint: 'none', display: print ? 'none' : '' }}>
              <ContentMenu
                chapters={chapters}
                knowledge={knowledge}
                file={file}
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


function ContentMenu({ chapters, file, knowledge }) {
  // console.log('ChaptersMenu: ', chapters)
  // console.log('ChaptersMenu:File ', file)
  let directory = file ? file.split("/")[1] : '';
  let chaptersMenu = []
  if (chapters && chapters[directory]) {
    chaptersMenu.push(
      {
        groupTitle: "Chapters",
        links: chapters[directory]
      }
    )
  }
  if (knowledge && knowledge[directory]) {
    chaptersMenu.push(
      {
        groupTitle: "Knowledge",
        links: knowledge[directory]
      }
    )
  }

  if (chaptersMenu) {
    return (
      <Menu
        menuTitle="Content"
        menuItems={chaptersMenu}
        initialCollapsed={false}
        loading={false}
        fetching={false}
      />
    );
  }
}




function SolutionsMenu({ solutions, open, top, drawerWidth }) {
  console.log('SolutionsMenu: ', solutions)

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
