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


function fileStructure(solutions, knowledge) {
  const solutionMenu = [];
  const designFiles = {};
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

      // Check if the key exists in the designFiles object
      if (!designFiles[directory]) {
        designFiles[directory] = [];
      }
      designFiles[directory].push({
        label: x.frontmatter.title,
        url: x.file,
      });
    }
  }
  return { solutionMenu, designFiles, knowledgeFiles: null};
}


export function IndexView({
  knowledge,
  solutions,
  designs
  // menu, // the menu from staticProps
  // children, // will be a page or nested layout
  // frontmatter = null, // frontmatter collected from the page and the mdx file
  // context = null, // the context from the page to help with relative files and links
  // pageData = null // controls for the menu
}) {

  // // // console.log('IndexView:menu: ', menu)

  // const navItems = [];
  // const { navItems, csp } = createMenu(services, providers);
  // // // console.log('IndexView:navItems: ', navItems)

  const { solutionMenu, designFiles, knowledgeFiles } = fileStructure(solutions)

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
        }}
      ><Box sx={{ px: '5%' }}>
          <Typography variant="h1" component="h1">Solutions</Typography>

          <Container maxWidth="lg" sx={{ height: '100vh', mt: '10%' }}>
            {/* <Grid container spacing={4} alignItems="stretch">
                {providers ? (
                  providers.map((c, i) => <Tile key={i} name={c?.frontmatter?.title} url={c?.file} image={`/api/content/${siteConfig.content.providers.owner}/${siteConfig.content.providers.repo}?path=${path.dirname(c?.file)}/${c?.frontmatter?.image}&branch=${siteConfig.content.providers.branch}`} simage={c?.frontmatter?.image} />)
                ) : (
                  null
                )}
              </Grid> */}
          </Container>

        </Box>
      </div>
    </ThemeProvider>
  )
}





function SolutionsMenu({ solutions, open, top, drawerWidth }) {
 

  return (
    <NavigationDrawer
      open={open}
      top={top}
      drawerWidth={drawerWidth}
    >
{solutions.map((c, i) =>  <Link key={i} href={c.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}><MenuItem sx={{ pl: '0', color: 'text.secondary'}}>
                {c.label}</MenuItem></Link>)}
    </NavigationDrawer>
  );
}

