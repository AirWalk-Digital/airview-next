import type { Metadata } from 'next';
import matter from 'gray-matter';

import React from 'react';
import { ContentLoader, ContentPrint } from '@/components/Layouts';

import { siteConfig } from '@/config';
import { notFound } from 'next/navigation';
import { getFileContent } from '@/lib/Github';
import { getLogger } from '@/lib/Logger';
import type { ContentItem, MatterData } from '@/lib/Types';
const logger = getLogger().child({ namespace: 'docs/page' });
logger.level = 'error';
export const metadata: Metadata = {
  title: 'Airview',
  description: 'Airview AI',
};

async function checkFrontmatter(content: string, context: ContentItem) {
  const matterData = matter(content, {
    excerpt: false,
  }).data as MatterData;
  if (matterData) {
    Object.keys(matterData).forEach((key) => {
      if (matterData && matterData[key] && matterData[key] instanceof Date) {
        matterData[key] = (matterData[key] as Date).toISOString();
      }
    });
  }
  if (
    matterData &&
    matterData.external_repo &&
    matterData.external_owner &&
    matterData.external_path &&
    matterData.git_provider
  ) {
    const { external_repo, external_owner, external_path } = matterData;
    const owner = external_owner as string;
    const repo = external_repo as string;
    const branch = context.branch;
    const file = external_path as string;
    let pageContent;
    try {
      pageContent = await getFileContent({ owner, repo, path: file });
    } catch (error) {
      logger.error({ msg: 'checkFrontmatter: ', error });
    }
    let linkedContent = '';
    if (pageContent && pageContent.content) {
      linkedContent = pageContent?.content
        ? Buffer.from(pageContent.content).toString()
        : '';
    }
    return {
      content: linkedContent,
      context: { ...context, linked: { owner, repo, branch, path: file } },
    };
  } else {
    return { content, context };
  }
}

export default async function Page({
  params,
}: {
  params: { mode: 'view' | 'edit' | 'print'; branch: string; path: string[] };
}) {
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

    // const file = path.join("/") as string;
    let pageContent;
    let pageContentText;
    let loading = false;
    const contentKey = params.path[0] as keyof typeof siteConfig.content;
    const branch = () =>
      params.branch === 'default'
        ? siteConfig?.content?.[contentKey]?.branch
        : decodeURIComponent(params.branch);
    const contentConfig = {
      ...siteConfig?.content?.[contentKey],
      file: file,
      branch: branch(),
    } as ContentItem;

    // content page
    if (file.endsWith('.md') || file.endsWith('.mdx')) {
      // const contentKey = params.path[0] as keyof typeof siteConfig.content;
      // const contentConfig = siteConfig?.content?.[contentKey];
      const isGithubRepo =
        contentConfig.owner &&
        contentConfig.repo &&
        contentConfig.branch &&
        file;

      if (isGithubRepo) {
        const { owner, repo, branch } = contentConfig;
        pageContent = await getFileContent({ owner, repo, path: file, branch });
        if (pageContent && pageContent.content) {
          pageContentText = pageContent?.content
            ? Buffer.from(pageContent.content).toString()
            : '';
        } else {
          return notFound();
        }
        
        const { content: linkedPageContentText, context } =
          await checkFrontmatter(pageContentText || '', contentConfig); // check for frontmatter context
        pageContentText = linkedPageContentText;

        if (pageContent && pageContent.content && pageContentText) {
          return (
            <main>
              <ContentPrint>
                <ContentLoader
                  pageContent={pageContentText}
                  context={context}
                  loading={loading}
                />
              </ContentPrint>
            </main>
          );
        } else {
          return notFound();
        }
      } else {
        return notFound();
      }
    } else {
      notFound();
    }
  } else {
    return notFound();
  }
}
