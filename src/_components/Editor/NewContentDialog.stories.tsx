import type { StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { delay, http, HttpResponse } from 'msw';
import React from 'react';

import { NewContentDialog } from './NewContentDialog';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'App Bar/NewContentDialog',
  component: NewContentDialog,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    handleAdd: { action: 'clicked' },
    // backgroundColor: { control: 'color' },
  },
  args: {
    handleDialog: fn(),
  },
};

type Story = StoryObj<typeof NewContentDialog>;

const Template: Story = {
  render: ({ ...args }) => {
    return (
      <NewContentDialog
        dialogOpen
        handleDialog={args.handleDialog}
        // other props you might need to pass
      />
    );
  },
};
export const Default = {
  ...Template,
};

const TestData = {
  docs: [
    {
      file: '/path/to/document1.md',
      frontmatter: {
        title: 'Document Title 1',
      },
    },
    {
      file: '/path/to/document2.md',
      frontmatter: {
        title: 'Document Title 2',
      },
    },
    {
      file: '/path/to/document3.md',
      frontmatter: {
        title: 'Document Title 3',
      },
    },
    // Add more documents as needed
  ],
};

export const MockedSuccess = {
  ...Template,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/structure', async () => {
          await delay(800);
          return HttpResponse.json(TestData);
        }),
      ],
    },
  },
};

export const MockedError = {
  ...Template,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/structure', async () => {
          await delay(800);
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
