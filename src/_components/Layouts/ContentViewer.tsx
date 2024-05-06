'use client';

import { MDXProvider } from '@mdx-js/react';
import { LinearProgress } from '@mui/material';
import React from 'react';

import { Contributors } from '@/components/Cards';
import { getLogger } from '@/lib/Logger';
import type { ContentItem } from '@/lib/Types';

import { loadMDX } from './lib/loadMDX';
// import { mdComponents } from '../../constants/mdxProvider.js';
const logger = getLogger().child({ namespace: 'ContentViewer' });

type Contributor = {
  authorName: string;
  authorDate: string;
};

interface ContentViewerProps {
  pageContent: string;
  contributors: Contributor[];
  context: ContentItem | undefined;
  loading: boolean;
}

function ContentSkeleton({ topBarHeight }: { topBarHeight: number }) {
  return (
    <div
      style={{
        marginTop: topBarHeight,
        paddingLeft: 0,
      }}
    >
      <LinearProgress />
    </div>
  );
}

export function ContentViewer({
  pageContent,
  contributors,
  context,
  loading,
}: ContentViewerProps) {
  const topBarHeight = 64;

  logger.info({
    msg: 'ContentViewer',
    pageContent,
    context,
    loading,
  });

  // const Content: React.FC = () => {
  //   if (context && context.file && context.file.endsWith('.etherpad')) {
  //     return (
  //       <></>
  //       // <Etherpad
  //       //   file={context.file}
  //       //   frontMatterCallback={frontMatterCallback}
  //       //   editMode={editMode}
  //       // />
  //     );
  //   }
  //   if (pageContent.content && pageContent.frontmatter) {
  //     const Page = pageContent.content;
  //     return <Page />;
  //   }
  //   return <h1>No content</h1>;
  // };

  if (loading) {
    return <ContentSkeleton topBarHeight={topBarHeight} />;
  }
  if (pageContent) {
    const { mdxContent: Page, frontmatter } = loadMDX(pageContent);

    return (
      // <div
      //   style={{
      //     marginTop: topBarHeight,
      //     paddingLeft: menuOpen ? navDrawerWidth : 0,
      //     // paddingLeft: (print || !menuOpen) ? 0 : navDrawerWidth,
      //   }}
      // >
      // <MDXProvider components={mdComponents(context)}>
      <MDXProvider>
        {(frontmatter?.title && <h1>{frontmatter.title}</h1>) || (
          <h1>No title</h1>
        )}
        {contributors && <Contributors contributors={contributors} />}
        {(Page && <Page />) || <h1>No content</h1>}
      </MDXProvider>
      // </div>
    );
  }
  return <h1>No content</h1>;
}
