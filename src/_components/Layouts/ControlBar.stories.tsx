import type { Meta, StoryFn } from '@storybook/react';
import { fn } from '@storybook/test';
import React, { useState } from 'react';

import type { ContentItem } from '@/lib/Types';

import { ControlBar, type ControlBarProps } from './ControlBar';

interface StorybookControlBar extends ControlBarProps {
  result: string;
}

export default {
  title: 'App Bar/ControlBar',
  component: ControlBar,
  tags: ['autodocs'],
  parameters: { actions: { argTypesRegex: '^on.*|^handle*' } },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    result: { control: { type: 'radio' }, options: ['success', 'error'] },
    // backgroundColor: { control: 'color' },
  },
  args: {
    handleRefresh: fn(),
    handlePrint: fn(),
    handleAdd: fn(),
    handlePresentation: fn(),
  },
} as Meta<StorybookControlBar>;

// const Template: StoryFn<typeof ControlBar> = (args) => <ControlBar {...args} />;

// export const Default = Template.bind({});
// Default.args = {
//   open: true,
//   height: '64px',
//   handleEdit: fn(),
//   handlePrint: () => alert('Print clicked'),
//   handleAdd: () => alert('Add clicked'),
//   handlePresentation: () => alert('Presentation clicked'),
//   collection: { branch: 'main' },
//   context: { branch: 'main' },
//   branches: [{ name: 'main' }, { name: 'dev' }],
//   onContextUpdate: (context) => console.log('Context updated', context),
//   editMode: false,
// };

interface ExtendedContentItem extends ContentItem {
  base_branch: string;
}

const dummyCollection: ExtendedContentItem = {
  source: 'github',
  repo: 'airwalk_patterns',
  owner: 'airwalk-digital',
  branch: 'main',
  base_branch: 'main',
  path: 'providers',
  reference: 'provider',
  collections: ['services'],
};

const branches = [
  {
    name: 'main',
    commit: {
      sha: '53bfd8457509778140caa47b01c6476d661f1b34',
      url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/53bfd8457509778140caa47b01c6476d661f1b34',
    },
    protected: true,
  },
  {
    name: 'branch-1',
    commit: {
      sha: '53bfd8457509778140caa47b01c6476d661f1b34',
      url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/53bfd8457509778140caa47b01c6476d661f1b34',
    },
    protected: false,
  },
  {
    name: 'branch-2',
    commit: {
      sha: '09a01dc4e148c35412d3a6a00a384930a41b813b',
      url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/09a01dc4e148c35412d3a6a00a384930a41b813b',
    },
    protected: false,
  },
  {
    name: 'branch-3',
    commit: {
      sha: '7080423b89568b0427cb781f8b753f52fbc394e0',
      url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/7080423b89568b0427cb781f8b753f52fbc394e0',
    },
    protected: false,
  },
];

// function fn()() {}

export const Simple = {
  args: {
    open: true,
    top: 0,
    handleEdit: fn(),
    handleRefresh: fn(),
    handlePrint: fn(),
    handleAdd: fn(),
    onContextUpdate: fn(),
    handlePresentation: fn(),
    collection: dummyCollection,
    context: dummyCollection,
    branches,
    // editMode: false,
    fetchBranches: fn(),
  },
};

export const EditMode = {
  args: {
    open: true,
    top: 0,
    handleEdit: fn(),
    handleRefresh: fn(),
    handlePrint: fn(),
    handleAdd: fn(),
    onContextUpdate: fn(),
    handlePresentation: fn(),
    collection: dummyCollection,
    context: { ...dummyCollection, branch: 'branch-1' },
    branches,
    editMode: true,
    fetchBranches: fn(),
    handlePR: fn(),
  },
};

export const DefaultBranch = {
  args: {
    open: true,
    top: 0,
    handleEdit: fn(),
    handleRefresh: fn(),
    handlePrint: fn(),
    handleAdd: fn(),
    onContextUpdate: fn(),
    handlePresentation: fn(),
    collection: dummyCollection,
    context: { ...dummyCollection },
    branches,
    editMode: true,
    fetchBranches: fn(),
  },
};

const Template: StoryFn<StorybookControlBar> = (args) => {
  // const [collection, setCollection] = useState(dummyCollection);
  const [editMode, setEditMode] = useState(args.editMode || false);
  const [context, setContext] = useState({
    ...args.context,
    branch: 'main',
  });

  // function fn()() {}

  const handleEdit = (edit: boolean) => {
    setEditMode(edit);
    fn();
  };

  function onContextUpdate(newCollection: ExtendedContentItem) {
    setContext(newCollection);
  }

  function dummyDelay() {
    fn();
    // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // await delay(2000);
    switch (args.result) {
      case 'success':
        return 'success';
      case 'error':
        throw new Error('An error occurred');
      default:
        throw new Error('An error occurred');
    }
  }

  return (
    <ControlBar
      open
      top={0}
      height={64}
      handleEdit={handleEdit}
      handleAdd={() => fn()}
      handlePresentation={() => fn()}
      handlePrint={() => fn()}
      handleNewBranch={() => fn()}
      onContextUpdate={() => onContextUpdate}
      collection={args.collection}
      context={context}
      branches={args.branches}
      editMode={editMode}
      fetchBranches={fn()}
      handlePR={() => dummyDelay()}
    />
  );
};

export const FullDemo = Template.bind({});
FullDemo.args = {
  collection: dummyCollection,
  context: { ...dummyCollection, branch: 'branch-1' },
  branches,
  result: 'success',
};

export const APISuccess = Template.bind({});
APISuccess.args = {
  collection: dummyCollection,
  context: { ...dummyCollection, branch: 'branch-1' },
  branches,
  editMode: true,
  result: 'success',
};

export const APIError = Template.bind({});
APIError.args = {
  collection: dummyCollection,
  context: { ...dummyCollection, branch: 'branch-1' },
  branches,
  editMode: true,
  result: 'error',
};
