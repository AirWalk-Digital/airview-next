'use server';

import matter from 'gray-matter';

import type { ContentItem } from '@/config';
import { getFileContent } from '@/lib/Github';
import { getLogger } from '@/lib/Logger';
import { cacheWrite } from '@/lib/Redis';

const logger = getLogger().child({ namespace: 'publishDraft' });
logger.level = 'info';

export default async function publishDraft(context: ContentItem | undefined) {
  if (context && context.branch && context.file) {
    const file = await getFileContent({
      owner: context.owner,
      repo: context.repo,
      branch: context.branch,
      path: context.file,
    });
    let pageContentText = '';
    if (file && file.content) {
      pageContentText = file?.content
        ? Buffer.from(file.content).toString()
        : '';
    }
    const { data } = matter(pageContentText);
    logger.info({ msg: 'publishDraft', data });

    const draft = `${context.branch}/${context.file}`;
    try {
      await cacheWrite(`draft:${context.file}`, draft);
    } catch (error) {
      logger.error(error);
    }
  } else {
    logger.error('Branch or File is empty or undefined');
  }

  if (!context) {
    logger.error('Context is empty or undefined');
  }
}
