import React from "react";
import { siteConfig } from "../../site.config.js";
import { IndexView } from "@/components/content";
import { getMenuStructure, groupMenu, getFrontMatter } from "@/lib/content";
import { HeaderMinimalMenu } from '@/components/dashboard/Menus'
import { usePageMenu } from "@/lib/hooks";


export default function Page({ tiles, menuStructure: initialMenuStructure, collection }) {

  const { menuStructure  } = usePageMenu(initialMenuStructure, collection);

  return (
    <IndexView menuStructure={menuStructure} title="Providers and Services" tiles={tiles} menuComponent={HeaderMinimalMenu} />
  );
}


export async function getServerSideProps(context) {
  // export async function getServerSideProps(context) {
  // construct menu structure

  const tiles = await getFrontMatter(siteConfig.content.providers);
  const menuPromise = getMenuStructure(
    siteConfig,
    siteConfig.content.providers
  );
  const menuStructure = await menuPromise;
  const groupedMenu = groupMenu(menuStructure);

  return {
    props: {
      menuStructure: groupedMenu,
      tiles: tiles,
      collection: siteConfig.content.providers
    },
  };
}
