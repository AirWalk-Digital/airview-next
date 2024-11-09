import { ButtonBase } from '@mui/material';
import path from 'path';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { getLogger } from '@/lib/Logger';
import type { ContentItem, RelatedContent } from '@/lib/Types';

import { ButtonMenu } from './ButtonMenu';

const logger = getLogger().child({ namespace: 'ContentMenu' });
logger.level = 'debug';

export interface ContentMenuProps {
  content: RelatedContent;
  handleContentChange: (callback: any) => void;
  handlePageReset: () => void;
  context: ContentItem;
  loading?: boolean;
}

export const ContentMenu: React.FC<ContentMenuProps> = ({
  content,
  handleContentChange,
  handlePageReset,
  context,
  loading = false,
}) => {
  const onContentClick = (callback: any) => {
    handleContentChange(callback);
  };

  const directory: string = context?.file ? path.dirname(context.file) : '';

  // Ensure content is a dictionary-like structure
  const contentDict = content;
  const chaptersMenu = [];
  logger.debug({ component: 'ContentMenu', contentDict });

  if (directory && context.collections) {
    //   for (const collectionItem of context.collections) {
    //     if (contentDict[directory][collectionItem]) {
    //       chaptersMenu.push({
    //         groupTitle: collectionItem,
    //         links: contentDict[directory][collectionItem],
    //       });
    //     }
    //   }

    for (const collectionItem of Object.keys(contentDict)) {
      if (contentDict[collectionItem]) {
        chaptersMenu.push({
          groupTitle: collectionItem,
          links: contentDict[collectionItem],
        });
      }
    }

    // if (contentDict[directory].chapters) {
    //   chaptersMenu.push({
    //     groupTitle: 'Chapters',
    //     links: contentDict[directory].chapters,
    //   });
    // }
  }
  logger.debug({ component: 'ContentMenu', chaptersMenu });
  if (chaptersMenu.length > 0) {
    return (
      <>
        <ButtonBase
          onClick={() => handlePageReset()}
          sx={{
            textDecoration: 'none',
            textTransform: 'none',
            textAlign: 'left',
            fontWeight: 'bold',
            color: 'secondary',
            mb: '5px',
          }}
        >
          Main Content
        </ButtonBase>

        <ButtonMenu
          menuTitle='Related Content'
          menuItems={chaptersMenu}
          initialCollapsed={false}
          loading={loading}
          fetching={false}
          handleButtonClick={onContentClick}
        />
      </>
    );
  }

  return null;
};
