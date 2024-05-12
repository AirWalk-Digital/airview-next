'use server';

/* eslint-disable no-nested-ternary */
import { Box, Grid, LinearProgress } from '@mui/material';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';
import path from 'path';
import React from 'react';

import { TileCard } from '@/components/Cards';
import { getLogger } from '@/lib/Logger';
import type { ContentItem } from '@/lib/Types';

// import type { HeaderMinimalMenuProps } from '@/components/Menus/HeaderMinimalMenu';
// import type { siteConfig } from '../../../site.config';
import { getTiles } from './lib/getTiles';

// interface Tile {
//   frontmatter: {
//     title: string;
//     hero: boolean;
//     image?: string;
//   };
//   file: string;
// }
const logger = getLogger().child({ namespace: 'IndexTiles' });
// interface MenuStructure {
//   label: string;
//   url: string;
//   children?: MenuStructure[];
// }

// interface MenuStructure {
//   primary?: any;
// }

// type MenuComponentType = typeof HeaderMinimalMenu; // | typeof HeaderMenu;

// interface IndexTilesProps {
//   // tiles: Tile[];
//   // title: string;
//   // menuStructure?: MenuComponentType;
//   // menuComponent: string;
//   initialContext?: keyof typeof siteConfig.content;
//   // loading: boolean;
// }

function LinearIndeterminate() {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
}

// type FetchTilesProps = {
//   initialContext: keyof typeof siteConfig.content;
// };
// async function fetchTiles(initialContext: ContentItem) {
//   const { loading, tiles, error } = await getTiles(initialContext);
//   return { loading, tiles, error };
// }

export default async function IndexTiles({
  initialContext,
}: {
  initialContext: ContentItem;
}): Promise<React.ReactElement> {
  // const navDrawerWidth = 300;
  // const topBarHeight = 65;

  logger.debug({ ...initialContext, msg: 'initialContext' });

  const { loading, tiles } = await getTiles(initialContext);
  // logger.debug({ loading, tiles, error, msg: 'loaded tiles..' });
  // const loading = true;
  // const tiles = [];

  // const MenuComponent =
  //   menuComponent === 'HeaderMinimalMenu' ? HeaderMinimalMenu : null;

  if (loading || !tiles) {
    return (
      // <div style={{ marginTop: topBarHeight }}>
      // <Box sx={{ marginTop: topBarHeight }}>
      <Box>
        <LinearIndeterminate />
      </Box>
      // </div>
    );
  }

  return (
    <Grid container spacing={2}>
      {tiles ? (
        tiles.map((c) => (
          <TileCard
            key={c?.frontmatter?.title}
            name={c?.frontmatter?.title}
            url={c?.file?.path}
            isHero={c?.frontmatter?.hero}
            image={
              c?.frontmatter?.hero && c?.frontmatter?.image != null
                ? `/api/content/github/${initialContext.owner}/${initialContext.repo}?path=${path.dirname(c.file.path)}/${c.frontmatter.image}&branch=${initialContext.branch}`
                : c?.frontmatter?.hero
                  ? '/generic-solution.png'
                  : c?.frontmatter?.image
                    ? `/api/content/github/${initialContext.owner}/${initialContext.repo}?path=${path.dirname(c.file.path)}/${c.frontmatter.image}&branch=${initialContext.branch}`
                    : undefined
            }
          />
        ))
      ) : (
        <div>...loading</div>
      )}
    </Grid>
  );
}
