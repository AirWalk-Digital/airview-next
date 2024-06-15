'use client';

import {
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import PrintIcon from '@mui/icons-material/Print';
// import SlideshowIcon from '@mui/icons-material/Slideshow';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React, { useState } from 'react';

import { siteConfig } from '../../../site.config';
// import logo from '../../public/logos/airwalk-logo.png';
const Logo = styled('img')({
  display: 'block',
  width: 'auto',
  height: 64,
});

export interface ComponentProps {
  onNavButtonClick?: () => void;
  navOpen: boolean;
  menu?: boolean;
  back?: boolean;
  // topBarHeight?: number;
  logo?: boolean;
  edit?: boolean;
  // handlePrint?: () => void;
  // handlePresentation?: () => void;
  handleEdit?: () => void;
}

export default function TopBar({
  onNavButtonClick,
  navOpen,
  menu,
  back,
  logo,
  edit,
  // handlePrint,
  // handlePresentation,
  handleEdit,
}: ComponentProps): React.ReactElement {
  // Function body

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [activeMenu, setActiveMenu] = useState('');

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: React.SetStateAction<string>,
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveMenu(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveMenu('');
  };

  const handleEditClick = () => {
    if (typeof handleEdit === 'function') {
      handleEdit();
    } else {
      // console.error('TopBar: Error: handleEdit is not a function');
    }
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{ displayPrint: 'none', borderBottom: 1, borderColor: 'grey.300' }}
    >
      <Toolbar>
        {/* has menu */}
        {menu && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onNavButtonClick}
          >
            {navOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        )}
        {logo && (
          <Link href="/" sx={{ textDecoration: 'none' }}>
            <Logo src="/logos/airwalk-logo.png" alt="Airview" />
          </Link>
        )}
        {/* back button */}
        {back && (
          <Link href="/" sx={{ textDecoration: 'none' }}>
            <ArrowBackIosNewOutlinedIcon color="inherit" />
          </Link>
        )}

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />

        <IconButton size="large" href="/search" color="inherit">
          <SearchIcon />
        </IconButton>

        <Button
          color="inherit"
          endIcon={<ExpandMoreIcon />}
          sx={{ fontWeight: 'light', textTransform: 'none', fontSize: '18pt' }}
          onClick={(event) => handleMenuOpen(event, 'catalogue')}
        >
          Catalogue
        </Button>
        {siteConfig.content?.applications && (
          <Button
            color="inherit"
            endIcon={<ExpandMoreIcon />}
            sx={{
              fontWeight: 'light',
              textTransform: 'none',
              fontSize: '18pt',
            }}
            onClick={(event) => handleMenuOpen(event, 'applications')}
          >
            Applications
          </Button>
        )}
        {siteConfig.content?.customers && (
          <Link
            color="inherit"
            href="/docs/view/default/customers"
            sx={{ textDecoration: 'none' }}
          >
            <Button
              color="inherit"
              sx={{
                fontWeight: 'light',
                textTransform: 'none',
                fontSize: '18pt',
              }}
            >
              Customers
            </Button>
          </Link>
        )}
        {/* <Link color="inherit" href="/etherpad" sx={{ textDecoration: 'none' }}><Button color='inherit' sx={{ fontWeight: 'light', textTransform: 'none', fontSize: '18pt' }}>Collaborate</Button></Link> */}
        <Menu
          id="menu-content"
          anchorEl={anchorEl}
          open={activeMenu === 'content'}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
        >
          <Link href="/etherpad" sx={{ textDecoration: 'none' }}>
            <MenuItem>Etherpads</MenuItem>
          </Link>
        </Menu>
        <Menu
          id="menu-catalogue"
          anchorEl={anchorEl}
          open={activeMenu === 'catalogue'}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
        >
          {(siteConfig.content.providers || siteConfig.content.services) && (
            <Link
              href="/docs/view/default/providers"
              sx={{ textDecoration: 'none' }}
            >
              <MenuItem>Providers & Services</MenuItem>
            </Link>
          )}
          {siteConfig.content?.frameworks && (
            <Link
              href="/docs/view/default/frameworks"
              sx={{ textDecoration: 'none' }}
            >
              <MenuItem>Frameworks & Standards</MenuItem>
            </Link>
          )}
          {siteConfig.content.solutions && (
            <Link
              href="/docs/view/default/solutions"
              sx={{ textDecoration: 'none' }}
            >
              <MenuItem>Solutions</MenuItem>
            </Link>
          )}
          {siteConfig.content.products && (
            <Link
              href="/docs/view/default/products"
              sx={{ textDecoration: 'none' }}
            >
              <MenuItem>Products</MenuItem>
            </Link>
          )}
        </Menu>
        <Menu
          id="menu-applications"
          anchorEl={anchorEl}
          open={activeMenu === 'applications'}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
        >
          <Link href="/applications" sx={{ textDecoration: 'none' }}>
            <MenuItem>Business Applications</MenuItem>
          </Link>
          <Link href="/business-units" sx={{ textDecoration: 'none' }}>
            <MenuItem>Business Units</MenuItem>
          </Link>
        </Menu>

        {edit && (
          <Button
            size="large"
            onClick={() => handleEditClick()}
            color="inherit"
            startIcon={<AutoAwesomeIcon />}
          >
            Edit
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
