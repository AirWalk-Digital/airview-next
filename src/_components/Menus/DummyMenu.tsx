/* eslint-disable unused-imports/no-unused-vars */
import React from 'react';

import { NavigationDrawer } from '@/components/Menus/NavigationDrawer';
import type { MenuStructure } from '@/lib/Types';

interface MenuProps {
  menu: MenuStructure[];
  open: boolean;
  top: number;
  drawerWidth: number;
}
export default function DummyMenu({ menu, open, top, drawerWidth }: MenuProps) {
  menu.pop();
  return <NavigationDrawer open={open} top={top} drawerWidth={drawerWidth} />;
}
