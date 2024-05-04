'use client';

import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import React, { Suspense, useState } from 'react';

import TopBar from '@/components/Layouts/TopBar';
import { HeaderMinimalMenu } from '@/components/Menus';
import { getLogger } from '@/lib/Logger';
import type { MenuStructure } from '@/lib/Types';

const logger = getLogger();

// type MenuComponentType = typeof HeaderMinimalMenu; // | typeof HeaderMenu;

interface MenuWrapperProps {
  menuStructure?: MenuStructure[];
  menuComponent: string;
  // initialContext?: keyof typeof siteConfig.content;
  loading: boolean;
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

logger.info('Loading MenuWrapper');

export default function MenuWrapper({
  menuStructure,
  menuComponent,
  // initialContext,
  loading,
  children,
}: MenuWrapperProps): React.ReactElement {
  const navDrawerWidth = 300;
  const topBarHeight = 65;
  const [menuOpen, setMenuOpen] = useState(true);

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);

  const MenuComponent =
    menuComponent === 'HeaderMinimalMenu'
      ? HeaderMinimalMenu
      : HeaderMinimalMenu;

  return (
    <>
      <TopBar
        onNavButtonClick={handleOnNavButtonClick}
        navOpen={menuOpen}
        menu
        // topBarHeight={topBarHeight}
      />
      {menuStructure && (
        <MenuComponent
          menu={menuStructure}
          open={menuOpen}
          top={topBarHeight}
          drawerWidth={navDrawerWidth}
        />
      )}

      <div
        style={{
          marginTop: topBarHeight,
          paddingLeft: menuOpen || !loading ? navDrawerWidth : 0,
        }}
      >
        <Box sx={{ px: '2%' }}>
          <Container sx={{ maxHeight: '100vh', pt: '2%' }}>
            <Suspense fallback={<p>Loading...</p>}>
              {children && children}
            </Suspense>
            {/* probably should fix this to display a 404 or something if nothing is nested */}
          </Container>
        </Box>
      </div>
    </>
  );
}
