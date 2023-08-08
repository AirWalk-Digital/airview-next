import React from "react";
import { siteConfig } from "../../site.config.js";
import { IndexView } from "@/components/content";
import { getMenuStructure, getFrontMatter } from "@/lib/content";
import { HeaderMinimalMenu } from '@/components/dashboard/Menus'
import { usePageMenu } from "@/lib/hooks";


export default function Page({ tiles, menuStructure: initialMenuStructure, collection }) {

  const { menuStructure  } = usePageMenu(initialMenuStructure, collection);

  return (
    <IndexView menuStructure={menuStructure} title="Products" tiles={tiles} menuComponent={HeaderMinimalMenu} />
  );
}


export async function getServerSideProps(context) {
 
  const tiles = await getFrontMatter(siteConfig.content.products);
  const menuPromise = getMenuStructure(
    siteConfig,
    siteConfig.content.products
  );
  const menuStructure = await menuPromise;

  return {
    props: {
      menuStructure: menuStructure,
      tiles: tiles,
      collection: siteConfig.content.products,
    },
  };
}
