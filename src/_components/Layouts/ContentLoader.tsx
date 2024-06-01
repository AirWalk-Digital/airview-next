'use client';

import { MDXProvider } from '@mdx-js/react';
import { LinearProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import React from 'react';

import components from '@/components/Layouts/lib/mdxComponents';
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
    const { mdxContent: Page, frontmatter } = loadMDX(
      pageContent,
      context?.file?.endsWith('.md') ? 'md' : 'mdx',
    );
    return (
      <MDXProvider components={components}>
        {frontmatter?.title && <h1>{frontmatter.title}</h1>}
        {(Page && <Page />) || (
          <Alert variant="outlined" severity="error">
            No content.
          </Alert>
        )}
      </MDXProvider>
    );
  }
  return (
    <Alert variant="outlined" severity="error">
      No content.
    </Alert>
  );
}
