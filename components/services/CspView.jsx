
import React, { useState, useEffect } from 'react'
import { VFile } from 'vfile'
import { VFileMessage } from 'vfile-message'
import * as provider from '@mdx-js/react'
import * as runtime from 'react/jsx-runtime'
// import {statistics} from 'vfile-statistics'
// import {reporter} from 'vfile-reporter'
import { evaluate } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkUnwrapImages from 'remark-unwrap-images';
import { Box, Typography } from '@mui/material';
// import remarkMath from 'remark-math'
import { ErrorBoundary } from 'react-error-boundary'
import { useDebounceFn } from 'ahooks'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { baseTheme } from '../../constants/baseTheme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { mdComponents } from "../../constants/mdxProvider";
import * as matter from 'gray-matter';
import { parse } from 'toml';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { Stack } from '@mui/material'
import { Chip } from '@mui/material'
import { TopBar } from '@/components/dashboard';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MiniStatisticsCard } from "@/components/dashboard";
import { ControlDataDisplay } from '@/components/compliance/ControlData';
import { MDXProvider } from '@mdx-js/react';

import { Menu, NavigationDrawer } from '../../components/airview-ui';
import { getAllFiles, getFileContent } from '../../backend/filesystem';
import { ControlTable } from '@/components/compliance/ControlTable';

import { Tile, ServiceTile } from '@/components/dashboard/Tiles'
import { useMdx } from '@/lib/content/mdx'


export function CspView({
    menu, // the menu from staticProps
    children, // will be a page or nested layout
    content = null, // the context from the page to help with relative files and links
    frontmatter = null,
    pageData = null // controls for the menu
  }) {
  
    // // // console.log('IndexView:menu: ', menu)
  
    // // // console.log('IndexView:content: ', content)
  
    // // // console.log('IndexView:frontmatter: ', frontmatter)
  
    const approvedServices = menu.filter(obj => obj.frontmatter.status === 'approved');
    const unapprovedServices = menu.filter(obj => obj.frontmatter.status !== 'approved');
  
    // // console.log('CSPView:approvedServices: ', approvedServices)
  
  
    const navItemsApproved = createMenuLinks(approvedServices);
    const navItemsUnapproved = createMenuLinks(unapprovedServices);
  
    // // console.log('CSPView:navItemsApproved: ', navItemsApproved)
  
  
    const serviceMenu = [
      {
        groupTitle: "Approved Services",
        links: navItemsApproved
      },
      {
        groupTitle: "Available Services",
        links: navItemsUnapproved
      }
    ]
  
  
    // // // console.log('IndexView:navItems: ', navItems)
    // let tiles = [];
    // if (frontmatter && frontmatter.title) { tiles = navItems.filter(item => item.groupTitle === frontmatter.title)[0].links; }
    // tiles = navItems.filter(item => item.groupTitle === "Microsoft Azure")[0].links;
    // // // console.log('IndexView:tiles: ', tiles)
  
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
        <NavigationDrawer
          open={menuOpen}
          top={topBarHeight}
          drawerWidth={navDrawerWidth}
        >
          <Menu
            menuTitle="Services"
            menuItems={serviceMenu}
            initialCollapsed={false}
            loading={false}
            fetching={false}
          />
        </NavigationDrawer>
        <div
          style={{
            marginTop: topBarHeight,
            paddingLeft: menuOpen ? navDrawerWidth : 0,
          }}
        ><Box sx={{ px: '5%' }}>
            {frontmatter && frontmatter.title && <Typography variant="h1" component="h1">{frontmatter.title} Services</Typography>}
  
            <Container maxWidth="lg" sx={{ mt: '3%' }}>
              <Grid container spacing={4} alignItems="stretch">
                {approvedServices ? (
                  approvedServices.map((c, i) => <ServiceTile key={i} frontmatter={c.frontmatter} file={c.file} />)
                ) : (
                  null
                )}
              </Grid>
            </Container>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Unapproved Services</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={4} alignItems="stretch">
                  {unapprovedServices ? (
                    unapprovedServices.map((c, i) => <ServiceTile key={i} frontmatter={c.frontmatter} file={c.file} />)
                  ) : (
                    null
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
  
          </Box>
        </div>
      </ThemeProvider>
    )
  }
  