import React from 'react'
import { NavigationDrawer, Menu } from '@/components/menus';
import Link from '@mui/material/Link';


export function HeaderMinimalMenu({ menu, open, top, drawerWidth }) {

  // console.log('HeaderMinimalMenu:menu: ', menu)

  return (
    <NavigationDrawer
      open={open}
      top={top}
      drawerWidth={drawerWidth}
    >
      {menu &&
        menu.length > 0 &&
        menu.map((c) => (
          <React.Fragment key={c.label}>
            <Link href={c.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}>
              <h3 sx={{ pl: '0', color: 'text.secondary' }}>{c.label}</h3>
            </Link>
            {c.children && <L2Menu menu={c.children} />}
          </React.Fragment>
        ))}

    </NavigationDrawer>
  );
}


const L2Menu = ({ menu }) => {
  return (
    <>
      {menu && Object.entries(menu).map(([key, children]) => (
        <div key={key}>
          <Menu
            key={key}
            menuTitle={capitalizeFirstLetter(key)}
            menuItems={[{ links: children }]}
            initialCollapsed={true}
            loading={false}
            fetching={false}
            linkComponent={Link}
          />

          {/* 
          <h3 sx={{ pl: '0', color: 'text.secondary', textTransform: 'capitalize' }}>
            {key}
          </h3>
          {children && children.map((item, index) => (
            <Link key={index} href={item.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}>
              <MenuItem sx={{ pl: '0', color: 'text.secondary'}}>
                 {item.label}</MenuItem>
            </Link>
          ))} */}
        </div>
      ))}
    </>
  );
};

// {menu.map((c, i) =>  <Link key={i} href={c.url} sx={{ textDecoration: 'none', color: 'text.secondary' }}><MenuItem sx={{ pl: '0', color: 'text.secondary'}}>
//                 {c.label}</MenuItem></Link>)}


const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};