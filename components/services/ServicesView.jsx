import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material';

import { ErrorBoundary } from 'react-error-boundary'
import { baseTheme } from '../../constants/baseTheme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { mdComponents } from "../../constants/mdxProvider";
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { Stack } from '@mui/material'
import { Chip } from '@mui/material'
import { TopBar } from '@/components/dashboard';
import { MiniStatisticsCard } from "@/components/dashboard";
import { MDXProvider } from '@mdx-js/react';
import { Menu, NavigationDrawer } from '../../components/airview-ui';
import { ControlTable } from '@/components/compliance/ControlTable';
import { useMdx } from '@/lib/content/mdx'
import Container from '@mui/material/Container';


import { Tile } from '@/components/dashboard/Tiles'
import path from 'path';

import { siteConfig } from "../../site.config.js";

export function ServicesView({
    services,
    providers,
    children,
    frontmatter
  }) {
  
    // // console.log('IndexView:menu: ', menu)
  // console.log('ServicesView:services: ', services)
  // console.log('ServicesView:providers: ', providers)
  // console.log('ServicesView:frontmatter: ', frontmatter)
  // console.log('ServicesView:children: ', children)
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
            {frontmatter && <ServicesHeader frontmatter={frontmatter} />}
            {children && children}
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



function ServiceMenu({services, providers, open, top, drawerWidth}) {

  let menu = [];
  let providerPaths = [];
  let csp = [];
  providers && providers.forEach((x, i) => {
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
  




function ServicesHeader(frontmatter) {
    if (!frontmatter) { return <></> }
    frontmatter = frontmatter.frontmatter
    // console.log('ServicesHeader:frontmatter: ', frontmatter)
    const iconcolor = 'primary';
    return (
      <>
        {/* <Container sx={{ px: '0px', mb: '2%' }}> */}
          <Grid container spacing={2} alignItems="center" sx={{mb:'3%'}}>
            <Grid item xs={8}>
              <Typography variant="h1" component="h1">{frontmatter.title}</Typography>
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
            </Grid>
            <Grid item xs={4}>
            <MiniStatisticsCard
                                  color="text.highlight"
                                  title="Controls"
                                  count="13"
                                  percentage={{ value: '55%', text: "coverage" }}
                                  icon={{ color: "success", icon: 'check' }}
                              />
            </Grid>
          </Grid>
        {/* </Container> */}
      </>
    )
  }
  