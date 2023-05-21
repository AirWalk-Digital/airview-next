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
import { styled } from "@mui/material/styles";
import logo from '../public/logos/airwalk-logo.png';
const Logo = styled("img")({
    display: "block",
    width: "auto",
    height: 30,
  });

function Topbar({
    onNavButtonClick, navOpen, menu=false, back=false, topBarHeight=64 }) {

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
      <AppBar position="fixed" color="white" elevation={0}>
        <Toolbar>
        {menu &&  <><IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onNavButtonClick}
          >
            {navOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
          <Logo src={logo} alt="Airview" /></> }
        {back && <Link href="/" sx={{ textDecoration: 'none' }}>
            <ArrowBackIosNewOutlinedIcon color='text'/>
          </Link>}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          
          <Button color="inherit" endIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'light', textTransform: 'none' }} onClick={(event) => handleMenuOpen(event, 'content')} >Content</Button>
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
          <Button color="inherit" endIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'light', textTransform: 'none' }} onClick={(event) => handleMenuOpen(event, 'compliance')} >Compliance</Button>
          <Button color="inherit" endIcon={<ExpandMoreIcon />} sx={{ fontWeight: 'light', textTransform: 'none' }} onClick={(event) => handleMenuOpen(event, 'applications')} >Applications</Button>
  
        </Toolbar>
      </AppBar>
    );
  };

  export default Topbar;