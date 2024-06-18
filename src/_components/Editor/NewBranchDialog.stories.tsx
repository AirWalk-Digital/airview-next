// import { toSnakeCase } from '@/lib/utils/stringUtils';
import type { StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';

import { NewBranchDialog } from './NewBranchDialog';

export default {
  title: 'App Bar/NewBranchDialog',
  component: NewBranchDialog,
  parameters: {},
  tags: ['autodocs'],
  args: {
    handleDialog: fn(),
  },
};

type Story = StoryObj<typeof NewBranchDialog>;

const Template: Story = {
  render: ({ ...args }) => {
    return (
      <NewBranchDialog
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
