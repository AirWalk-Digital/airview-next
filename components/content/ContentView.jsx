import React, { useState } from 'react'

import { baseTheme } from '../../constants/baseTheme';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import { TopBar } from '@/components/dashboard';
import { Menu, NavigationDrawer, ButtonMenu } from '@/components/airview-ui';
import { PagedOutput } from '@/components/display/PagedOutput';
import { PresentationOutput } from '@/components/display/PresentationOutput';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { IconButton, Typography, MenuItem, Box, Alert, Grid, ButtonBase } from '@mui/material';

import { AsideAndMainContainer, Aside, Main } from '@/components/airview-ui';

export function ContentView({
  children,
  frontmatter,
  file,
  content,
  menuStructure,
  pageStructure,
  handleContentClick,
  siteConfig = null
}) {


  // console.log('SolutionView:menuStructure: ', menuStructure)
  const navDrawerWidth = 300;
  const topBarHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [print, setPrint] = useState(false);
  const [presentation, setPresentation] = useState(false);

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);

  const { primary, relatedContent } = pageStructure || {};
  // console.log('SolutionView:pageStructure: ', pageStructure)
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

        <ContentMenu
          menu={menuStructure}
          open={menuOpen}
          top={topBarHeight}
          drawerWidth={navDrawerWidth}
        />
        <div
          style={{
            marginTop: topBarHeight,
            paddingLeft: menuOpen ? navDrawerWidth : 0,
          }}
        >
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
              <AsideMenu
                content={relatedContent}
                // chapters={chapters}
                // knowledge={knowledge}
                // designs={designs}
                siteConfig={siteConfig}
                handleContentClick={handleContentClick}
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


function AsideMenu({ content, file, handleContentClick, siteConfig }) {
  let directory = file?.includes("/") ? file.split("/")[1] : file;
  // // console.log('ChaptersMenu:File ', file)
  let chaptersMenu = []
  if (content && content[directory]) {

    for (let collection in siteConfig.content) {
      if (content[directory][collection]) {
        chaptersMenu.push(
          {
            groupTitle: capitalizeFirstLetter(collection),
            links: content[directory][collection]
          }
        )
      }
    }


    if (content[directory].chapters) {
      chaptersMenu.push(
        {
          groupTitle: "Chapters",
          links: content[directory].chapters
        }
      )
    }
    
  }
  if (chaptersMenu) {
    return (
      <>
        <ButtonBase
          variant="text"
          onClick={() => handleContentClick('/' + file, 'primary link')}
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
          menuTitle="Content"
          menuItems={chaptersMenu}
          initialCollapsed={false}
          loading={false}
          fetching={false}
          handleButtonClick={handleContentClick}
        /></>

    )
  
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



function ContentMenu({ menu, open, top, drawerWidth }) {

    // console.log('ContentMenu:menu: ', menu )

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


const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};