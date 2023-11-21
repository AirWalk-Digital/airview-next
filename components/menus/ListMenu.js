import React from 'react'
import { MenuItem, Skeleton } from '@mui/material';
import { NavigationDrawer } from '@/components/menus';
import Link from '@mui/material/Link';


export function ListMenu({ menu, open, top, drawerWidth }) {
  return (
    <NavigationDrawer open={open} top={top} drawerWidth={drawerWidth}>
      {menu ?
        menu.map((c, i) => (
          <Link key={i} href={c.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}>
            <MenuItem sx={{ pl: '0', color: 'text.secondary' }}>{c.label}</MenuItem>
          </Link>
        ))
        :
        <MenuSkeleton />
      }
    </NavigationDrawer>
  );
};

const MenuSkeleton = () => (
  <>
    {[...Array(10)].map((_, index) => (
      <Skeleton key={index} variant="rectangular" sx={{my: '4px'}}>
        <Link key={index} href={null} sx={{ textDecoration: 'none', color: 'text.secondary' }}>
          <MenuItem sx={{ pl: '0', color: 'text.secondary' }}>labsdsdsddsdsdsdsdsdss sdsdsds sdsdsdel</MenuItem>
        </Link>
      </Skeleton>
    ))}
  </>
);

