'use client';

import { MDXProvider } from '@mdx-js/react';
import { LinearProgress } from '@mui/material';
import React from 'react';

import type { ContentItem } from '@/lib/Types';

import { loadMDX } from './lib/loadMDX';
// import { mdComponents } from '../../constants/mdxProvider.js';

interface ContentViewerProps {
  pageContent: string;
  context: ContentItem | undefined;
  loading: boolean;
}

function ContentSkeleton() {
  return (
    <div
      style={{
        marginTop: 64,
        paddingLeft: 0,
      }}
    >
      <LinearProgress />
      <h3>.....loading</h3>
    </div>
  );
}

export default function ContentLoader({
  pageContent,
  context,
  loading,
}: ContentViewerProps) {
  if (loading) {
    return <ContentSkeleton />;
  }
  if (pageContent && context) {
    const { mdxContent: Page, frontmatter } = loadMDX(pageContent);
    return (
      <MDXProvider>
        {(frontmatter?.title && <h1>{frontmatter.title}</h1>) || (
          <h1>No title</h1>
        )}
        {(Page && <Page />) || <h1>No content</h1>}
      </MDXProvider>
    );
  }
  return <h1>No content</h1>;
}
