import React, { useState, useEffect, useRef } from 'react'

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
import { Menu, ButtonMenu, NavigationDrawer } from '@/components/airview-ui';
import { ControlTable } from '@/components/compliance/ControlTable';
import { ControlDataDisplay } from '@/components/compliance/ControlData';
import { useMdx } from '@/lib/content/mdx'
import Container from '@mui/material/Container';
import CloseIcon from '@mui/icons-material/Close';
import { PagedOutput } from '@/components/display/PagedOutput';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box } from '@mui/material';
import { Container as MuiContainer } from "@mui/material";

import {

  AsideAndMainContainer,
  Aside,
  Main,

} from '@/components/airview-ui';

import { Previewer } from 'pagedjs'

import { Tile } from '@/components/dashboard/Tiles'
import path from 'path';

import { siteConfig } from "../../site.config.js";

export function ServicesView({
  services,
  providers,
  children,
  frontmatter,
  controls
}) {

  // // console.log('IndexView:menu: ', menu)
  // console.log('ServicesView:services: ', services)
  // console.log('ServicesView:providers: ', providers)
  // console.log('ServicesView:frontmatter: ', frontmatter)
  // console.log('ServicesView:children: ', children)
  // const navItems = [];
  // const { navItems, csp } = createMenu(services, providers);
  // // console.log('IndexView:navItems: ', navItems)
  const mdxContainer = useRef(null);
  const previewContainer = useRef(null);

  const navDrawerWidth = 300;
  const topBarHeight = 64;
  const [menuOpen, setMenuOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [controlUrl, setControlUrl] = useState('');
  const [print, setPrint] = useState(false);

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);
  const handleControlClick = (url, label) => {
    // Show the dialog box
    setDialogOpen(true);
    const selectedControl = controls.find((control) => control.file === url);
    setControlUrl({ url, label, selectedControl });

  };
  const handleButtonClick = (url, label) => {
    // Update the state or perform any other desired actions with the URL
    // console.log("Clicked Label:", label);
    // Update the 'control' state in your page component
    console.log("Clicked Label:", label);
  };

  function handlePrint() {

    setPrint(!print);
    setMenuOpen(print);

    console.log('handlePrint:print: ', print)
  };

  const controlCoverage = createControlCoverage(controls);


  if (!print) {
    return (
      <ThemeProvider theme={baseTheme}>
        <CssBaseline />
        <TopBar onNavButtonClick={handleOnNavButtonClick}
          navOpen={menuOpen}
          menu={true}
          topBarHeight={topBarHeight} 
          handlePrint={handlePrint}
          />

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
            // paddingLeft: (print || !menuOpen) ? 0 : navDrawerWidth,

          }}
        >
          {frontmatter  && <ServicesHeader frontmatter={frontmatter} controlCoverage={controlCoverage} />}
          <AsideAndMainContainer>
            <Main>
                {children && children}
            </Main>
            <Aside sx={{ displayPrint: 'none', display: print ? 'none' : '' }}>
              <ButtonMenu
                menuTitle="Controls"
                menuItems={createControlMenu(controls)}
                initialCollapsed={false}
                loading={false}
                fetching={false}
                handleButtonClick={handleControlClick}
              />

            </Aside>
          </AsideAndMainContainer>
        </div>
        {/* Dialog box */}

        {controlUrl.selectedControl &&
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth={true} maxWidth={'lg'} sx={{
            "& .MuiDialog-container": {
              alignItems: "flex-start"
            }
          }}
            scroll='paper'>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4">{controlUrl.selectedControl?.data?.name} ({controlUrl.selectedControl?.data?.id || 'N/A'})</Typography>
              <IconButton edge="end" color="inherit" onClick={() => setDialogOpen(false)} aria-label="close">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            {/*         
        <DialogActions>
        <DialogTitle>{controlUrl.selectedControl?.data?.name}
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogTitle>
        </DialogActions> */}
            <DialogContent>

              <ControlDataDisplay data={controlUrl.selectedControl} />
            </DialogContent>

          </Dialog>
        }

      </ThemeProvider>
    )
  } else {
    return (
      <PagedOutput handlePrint={handlePrint} >
      <ThemeProvider theme={baseTheme}>
        <CssBaseline />
        <ServicesHeader frontmatter={frontmatter} controlCoverage={controlCoverage} />
        {children && children}
      </ThemeProvider>
      </PagedOutput>
    )
  }
}




function createControlCoverage(controls) {
  // console.log('createControlCoverage:controls: ', controls)

  let controlCountCovered = 0
  let controlCountUnCovered = 0
  let controlMethods = 0
  let controlCoverage = 0


  for (const control of controls) {
    if (control.data && control.data.methods && control.data.methods.length > 0) {
      controlMethods += control.data.methods.length
      controlCountCovered++
    } else {
      controlCountUnCovered++
    }
  }
  // calculate the percentage of covered controls vs controls
  controlCoverage = Math.round((controlCountCovered / controls.length) * 100)
  // console.log('createControlCoverage:controlCoverage: ', controlCoverage)
  return ({ controlCountCovered, controlCountUnCovered, controlMethods, controlCoverage, controlCount: controls.length })
};


function createControlMenu(controls) {
  console.log('createControlMenu:controls: ', controls)
  try {
    const links = controls.map((control) => {
      const label = control.data.name || control.data.id || ''; // Adjust the property name according to your control data structure
      const url = control.file;

      return {
        label,
        url,
      };
    });

    return [
      {
        links: links
      }];
  } catch (error) {
    // console.log('createControlMenu:error: ', error)

    return [
      {
        groupTitle: "Controls",
        links: [],
      }]
  }
};



function ServiceMenu({ services, providers, open, top, drawerWidth }) {

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
    result[provider].push({ label: obj.frontmatter.title, url: obj.file });
    return result;
  }, {});


  return (
    <NavigationDrawer
      open={open}
      top={top}
      drawerWidth={drawerWidth}
      sx={{ displayPrint: 'none' }}
    >
      {csp && csp.map((x, i) =>
        <Menu
          key={i}
          menuTitle={x.name}
          menuItems={[{ links: groupedData[x.path] }]}
          initialCollapsed={false}
          loading={false}
          fetching={false}
          linkComponent={Link}
        />
      )}
    </NavigationDrawer>
  );
}





function ServicesHeader({ frontmatter, controlCoverage }) {
  if (!frontmatter) { return <></> }
  // frontmatter = frontmatter.frontmatter
  console.log('ServicesHeader:controlCoverage: ', controlCoverage)
  // console.log('ServicesHeader:frontmatter: ', frontmatter)

  let icon = { color: 'success', icon: 'check' }

  if (controlCoverage && controlCoverage.controlCoverage < 50) {
    icon = { color: 'error', icon: 'circle-exclamation' }
  } else if (controlCoverage && controlCoverage.controlCoverage < 100) {
    icon = { color: 'warning', icon: 'triangle-exclamation' }
  } else if (!controlCoverage.controlCoverage) {
    icon = { color: 'info', icon: 'circle-exclamation' }
  }

  return (
    <MuiContainer maxWidth={false} sx={{ paddingTop: 0, paddingBottom: 0 }}>
    {/* <Box sx={{ display: "flex" }}>{children}</Box> */}
  
      {/* <Container sx={{ px: '0px', mb: '2%' }}> */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: '3%' }} component="servicesHeader">
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
            count={controlCoverage.controlCount}
            percentage={{ value: controlCoverage.controlCoverage ? controlCoverage.controlCoverage : '0', text: "% coverage" }}
            icon={icon}
          />
        </Grid>
      </Grid>
      {/* </Container> */}
      </MuiContainer>
  )
}
