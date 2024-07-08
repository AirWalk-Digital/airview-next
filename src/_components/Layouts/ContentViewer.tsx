'use client';

import { MDXProvider } from '@mdx-js/react';
import GitHubIcon from '@mui/icons-material/GitHub';
import PrintIcon from '@mui/icons-material/Print';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { LinearProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { Contributors } from '@/components/Cards';
import {
  Aside,
  AsideAndMainContainer,
  Main,
} from '@/components/Layouts/AsideAndMain';
import components from '@/components/Layouts/lib/mdxComponents';
import { ContentMenu, TableOfContents } from '@/components/Menus';
import { getLogger } from '@/lib/Logger';
import type { ContentItem, RelatedContent } from '@/lib/Types';

import { loadMDX } from './lib/loadMDX';
// import { mdComponents } from '../../constants/mdxProvider.js';
const logger = getLogger().child({ namespace: 'ContentViewer' });
logger.level = 'error';

type Contributor = {
  authorName: string;
  authorDate: string;
};

interface ContentViewerProps {
  pageContent: string;
  contributors: Contributor[];
  context: ContentItem;
  loading: boolean;
  relatedContent: RelatedContent;
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
  relatedContent,
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
  const theme = useTheme();
  // Use useMediaQuery hook to check for screen width
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        '_blank'
      );
    }
  }

  function openPrint() {
    const pathnameArray = currentPath.split('/');
    pathnameArray[2] = 'print';
    const newPathname = pathnameArray.join('/');
    router.push(newPathname);
  }

  function handleContentChange(callback: any) {
    // add '/related_content/' and the callback file to the path
    router.push(`${currentPath}/related_content/${callback}`);
  }

  function handlePageReset() {
    // reset the path to the current path before /related_content
    const rootPath = currentPath.split('/related_content')[0];
    if (rootPath) {
      router.push(rootPath);
    }
  }

  if (loading) {
    return <ContentSkeleton topBarHeight={topBarHeight} />;
  }
  if (pageContent) {
    let frontmatter;
    let mdxContent;
    try {
      ({ mdxContent, frontmatter } = loadMDX(
        pageContent,
        context?.file?.endsWith('.md') ? 'md' : 'mdx'
      ));
    } catch (error: any) {
      try {
        ({ mdxContent, frontmatter } = loadMDX(
          `---\ntitle: Error\n---\nError converting MDX\n${error.message}`,
          'md'
        ));
      } catch (err: any) {
        logger.error({ msg: 'Error converting MDX', err });
      }
    }
    const Page = mdxContent;
    logger.info({ msg: 'ContentViewer', frontmatter });
    return (
      <AsideAndMainContainer>
        <Main>
          <MDXProvider components={components(context)}>
            {frontmatter?.title && <h1>{frontmatter.title}</h1>}
            {contributors && !isMobile && (
              <Contributors contributors={contributors} />
            )}
            {(Page && <Page />) || (
              <Alert variant='outlined' severity='error'>
                No content.
              </Alert>
            )}
          </MDXProvider>
        </Main>
        {!isMobile && (
          <Aside>
            <Stack direction='row' spacing={1} sx={{ mb: 1 }}>
              <Chip
                size='small'
                color='primary'
                icon={<PrintIcon />}
                label='Print'
                onClick={() => openPrint()}
              />
              <Chip
                size='small'
                color='primary'
                icon={<GitHubIcon />}
                label='Code'
                onClick={() => openGithub()}
              />
              {frontmatter?.presentation && (
                <Chip
                  size='small'
                  color='primary'
                  icon={<SlideshowIcon />}
                  label='Presentation'
                />
              )}
            </Stack>

            <ContentMenu
              content={relatedContent}
              context={context}
              handleContentChange={(callback) => handleContentChange(callback)}
              handlePageReset={() => handlePageReset()}
              loading={false}
            />
            {/*        {sideComponent && <SideComponent />} */}
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
        )}
      </AsideAndMainContainer>
    );
  }
  return (
    <Alert variant='outlined' severity='error'>
      No content.
    </Alert>
  );
}
