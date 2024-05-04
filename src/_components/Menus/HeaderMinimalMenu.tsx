/* eslint-disable react/jsx-no-useless-fragment */
// import { Menu } from '@mui/material';
import Link from '@mui/material/Link';
import React from 'react';

import { Menu } from '@/components/Menus/Menu';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NavigationDrawer } from '@/components/Menus/NavigationDrawer';
import { getLogger } from '@/lib/Logger';
import type { MenuItem, MenuStructure } from '@/lib/Types';

const logger = getLogger().child({ namespace: 'HeaderMinimalMenu' });

export interface HeaderMinimalMenuProps {
  menu: MenuStructure[];
  open: boolean;
  top: number;
  drawerWidth: number;
  collapsible?: boolean;
  initialCollapsed?: boolean;
  currentRoute?: string;
  loading?: boolean;
}

interface L2MenuProps {
  menu: MenuItem[];
  collapsible?: boolean;
  initialCollapsed?: boolean;
  currentRoute?: string;
  loading?: boolean;
}

// const capitalizeFirstLetter = (string: string): string => {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// };

const L2Menu: React.FC<L2MenuProps> = ({
  menu,
  initialCollapsed,
  collapsible,
  currentRoute,
  loading,
}) => {
  logger.info('Menu', menu);

  return (
    <Menu
      // menuTitle={capitalizeFirstLetter(key)}
      menuTitle={menu[0]?.groupTitle || ''}
      menuItems={menu[0] ? [menu[0]] : []}
      initialCollapsed={menu[0]?.groupTitle ? initialCollapsed : false}
      collapsible={menu[0]?.groupTitle ? collapsible : false}
      loading={loading}
      fetching={false}
      linkComponent={Link}
      currentRoute={currentRoute}
    />
  );
};

export const HeaderMinimalMenu: React.FC<HeaderMinimalMenuProps> = ({
  menu,
  open,
  top,
  drawerWidth,
  collapsible = true,
  initialCollapsed = true,
  currentRoute,
  loading,
}) => {
  return (
    <NavigationDrawer open={open} top={top} drawerWidth={drawerWidth}>
      {menu &&
        menu.length > 0 &&
        menu.map((c) => (
          <React.Fragment key={c.label}>
            <Link
              href={c.url}
              sx={{ textDecoration: 'none', color: 'text.secondary' }}
            >
              <h3 style={{ paddingLeft: '0', color: 'text.secondary' }}>
                {c.label}
              </h3>
            </Link>
            {c.menuItems && (
              <L2Menu
                menu={c.menuItems}
                collapsible={collapsible}
                initialCollapsed={initialCollapsed}
                currentRoute={currentRoute}
                loading={loading}
              />
            )}
          </React.Fragment>
        ))}
    </NavigationDrawer>
  );
};
