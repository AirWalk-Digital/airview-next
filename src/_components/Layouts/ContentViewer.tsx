'use client';

import { MDXProvider } from '@mdx-js/react';
import GitHubIcon from '@mui/icons-material/GitHub';
import PrintIcon from '@mui/icons-material/Print';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { LinearProgress } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { Contributors } from '@/components/Cards';
import {
  Aside,
  AsideAndMainContainer,
  Main,
} from '@/components/Layouts/AsideAndMain';
import { getLogger } from '@/lib/Logger';
import type { ContentItem } from '@/lib/Types';

import { TableOfContents } from '../Menus/TableOfContents';
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
      <h3>.....loading</h3>
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
  const router = useRouter();
  const currentPath = usePathname();

  function openGithub() {
    // example url: https://github.com/mdx-js/mdx/blob/main/changelog.md
    if (
      context &&
      context.owner &&
      context.repo &&
      context.branch &&
      context.file
    ) {
      window.open(
        `https://github.com/${context?.owner}/${context?.repo}/blob/${context?.branch}/${context.file}`,
        '_blank',
      );
    }
  }

  function openPrint() {
    router.push(`${currentPath}/print`);
  }

  if (loading) {
    return <ContentSkeleton topBarHeight={topBarHeight} />;
  }
  if (pageContent) {
    const { mdxContent: Page, frontmatter } = loadMDX(pageContent);
    logger.info({ msg: 'ContentViewer', frontmatter });
    return (
      <AsideAndMainContainer>
        <Main>
          <MDXProvider>
            {(frontmatter?.title && <h1>{frontmatter.title}</h1>) || (
              <h1>No title</h1>
            )}
            {contributors && <Contributors contributors={contributors} />}
            {(Page && <Page />) || <h1>No content</h1>}
          </MDXProvider>
        </Main>
        <Aside>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              size="small"
              color="primary"
              icon={<PrintIcon />}
              label="Print"
              onClick={() => openPrint()}
            />
            <Chip
              size="small"
              color="primary"
              icon={<GitHubIcon />}
              label="Code"
              onClick={() => openGithub()}
            />
            <Chip
              size="small"
              color="primary"
              icon={<SlideshowIcon />}
              label="Presentation"
            />
          </Stack>

          {/* <ContentMenu
                  content={relatedContent}
                  context={context}
                  // knowledge={knowledge}
                  // designs={designs}
                  handleContentChange={handleContentChange}
                  handlePageReset={handlePageReset}
                  file={context.file}
                />
                {sideComponent && <SideComponent />} */}
          {frontmatter?.tableOfContents && (
            <TableOfContents tableOfContents={frontmatter.tableOfContents} />
          )}

          {/* <ButtonMenu
                menuTitle="Controls"
                menuItems={createControlMenu(controls)}
                initialCollapsed={false}
                loading={false}
                fetching={false}
                handleButtonClick={handleControlClick}
              /> */}
        </Aside>
      </AsideAndMainContainer>
    );
  }
  return <h1>No content</h1>;
}
