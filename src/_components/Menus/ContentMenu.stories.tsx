/* eslint-disable */
// Menu.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';

import type { ContentMenuProps } from './ContentMenu';
import { ContentMenu } from './ContentMenu';

export default {
  title: 'Menus/ContentMenu',
  component: ContentMenu,
  args: {
    handleContentChange: fn(),
    handlePageReset: fn(),
  },
} as Meta;

const Template: StoryFn<ContentMenuProps> = (args) => <ContentMenu {...args} />;

export const Default = Template.bind({});
Default.args = {
  content: {
    directory1: [{ label: 'Item 1', url: '/item1' }],
    solutions: [{ label: 'Item 2', url: '/item2' }],
    chapters: [{ label: 'Chapter 1', url: '/chapter1' }],
  },
  context: {
    file: 'directory1/file1',
    collections: ['collection1', 'collection2'],
    source: 'github',
    repo: 'repo1',
    owner: 'owner',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
  },
  loading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  content: {
    collection1: [{ label: 'Item 1', url: '/item1' }],
    collection2: [{ label: 'Item 2', url: '/item2' }],
    chapters: [{ label: 'Chapter 1', url: '/chapter1' }],
  },
  context: {
    file: 'directory1/file1',
    collections: ['collection1', 'collection2'],
    source: 'github',
    repo: 'repo1',
    owner: 'owner',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
  },
  loading: true,
};

export const EmptyContent = Template.bind({});
EmptyContent.args = {
  content: {},
  context: {
    file: '',
    collections: [],
    source: 'github',
    repo: 'repo1',
    owner: 'owner',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
  },
  loading: false,
};

export const NoCollections = Template.bind({});
NoCollections.args = {
  content: {
    chapters: [{ label: 'Chapter 1', url: '/chapter1' }],
  },
  context: {
    file: 'directory1/file1',
    collections: [],
    source: 'github',
    repo: 'repo1',
    owner: 'owner',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
  },
  loading: false,
};

export const MultipleCollections = Template.bind({});
MultipleCollections.args = {
  content: {
    collection1: [{ label: 'Item 1', url: '/item1' }],
    collection2: [{ label: 'Item 2', url: '/item2' }],
    collection3: [{ label: 'Item 3', url: '/item3' }],
    chapters: [{ label: 'Chapter 1', url: '/chapter1' }],
  },
  context: {
    file: 'directory1/file1',
    collections: ['collection1', 'collection2', 'collection3'],
    source: 'github',
    repo: 'repo1',
    owner: 'owner',
    branch: 'main',
    path: 'services',
    reference: 'service',
    menu: {
      component: 'FullHeaderMenu',
      collection: 'providers',
    },
  },
  loading: false,
};
