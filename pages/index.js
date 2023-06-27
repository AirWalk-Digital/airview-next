
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { ThemeProvider } from '@mui/material/styles';
import { baseTheme } from '@/constants/baseTheme';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Menu as MenuIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { siteConfig } from "../site.config.js";

import { TopBar } from '@/components/dashboard';
import { ScrollToTop } from '@/components/utils/ScrollToTop'
import {ScrollToBottom }from '@/components/utils/ScrollToBottom'

const SiteSection = ({ title, description, link }) => {

  return (
    <Grid item xs={3} md={3}>
      <Paper variant='outlined' sx={{ height: '100%', borderRadius: '16px', p: 3, display: 'flex', flexDirection: 'column' }}>

        <Typography variant="h5" component="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {description}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
          <Link href={link} sx={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="primary" sx={{ display: 'block', mt: '3%' }}>
              View
            </Button>
          </Link>
        </Box>
      </Paper>
    </Grid>
  )
}
const LandingPage = () => {
  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <TopBar logo={false}/>
      {/* Hero Section */}
      <section
        style={{
          marginTop: '50px',
          // // position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          // alignItems: 'center',
          justifyContent: 'flex-end',
          background: `url("/backgrounds/image17-bg.jpeg") no-repeat`,
          backgroundSize: 'auto 100%',
          backgroundPosition: 'right',
          backgroundAttachment: 'fixed',
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100vh' }}>
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} md={12} sx={{ mb: '20px' }}>
              <Typography variant="h2" component="h2" sx={{ fontWeight: 'bold', mt: '50px' }}>
                Airview
              </Typography>
              <Typography variant="h5" component="h5" gutterBottom>
                Documentation, Compliance and Control for Cloud.
              </Typography>
              <Button variant="contained" color="primary">
                Get Started
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={4} alignItems="stretch" sx={{ my: '0px' }}>

            {siteConfig.content.frameworks && <SiteSection title='Frameworks & Standards' description='View the compliance frameworks that guide your IT policy as well as standards to help adoption.' link='/frameworks' />}
            {siteConfig.content.services && <SiteSection title='Providers & Services' description='View the catalogue of Services available, complete with patterns, implementation guides and secuity controls.' link='/services' />}
            {siteConfig.content.applications && <SiteSection title='Applications' description='Browse the Applications within the Organisation' link='/applications' />}
            {siteConfig.content.customers && <SiteSection title='Customers & Projects' description="Customers and the projects we've done for them" link='/customers' />}

                     </Grid>
        </Container>
      </section>



      {/* Features Section */}
      <section
        style={{
          background: '#f5f5f5',
          display: 'flex'
        }}
      >
        <Container maxWidth="lg" sx={{ my: '20px' }} >
          <Grid container spacing={4} alignItems="center">

            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h3" gutterBottom>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
              <Typography variant="body1" gutterBottom>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim.
              </Typography>
              <Button variant="outlined" color="primary">
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </section>
        <ScrollToTop/>
        <ScrollToBottom/>
      {/* Other Sections */}
      {/* Add more sections with similar structure for the rest of the landing page content */}
    </ThemeProvider>
  );
};


export default LandingPage;

// const pageTitle = "Documentation View";

// const content = null;


// const navItems = [
//   {
//     groupTitle: "Menu Group Title One",
//     links: [
//       {
//         label: "Menu Item One",
//         url: "",
//       },
//       {
//         label: "Menu Item Two",
//         url: "",
//       },
//     ],
//   },
//   {
//     groupTitle: "Menu Group Title Two",
//     links: [
//       {
//         label: "Menu Item One",
//         url: "",
//       },
//       {
//         label: "Menu Item Two",
//         url: "",
//       },
//     ],
//   },
// ];

// const tocItems = [
//   {
//     groupTitle: null,
//     links: [
//       {
//         label: "Documentation View",
//         url: "#documentation-view",
//       },
//       {
//         label: "First Level Header",
//         url: "#first-level-header",
//       },
//       {
//         label: "Second Level Header",
//         url: "#second-level-header",
//       },
//       {
//         label: "Third Level Header",
//         url: "#third-level-header",
//       },
//       {
//         label: "Forth Level Header",
//         url: "#forth-level-header",
//       },
//       {
//         label: "Fifth Level Header",
//         url: "#fifth-level-header",
//       },
//       {
//         label: "Sixth Level Header",
//         url: "#sixth-level-header",
//       },
//     ],
//   },
// ];

// const breadcrumbItems = [{ label: "Home", url: "" }];
// const isError = false;
// const error = null;
// const isUninitialized = false;
// const isLoading = false;
// const isFetching = false;

// function DocumentationView() {
//   const navDrawerWidth = 300;
//   const topBarHeight = 64;
//   const [menuOpen, setMenuOpen] = useState(true);
//   const [searchOpen, setSearchOpen] = useState(false);

//   const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);

//   const handleOnQueryChange = async () => [];

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />


//       {/* <Search
//         open={searchOpen}
//         onRequestToClose={() => setSearchOpen(false)}
//         onQueryChange={handleOnQueryChange}
//         linkComponent="a"
//       /> */}
//       <TopBar
//         onNavButtonClick={handleOnNavButtonClick}
//         title="Airview"
//         navOpen={menuOpen}
//       >
//         {/* <Logo src={logo} alt="Logo alt text" /> */}
//         <IconButton
//           aria-label="search"
//           size="large"
//           edge="end"
//           sx={{ color: "common.white", marginLeft: "auto" }}
//           onClick={() => setSearchOpen(true)}
//         >
//           <SearchIcon />
//         </IconButton>
//       </TopBar>
//       {/* <NavigationDrawer
//         open={menuOpen}
//         top={topBarHeight}
//         drawerWidth={navDrawerWidth}
//       >
//         <Menu
//           menuTitle="Main Navigation"
//           menuItems={navItems}
//           initialCollapsed={false}
//           loading={isLoading}
//           fetching={isFetching}
//         />
//       </NavigationDrawer>
//       <div
//         style={{
//           marginTop: topBarHeight,
//           paddingLeft: menuOpen ? navDrawerWidth : 0,
//         }}
//       > */}
//       {/* <AsideAndMainContainer>
//           <Main>
//             <Breadcrumb
//               currentRoute={pageTitle}
//               loading={isLoading}
//               fetching={isFetching}
//               links={breadcrumbItems}
//               sx={{ marginBottom: 4 }}
//             />
//             <PageTitle
//               title="Documentation View"
//               loading={isLoading}
//               fetching={isFetching}
//             />
//             <StyledWysiwyg loading={isLoading} fetching={isFetching}>
//               {content} 
//             </StyledWysiwyg>
//           </Main>
//           <Aside>
//             <Menu
//               menuTitle="Table of Contents"
//               menuItems={tocItems}
//               initialCollapsed={false}
//               loading={isLoading}
//               fetching={isFetching}
//             />
//           </Aside>
//         </AsideAndMainContainer> 
//       </div> */}
//     </ThemeProvider>
//   );
// };