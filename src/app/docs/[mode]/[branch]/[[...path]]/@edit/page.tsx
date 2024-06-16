import type { Metadata } from 'next';

import React, { Suspense } from 'react';
import { TopBar } from '@/components/Layouts';
import { siteConfig } from '@/config';
import { notFound } from 'next/navigation';
import { getLogger } from '@/lib/Logger';
import type { ContentItem } from '@/lib/Types';
import EditorWrapper from '@/features/Mdx/EditorWrapper';

const logger = getLogger().child({ namespace: 'docs/page/@edit' });
logger.level = 'info';
export const metadata: Metadata = {
  title: 'Airview',
  description: 'Airview AI',
};

export default async function Page({
  params,
}: {
  params: { path?: string[] };
}) {
  const topBarHeight = 65;
  if (
    params.path &&
    params.path[0] &&
    siteConfig.content[params.path[0] as keyof typeof siteConfig.content]
  ) {
    let path = params.path;
    let file = '';
    // if 'related_config' is somewhere in the path, then the file is the last element in the path
    if (path.includes('related_content')) {
      // join all the parts after related_config
      file = path
        .slice(path.indexOf('related_content') + 1)
        .join('/') as string;
    } else {
      file = path.join('/') as string;
    }

    const contentKey = params.path[0] as keyof typeof siteConfig.content;
    const contentConfig = {
      ...siteConfig?.content?.[contentKey],
      file: file,
    } as ContentItem;

    return (
      <main>
        <TopBar
          // onNavButtonClick={handleOnNavButtonClick}
          navOpen={false}
          menu={false}
          logo
          edit
          // topBarHeight={topBarHeight}
        />
        <Suspense fallback={<p>Loading...</p>}>
          <div
            style={{
              marginTop: topBarHeight,
              paddingLeft: 0,
            }}
          >
            <EditorWrapper context={contentConfig} />
          </div>
        </Suspense>
      </main>
    );

    // return (
    //   <main>
    //     <MenuWrapper
    //       menuStructure={menuStructure}
    //       loading={loading}
    //       context={contentConfig}
    //       isEditing
    //     >
    //       <ContentViewer
    //         pageContent={pageContentText}
    //         contributors={pageContent.contributors}
    //         context={context}
    //         loading={loading}
    //         relatedContent={content.relatedContent}
    //       />
    //     </MenuWrapper>
    //   </main>
    // );
  } else {
    logger.info('Page content not found');
    return notFound();
  }
}
