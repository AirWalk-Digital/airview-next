import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { TableOfContents } from './TableOfContents';

export default {
  title: 'Menus/TableOfContents',
  component: TableOfContents,
} as Meta;

const Template: StoryFn<typeof TableOfContents> = (args: any) => (
  <TableOfContents {...args} />
);

export const Default = Template.bind({});
Default.args = {
  tableOfContents: [
    {
      depth: 2,
      value: 'Part 1: An introduction to AI',
      id: 'part-1-an-introduction-to-ai',
    },
    {
      depth: 2,
      value: 'Part 2: How to identify GenAI opportunities and fit',
      id: 'part-2-how-to-identify-genai-opportunities-and-fit',
    },
    {
      depth: 2,
      value: 'Part 3: Developing GenAI solutions',
      id: 'part-3-developing-genai-solutions',
      children: [
        {
          depth: 5,
          value: 'Assessment',
          id: 'assessment',
        },
        {
          depth: 5,
          value: 'Design',
          id: 'design',
        },
        {
          depth: 5,
          value: 'Implementation',
          id: 'implementation',
        },
        {
          depth: 5,
          value: 'Reccomended Content',
          id: 'reccomended-content',
        },
      ],
    },
  ],
};
