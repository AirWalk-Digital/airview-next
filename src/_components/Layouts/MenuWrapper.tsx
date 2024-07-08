'use client';

import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { usePathname, useRouter } from 'next/navigation';
import React, { Suspense, useState } from 'react';

import TopBar from '@/components/Layouts/TopBar';
import {
  DummyMenu,
  HeaderMinimalMenu,
  MainButtonMenu,
} from '@/components/Menus';
import { getLogger } from '@/lib/Logger';
import type { ContentItem, MenuStructure } from '@/lib/Types';

const logger = getLogger();
logger.level = 'info';
// type MenuComponentType = typeof HeaderMinimalMenu; // | typeof HeaderMenu;

interface MenuWrapperProps {
  menuStructure?: MenuStructure[];
  context: ContentItem;
  loading: boolean;
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  isEditing?: boolean;
}

const menuComponent = (context: ContentItem) => {
  if (context && context.menu && context.menu.component) {
    switch (context.menu.component) {
      case 'DummyMenu':
        return DummyMenu;
      // case "FullHeaderMenu":
      //   return FullHeaderMenu;
      case 'HeaderMinimalMenu':
        return HeaderMinimalMenu;
      case 'MainButtonMenu':
        return MainButtonMenu;
      default:
        return MainButtonMenu;
    }
  } else {
    return DummyMenu;
  }
};

export default function MenuWrapper({
  menuStructure,
  context,
  loading,
  isEditing,
  children,
}: MenuWrapperProps): React.ReactElement {
  const navDrawerWidth = menuStructure ? 300 : 0;
  const topBarHeight = 65;
  const theme = useTheme();
  // Use useMediaQuery hook to check for screen width
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [menuOpen, setMenuOpen] = useState(
    menuComponent(context) !== DummyMenu && !isEditing && !isMobile
  );
  // const [isEditing, setIsEditing] = useState(false);

  const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState);
  const router = useRouter();
  const pathname = usePathname();

  const MenuComponent = menuComponent(context);

  const handleEdit = () => {
    const pathnameArray = pathname.split('/');

    if (pathnameArray[2] === 'edit') {
      // Replace 'edit' with 'view' in the URL path
      pathnameArray[2] = 'view';
      setMenuOpen(true);
    } else {
      // Replace 'view' with 'edit' in the URL path
      pathnameArray[2] = 'edit';
      setMenuOpen(false);
    }
    const newPathname = pathnameArray.join('/');
    router.push(newPathname);
  };

  const handleButtonClick = async (url: string) => {
    const pathnameArray = pathname.split('/');
    // pop the old path
    logger.info('handleButtonClick', { initialPath: pathnameArray, url });
    pathnameArray.splice(4);
    // join the 2 arrays
    pathnameArray.push(url);
    logger.info('handleButtonClick', { finalPath: pathnameArray });
    router.push(pathnameArray.join('/'));
  };
  // const handleEdit = () => {
  //   // const isEditing = Boolean(searchParams.get('edit'));
  //   const params = new URLSearchParams(searchParams);
  //   if (isEditing) {
  //     params.delete('edit');
  //     setMenuOpen(true);
  //     setIsEditing(false);
  //     router.push(
  //       pathname + (params.toString() ? `?${params.toString()}` : ''),
  //     );
  //   } else {
  //     params.set('edit', 'true');
  //     setMenuOpen(false);
  //     setIsEditing(true);
  //     router.push(
  //       pathname + (params.toString() ? `?${params.toString()}` : ''),
  //     );
  //   }
  // };

  // useEffect(() => {
  //   const editParam = searchParams.get('edit');
  //   if (editParam === 'true') {
  //     setIsEditing(true);
  //     setMenuOpen(false);
  //   } else {
  //     setIsEditing(false);
  //   }
  // }, [searchParams]);

  return (
    <>
      <TopBar
        onNavButtonClick={handleOnNavButtonClick}
        navOpen={isEditing ? false : menuOpen}
        menu
        logo
        edit
        handleEditFn={() => handleEdit()}
        // topBarHeight={topBarHeight}
      />

      {menuStructure && menuOpen && (
        <MenuComponent
          menu={menuStructure}
          handleButtonClick={handleButtonClick}
          open={menuOpen}
          top={topBarHeight}
          drawerWidth={navDrawerWidth}
        />
      )}
      <Suspense fallback={<p>Loading...</p>}>
        <div
          style={{
            marginTop: topBarHeight,
            paddingLeft: !menuOpen || loading ? 0 : navDrawerWidth,
          }}
        >
          {/* <Box sx={{ px: '2%' }} > */}
          <Container
            sx={{
              maxHeight: '100vh',
              maxWidth: '100% !important',
              pt: '2%',
              ml: 0,
              // pl: '0 !important',
              // pr: '0 !important',
            }}
          >
            {children && children}
          </Container>
          {/* </Box> */}
        </div>
      </Suspense>
    </>
  );
}
