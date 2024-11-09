// import type { Metadata } from 'next'
import { Metadata } from 'next';

import React from 'react';
import { IndexTiles, MenuWrapper } from '@/components/Layouts';
import { siteConfig } from '../../../../../../../site.config';
import { notFound } from 'next/navigation';
import { getLogger } from '@/lib/Logger';
import type { ContentItem } from '@/lib/Types';
// import { loadMenu, nestMenu } from '@/lib/Content/loadMenu';
import { menuStructure } from '@/lib/Menu';

const logger = getLogger().child({ namespace: 'docs/page' });
logger.level = 'debug';

export async function generateMetadata({
  params,
}: {
  params: { mode: 'view' | 'edit' | 'print'; branch: string; path: string[] };
}): Promise<Metadata> {
  // read route params
  if (
    params.path[0] &&
    siteConfig.content[params.path[0] as keyof typeof siteConfig.content]
  ) {
    const file = params.path.join('/') as string;
    const contentKey = params.path[0] as keyof typeof siteConfig.content;
    const contentConfig = {
      ...siteConfig?.content?.[contentKey],
      file: file,
    } as ContentItem;
    return {
      title: `${contentConfig?.path?.charAt(0).toUpperCase()}${contentConfig?.path?.slice(1)}`,
    };
  } else {
    return {
      title: 'Not Found',
    };
  }
}

export default async function Page({
  params,
}: {
  params: { mode: 'view' | 'edit' | 'print'; branch: string; path: string[] };
}) {
  if (
    params.path[0] &&
    siteConfig.content[params.path[0] as keyof typeof siteConfig.content]
  ) {
    const file = params.path.join('/') as string;
    let loading = false;
    const contentKey = params.path[0] as keyof typeof siteConfig.content;
    // if params.branch is default return the branch from siteConfig, else return the params.branch
    const branch = () =>
      params.branch === 'default'
        ? siteConfig?.content?.[contentKey]?.branch
        : decodeURIComponent(params.branch);
    const contentConfig = {
      ...siteConfig?.content?.[contentKey],
      file: file,
      branch: branch(),
    } as ContentItem;

    const menuConfig = (contentConfig: ContentItem) => {
      if (contentConfig.menu && contentConfig.menu.collection) {
        return (
          siteConfig?.content?.[
            contentConfig?.menu?.collection as keyof typeof siteConfig.content
          ] || (contentConfig as ContentItem)
        );
      } else {
        return contentConfig;
      }
    };
    const contentParams = menuConfig(contentConfig);

    logger.debug({
      page: 'index',
      msg: 'contentParams: ',
      contentParams,
      path: params.path[0],
    });
    // const content = await loadMenu(siteConfig, menuConfig(contentConfig));
    // const { menu: menuStructure } = nestMenu(content);
    const menu = await menuStructure(
      contentParams.menu?.scope ? contentParams.menu?.scope : params.path[0],
      contentParams.menu?.collection as string
    );

    logger.debug({ page: 'index', msg: 'menu: ', menu });
    return (
      <main>
        <MenuWrapper
          menuStructure={menu}
          loading={loading}
          context={contentConfig}
        >
          {contentConfig ? (
            <IndexTiles initialContext={{ ...contentConfig, source: '' }} />
          ) : (
            <></>
          )}
        </MenuWrapper>
      </main>
    );
  } else {
    return notFound();
  }
}
