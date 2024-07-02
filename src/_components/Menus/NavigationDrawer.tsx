import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import React from 'react';

interface NavigationDrawerProps {
  open: boolean;
  top?: number;
  children?: ReactNode;
  drawerWidth?: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  top = 0,
  children,
  drawerWidth = 300,
}) => {
  return (
    <Box
      component='aside'
      sx={{
        display: open ? 'block' : 'none',
        position: 'fixed',
        top,
        bottom: 0,
        left: 0,
        width: drawerWidth,
        borderRight: 0,
        borderColor: 'grey.300',
        paddingY: '1%',
        paddingX: 3,
        boxSizing: 'border-box',
        backgroundColor: 'common.white',
        zIndex: 1200,
        overflowY: 'auto',
        displayPrint: 'none',
      }}
    >
      {children}
    </Box>
  );
};
