'use client';

import Container from '@mui/material/Container';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

import TopBar from '@/components/Layouts/TopBar';
import { HeaderMinimalMenu } from '@/components/Menus';
import EditorWrapper from '@/features/Mdx/EditorWrapper';
import { getLogger } from '@/lib/Logger';
import type { ContentItem, MenuStructure } from '@/lib/Types';

const logger = getLogger();
logger.level = 'error';
// type MenuComponentType = typeof HeaderMinimalMenu; // | typeof HeaderMenu;

interface MenuWrapperProps {
  menuStructure?: MenuStructure[];
  menuComponent: string;
  context: ContentItem;
  loading: boolean;
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

logger.info('Loading MenuWrapper');

export default function MenuWrapper({
  menuStructure,
  menuComponent,
  context,
  loading,
  children,
}: MenuWrapperProps): React.ReactElement {
  const navDrawerWidth = menuStructure ? 300 : 0;
  const topBarHeight = 65;
  const searchParams = useSearchParams();
  // const isEditing = Boolean(searchParams.get('edit'));
  // logger.debug({ isEditing });

  const [menuOpen, setMenuOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);
  const router = useRouter();
  const pathname = usePathname();

  const MenuComponent =
    menuComponent === 'HeaderMinimalMenu'
      ? HeaderMinimalMenu
      : HeaderMinimalMenu;

  const handleEdit = () => {
    // const isEditing = Boolean(searchParams.get('edit'));
    const params = new URLSearchParams(searchParams);
    if (isEditing) {
      params.delete('edit');
      setMenuOpen(true);
      setIsEditing(false);
      router.push(
        pathname + (params.toString() ? `?${params.toString()}` : ''),
      );
    } else {
      params.set('edit', 'true');
      setMenuOpen(false);
      setIsEditing(true);
      router.push(
        pathname + (params.toString() ? `?${params.toString()}` : ''),
      );
    }
  };

  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (editParam === 'true') {
      setIsEditing(true);
      setMenuOpen(false);
    } else {
      setIsEditing(false);
    }
  }, [searchParams]);

  return (
    <>
      <TopBar
        onNavButtonClick={handleOnNavButtonClick}
        navOpen={isEditing ? false : menuOpen}
        menu
        logo
        edit
        handleEdit={() => handleEdit()}
        // topBarHeight={topBarHeight}
      />

      {menuStructure && menuOpen && (
        <MenuComponent
          menu={menuStructure}
          open={menuOpen}
          top={topBarHeight}
          drawerWidth={navDrawerWidth}
        />
      )}
      <Suspense fallback={<p>Loading...</p>}>
        {isEditing && (
          <div
            style={{
              marginTop: topBarHeight,
              paddingLeft: !menuOpen || loading ? 0 : navDrawerWidth,
            }}
          >
            <EditorWrapper context={context} />
          </div>
        )}
        {!isEditing && (
          <div
            style={{
              marginTop: topBarHeight,
              paddingLeft: !menuOpen || loading ? 0 : navDrawerWidth,
            }}
          >
            {/* <Box sx={{ px: '2%' }} > */}
            <Container sx={{ maxHeight: '100vh', pt: '2%', px: '2%' }}>
              {children && children}
            </Container>
            {/* </Box> */}
          </div>
        )}
      </Suspense>
    </>
  );
}
