import React from "react";
import { siteConfig } from "../../site.config.js";
import { IndexView } from "@/components/content";
import { getMenuStructure, getFrontMatter } from "@/lib/content";
import { ListMenu } from '@/components/dashboard/Menus'
import { usePageMenu } from "@/lib/hooks";


export default function Page({ tiles, menuStructure: initialMenuStructure, collection, loading }) {

  // console.debug('/solutions:loading: ', loading )

  if (loading) {
    return (
      <IndexView menuStructure={null} title="Solutions" tiles={null} menuComponent={ListMenu} loading={true}/>
    )
  }

  const { menuStructure } = usePageMenu(initialMenuStructure, collection);

  return (
    <IndexView menuStructure={menuStructure} title="Solutions" tiles={tiles} menuComponent={ListMenu} />
  );
}


export async function getServerSideProps(context) {

  const tiles = await getFrontMatter(siteConfig.content.solutions);
  const menuPromise = getMenuStructure(
    siteConfig,
    siteConfig.content.solutions
  );
  const menuStructure = await menuPromise;

  return {
    props: {
      menuStructure: menuStructure,
      tiles: tiles,
      collection: siteConfig.content.solutions,
    },
  };
}
