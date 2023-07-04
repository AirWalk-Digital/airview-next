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
import path from 'path';

import { siteConfig } from "../../site.config.js";

export function IndexView({
  tiles,
  menuStructure,
  title
}) {

  // console.log('IndexView:title: ', title)

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





function ContentMenu({ menu, open, top, drawerWidth }) {


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