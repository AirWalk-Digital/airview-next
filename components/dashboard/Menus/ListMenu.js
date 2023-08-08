import React from 'react'
import { MenuItem } from '@mui/material';
import { NavigationDrawer } from '@/components/airview-ui';
import Link from '@mui/material/Link';


export function ListMenu({ menu, open, top, drawerWidth }) {

  return (
    <NavigationDrawer
      open={open}
      top={top}
      drawerWidth={drawerWidth}
    >
      {menu.map((c, i) => <Link key={i} href={c.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}><MenuItem sx={{ pl: '0', color: 'text.secondary' }}>
        {c.label}</MenuItem></Link>)}
    </NavigationDrawer>
  );
};


