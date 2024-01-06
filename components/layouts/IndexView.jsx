import React, { useState } from 'react'
import { Box, Typography, LinearProgress } from '@mui/material';
// import { baseTheme } from '../../constants/baseTheme';
// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Tile } from '@/components/buttons'
import { TopBar } from '@/components/appbar';
import { FullScreenSpinner } from '@/components/loaders'

import path from 'path';



import { siteConfig } from "../../site.config.js";

export function IndexView({
  tiles,
  menuStructure,
  title,
  menuComponent,
  initialContext = null,
  loading
}) {

  // console.log('IndexView:menuStructure: ', menuStructure)

  const MenuComponent = menuComponent;

  const navDrawerWidth = 300;
  const topBarHeight = 65;
  const [menuOpen, setMenuOpen] = useState(true);

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);


  if (loading || !tiles) {
  return (
    // <ThemeProvider theme={baseTheme}>
      // <CssBaseline />
      <>
      <TopBar onNavButtonClick={handleOnNavButtonClick}
        navOpen={menuOpen}
        menu={true}
        topBarHeight={topBarHeight} />
      <div style={{ marginTop: topBarHeight }}>
        <LinearIndeterminate style={{ marginTop: topBarHeight }} />
      </div>
      <FullScreenSpinner/>
      </>
    // </ThemeProvider>

  )
  }

  return (
    // <ThemeProvider theme={baseTheme}>
    <>
      {/* <CssBaseline /> */}
      <TopBar onNavButtonClick={handleOnNavButtonClick}
        navOpen={menuOpen}
        menu={true}
        topBarHeight={topBarHeight} />

      <MenuComponent
        menu={menuStructure?.primary ? menuStructure?.primary : null}
        open={menuOpen}
        top={topBarHeight}
        drawerWidth={navDrawerWidth}
      />

      <div
        style={{
          marginTop: topBarHeight,
          paddingLeft: menuOpen ? navDrawerWidth : 0,
        }}
      ><Box sx={{ px: '5%' }}>
          <Typography variant="h1" component="h1">{title}</Typography>
          <Container maxWidth="lg" sx={{ maxHeight: '100vh', mt: '2%' }}>
          {/* <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'space-between' }}> */}
          <Grid container spacing={2}>

              {tiles ? (
                tiles.map((c, i) => (
                  <Tile
                    key={i}
                    name={c?.frontmatter?.title}
                    url={c?.file}
                    isHero={c?.frontmatter?.hero}
                    image={
                      c?.frontmatter?.hero && c?.frontmatter?.image != null
                        ? `/api/content/github/${siteConfig.content[initialContext.path].owner}/${siteConfig.content[initialContext.path].repo}?path=${path.dirname(c.file)}/${c.frontmatter.image}&branch=${siteConfig.content[initialContext.path].branch}`
                        : c?.frontmatter?.hero
                        ? '/generic-solution.png'
                        : c?.frontmatter?.image ? `/api/content/github/${siteConfig.content[initialContext.path].owner}/${siteConfig.content[initialContext.path].repo}?path=${path.dirname(c.file)}/${c.frontmatter.image}&branch=${siteConfig.content[initialContext.path].branch}` : null
                    }
                  />
                ))) : (
                <div>...loading</div>
              )}
            </Grid>
          </Container>

        </Box>
      </div>
      </>
    // </ThemeProvider>
  )
}


function LinearIndeterminate() {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
}