import React from "react";
import { siteConfig } from "../../site.config.js";
import { IndexView } from "@/components/layouts";
import { getMenuStructure, getFrontMatter } from "@/lib/content";
import { ListMenu } from '@/components/menus'
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

  
  const filteredTiles = tiles.filter(tile => {
    const parts = tile.file.split('/'); // Split the file path by '/'
    const fileName = parts[parts.length - 1]; // Get the last part (file name)
    // Check if the path has exactly 3 parts and the file name is 'index.md' or 'index.mdx'
    return parts.length === 3 && (fileName === '_index.md' || fileName === '_index.mdx');
  });

  const menuPromise = getMenuStructure(
    siteConfig,
    siteConfig.content.solutions
  );
  const menuStructure = await menuPromise;

  return {
    props: {
      menuStructure: menuStructure,
      tiles: filteredTiles,
      collection: siteConfig.content.solutions,
    },
  };
}
