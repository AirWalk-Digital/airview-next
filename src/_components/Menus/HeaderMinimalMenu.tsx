/* eslint-disable react/jsx-no-useless-fragment */
import Link from '@mui/material/Link';
import React from 'react';

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
}

interface L2MenuProps {
  menu: MenuItem[];
}

// const capitalizeFirstLetter = (string: string): string => {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// };

const L2Menu: React.FC<L2MenuProps> = ({ menu }) => {
  logger.info('L2Menu', menu);

  return <></>;
  // return (
  //   <>
  //     {menu &&
  //       Object.entries(menu).map(([key, children]) => (
  //         <div key={key}>
  //           <Menu
  //             key={key}
  //             menuTitle={capitalizeFirstLetter(key)}
  //             menuItems={children ? [children] : []}
  //             initialCollapsed
  //             loading={false}
  //             fetching={false}
  //             linkComponent={Link}
  //           />
  //         </div>
  //       ))}
  //   </>
  // );
};

export const HeaderMinimalMenu: React.FC<HeaderMinimalMenuProps> = ({
  menu,
  open,
  top,
  drawerWidth,
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
            {c.children && <L2Menu menu={c.children} />}
          </React.Fragment>
        ))}
    </NavigationDrawer>
  );
};
