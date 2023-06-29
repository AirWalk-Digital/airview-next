import React, { useState } from "react";
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Menu as MenuIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from '@mui/icons-material/Print';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { styled } from "@mui/material/styles";
import { siteConfig } from "../../site.config.js";

// import logo from '../../public/logos/airwalk-logo.png';
const Logo = styled("img")({
    display: "block",
    width: "auto",
    height: 64,
  });

export function TopBar({
    onNavButtonClick, navOpen, menu=false, back=false, topBarHeight=64, logo=true, handlePrint, handlePresentation }) {

    const [anchorEl, setAnchorEl] = useState(null);
    const [activeMenu, setActiveMenu] = useState('');
  
    const handleMenuOpen = (event, id) => {
      setAnchorEl(event.currentTarget);
      setActiveMenu(id);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      setActiveMenu('');
    };
  


  
    return (
      <AppBar position="fixed" color="white" elevation={0} sx={{ displayPrint: 'none',borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          {/* has menu */}
        {menu &&  <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={onNavButtonClick}>{navOpen ? <CloseIcon /> : <MenuIcon />}</IconButton>}
          {logo && <Link href="/" sx={{ textDecoration: 'none' }}><Logo src='/logos/airwalk-logo.png' alt="Airview" /></Link>}
          {/* back button */}
          {back && <Link href="/" sx={{ textDecoration: 'none' }}><ArrowBackIosNewOutlinedIcon color='text'/></Link>} 
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>

          <Button color="inherit" endIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'light', textTransform: 'none', fontSize: '18pt'  }} onClick={(event) => handleMenuOpen(event, 'catalogue')} >Catalogue</Button>
          {(siteConfig.content.applications) && <Button color="inherit" endIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'light', textTransform: 'none', fontSize: '18pt' }} onClick={(event) => handleMenuOpen(event, 'applications')} >Applications</Button>}
          {(siteConfig.content.customers) && <Link color="inherit" href="/customers" sx={{ textDecoration: 'none' }}><Button color='inherit' sx={{ fontWeight: 'light', textTransform: 'none', fontSize: '18pt' }}>Customers</Button></Link>}
          <Link color="inherit" href="/etherpad" sx={{ textDecoration: 'none' }}><Button color='inherit' sx={{ fontWeight: 'light', textTransform: 'none', fontSize: '18pt' }}>Collaborate</Button></Link>
          <Menu
            id="menu-content"
            anchorEl={anchorEl}
            open={activeMenu === 'content'}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
          >
            <Link href="/etherpad" sx={{ textDecoration: 'none' }}>
              <MenuItem>
                Etherpads
              </MenuItem>
            </Link>
          </Menu>
          <Menu
            id="menu-catalogue"
            anchorEl={anchorEl}
            open={activeMenu === 'catalogue'}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
          >
            {(siteConfig.content.providers || siteConfig.content.services) && <Link href="/services" sx={{ textDecoration: 'none' }}>
              <MenuItem>
              Providers & Services
              </MenuItem>
            </Link>}
            {(siteConfig.content.frameworks) &&  <Link href="/frameworks" sx={{ textDecoration: 'none' }}>
              <MenuItem>
              Frameworks & Standards
              </MenuItem>
            </Link>}
            {(siteConfig.content.solutions) &&  <Link href="/solutions" sx={{ textDecoration: 'none' }}>
              <MenuItem>
              Solutions
              </MenuItem>
            </Link>}
            
          </Menu>
          <Menu
            id="menu-applications"
            anchorEl={anchorEl}
            open={activeMenu === 'applications'}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
          >
            <Link href="/applications" sx={{ textDecoration: 'none' }}>
              <MenuItem>
                Business Applications
              </MenuItem>
            </Link>
            <Link href="/business-units" sx={{ textDecoration: 'none' }}>
              <MenuItem>
                Business Units
              </MenuItem>
            </Link>
          </Menu>
          {handlePrint && <IconButton
                size="large"
                onClick={() => handlePrint()}
                color="inherit"
              >
                <PrintIcon />
              </IconButton>}
              {handlePresentation && <IconButton
                size="large"
                onClick={() => handlePresentation()}
                color="inherit"
              >
                <SlideshowIcon />
              </IconButton>}
        </Toolbar>
      </AppBar>
    );
  };

