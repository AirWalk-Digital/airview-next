import React, { useState } from 'react'
import { Box, Typography, MenuItem } from '@mui/material';
import { baseTheme } from '../../constants/baseTheme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { Menu, NavigationDrawer } from '../../components/airview-ui';
import { Tile } from '@/components/dashboard/Tiles'
import { TopBar } from '@/components/dashboard';
// import { HeaderMinimalMenu } from '@/components/dashboard/Menus'
import path from 'path';

import { siteConfig } from "../../site.config.js";

export function IndexView({
  tiles,
  menuStructure,
  title, 
  menuComponent
}) {

  // console.log('IndexView:title: ', title)

  const MenuComponent = menuComponent;

  const navDrawerWidth = 300;
  const topBarHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);
  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <TopBar onNavButtonClick={handleOnNavButtonClick}
        navOpen={menuOpen}
        menu={true}
        topBarHeight={topBarHeight} />

      <MenuComponent
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
      ><Box sx={{ px: '5%' }}>
          <Typography variant="h1" component="h1">{title}</Typography>
          <Container maxWidth="lg" sx={{ maxHeight: '100vh', mt: '10%' }}>
            <Grid container spacing={4} alignItems="stretch">
              {tiles ? (
                tiles.map((c, i) => (
                  <Tile
                    key={i}
                    name={c?.frontmatter?.title}
                    url={c?.file}
                    image={
                      c?.frontmatter?.image
                        ? `/api/content/github/${siteConfig.content.providers.owner}/${siteConfig.content.providers.repo}?path=${path.dirname(c.file)}/${c.frontmatter.image}&branch=${siteConfig.content.providers.branch}`
                        : null
                    }
                  />
                ))) : (
                null
              )}
            </Grid>
          </Container>

        </Box>
      </div>
    </ThemeProvider>
  )
}



