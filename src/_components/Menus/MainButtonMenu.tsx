/* eslint-disable react/jsx-no-useless-fragment */
// import { Menu } from '@mui/material';
import { Skeleton } from '@mui/material';
// import Link from 'next/link';
// import Link from 'next/link';
import React from 'react';

import { ButtonMenu } from '@/components/Menus/ButtonMenu';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NavigationDrawer } from '@/components/Menus/NavigationDrawer';
import { getLogger } from '@/lib/Logger';
import type { MenuStructure } from '@/lib/Types';

const logger = getLogger().child({ namespace: 'MainButtonMenu' });
logger.level = 'error';

export interface MainButtonMenuProps {
  menu: MenuStructure[];
  open: boolean;
  top: number;
  drawerWidth: number;
  handleButtonClick: (url: string, label: string) => void;
  collapsible?: boolean;
  initialCollapsed?: boolean;
  currentRoute?: string;
  loading?: boolean;
}

export const MainButtonMenu: React.FC<MainButtonMenuProps> = ({
  menu,
  open,
  top,
  drawerWidth,
  handleButtonClick,
  collapsible = true,
  initialCollapsed = true,
  currentRoute,
  loading,
}) => {
  const menuWithLoader = () => {
    if (loading) {
      return [...Array(6)].map((index) => (
        <Skeleton key={`skeleton-${index}`} component='li' />
      ));
    }
    return (
      menu &&
      menu.length > 0 &&
      menu.map((c) => (
        <React.Fragment key={c.label}>
          <ButtonMenu
            menuTitle={c.label}
            url={c.url}
            menuItems={c.menuItems}
            collapsible={collapsible}
            initialCollapsed={initialCollapsed}
            handleButtonClick={handleButtonClick}
            currentRoute={currentRoute}
          />
        </React.Fragment>
      ))
    );
  };

  return (
    <NavigationDrawer open={open} top={top} drawerWidth={drawerWidth}>
      {menuWithLoader()}
    </NavigationDrawer>
  );
};
