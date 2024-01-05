import React from "react";
import { siteConfig } from "../../site.config.js";
import { IndexView } from "@/components/layouts";
import { getMenuStructure, groupMenu, getFrontMatter } from "@/lib/content";
import { HeaderMinimalMenu } from '@/components/menus'
import { usePageMenu } from "@/lib/hooks";


export default function Page({ tiles, menuStructure: initialMenuStructure, collection, context, loading }) {

  if (loading) {
    return (
      <IndexView menuStructure={null} title="Providers and Services" tiles={null} menuComponent={HeaderMinimalMenu} initialContext={context} loading={true}/>
    )
  }
  const { menuStructure  } = usePageMenu(collection);

  return (
    <IndexView menuStructure={menuStructure} title="Providers and Services" tiles={tiles} menuComponent={HeaderMinimalMenu} initialContext={context} />
  );
}


export async function getServerSideProps(context) {
 
  const tiles = await getFrontMatter(siteConfig.content.providers);
  const menuPromise = getMenuStructure(
    siteConfig,
    siteConfig.content.providers
  );
  const menuStructure = await menuPromise;

  return {
    props: {
      menuStructure: menuStructure,
      tiles: tiles,
      collection: siteConfig.content.providers,
      context: siteConfig.content.services
    },
  };
}
