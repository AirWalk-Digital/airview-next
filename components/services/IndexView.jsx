import React, { useState } from 'react'
import { Box, Typography } from '@mui/material';
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
    services,
    providers,
    // menu, // the menu from staticProps
    // children, // will be a page or nested layout
    // frontmatter = null, // frontmatter collected from the page and the mdx file
    // context = null, // the context from the page to help with relative files and links
    // pageData = null // controls for the menu
  }) {
  
    // // console.log('IndexView:menu: ', menu)
  
    // const navItems = [];
    // const { navItems, csp } = createMenu(services, providers);
    // // console.log('IndexView:navItems: ', navItems)
  
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
       
          <ServiceMenu
            services={services}
            providers={providers}
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
            <Typography variant="h1" component="h1">Providers and Services</Typography>
  
            <Container maxWidth="lg" sx={{ height: '100vh', mt: '10%' }}>
              <Grid container spacing={4} alignItems="stretch">
                {providers ? (
                  providers.map((c, i) => <Tile key={i} name={c?.frontmatter?.title} url={c?.file} image={`/api/content/${siteConfig.content.providers.owner}/${siteConfig.content.providers.repo}?path=${path.dirname(c?.file)}/${c?.frontmatter?.image}&branch=${siteConfig.content.providers.branch}`} simage={c?.frontmatter?.image} />)
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
  


function createMenu2(menu) {
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



function ServiceMenu({services,providers, open, top, drawerWidth}) {

  let menu = [];
  let providerPaths = [];
  let csp = [];
  providers.forEach((x, i) => {
    if (x.frontmatter) {
      providerPaths.push(path.dirname(x?.file))
      csp.push({ name: x.frontmatter?.title, path: path.dirname(x?.file), image: x?.frontmatter?.image })
    }
  });


  const groupedData = services.reduce((result, obj) => {
    const provider = obj.frontmatter.provider;
    if (!provider) {
      return result;
    }
    if (!result[provider]) {
      result[provider] = [];
    }
    result[provider].push({label: obj.frontmatter.title, url: obj.file});
    return result;
  }, {});

  // services.forEach((x, i) => {
  //   if (x.frontmatter && x.frontmatter.provider) {
  //     providerPaths.indexOf(x.frontmatter.provider)['services'].push({ name: x.frontmatter?.title, path: x?.file });
  //   } 
  // });

  // console.log('ServiceMenu:groupedData: ', groupedData)
  // console.log('ServiceMenu:csp: ', csp)

  return (      
    <NavigationDrawer
    open={open}
    top={top}
    drawerWidth={drawerWidth}
  >
    {csp && csp.map((x, i) =>
      <Menu
            key={i}
            menuTitle={x.name}
            menuItems={[{links: groupedData[x.path]}]}
            initialCollapsed={false}
            loading={false}
            fetching={false}
            linkComponent={Link}
          />
    )}
</NavigationDrawer>
  );
  }
  
