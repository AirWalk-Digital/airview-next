import React from 'react'
import { NavigationDrawer } from '@/components/menus';


export function DummyMenu({ menu, open, top, drawerWidth }) {

  // console.log('HeaderMinimalMenu:menu: ', menu)

  return (
    <NavigationDrawer
      open={open}
      top={top}
      drawerWidth={drawerWidth}
    >
    </NavigationDrawer>
  );
}

