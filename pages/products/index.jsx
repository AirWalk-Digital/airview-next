import React from "react";
import { siteConfig } from "../../site.config.js";
import { IndexView } from "@/components/content";
import { getMenuStructure, groupMenu, getFrontMatter } from "@/lib/content";
import { HeaderMinimalMenu } from '@/components/dashboard/Menus'


export default function Page({ tiles, menuStructure }) {
  return (
    <IndexView menuStructure={menuStructure} title="Products" tiles={tiles} menuComponent={HeaderMinimalMenu} />
  );
}


export async function getServerSideProps(context) {
  // export async function getServerSideProps(context) {
  // construct menu structure

  const tiles = await getFrontMatter(siteConfig.content.products);
  const menuPromise = getMenuStructure(
    siteConfig,
    siteConfig.content.products
  );
  const menuStructure = await menuPromise;
  const groupedMenu = groupMenu(menuStructure);

  return {
    props: {
      menuStructure: groupedMenu,
      tiles: tiles,
    },
  };
}
