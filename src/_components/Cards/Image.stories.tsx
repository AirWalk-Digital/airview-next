import type { Meta, StoryObj } from '@storybook/react';

import Image from './Image';

const meta: Meta<typeof Image> = {
  title: 'Cards/Image',
  component: Image,
  tags: ['autodocs'],
  argTypes: {
    props: { control: 'object' },
    baseContext: { control: 'object' },
  },
};
export default meta;

type Story = StoryObj<typeof Image>;

const context = {
  file: 'hero/file1',
  collections: ['collection1', 'collection2'],
  source: 'local',
  repo: 'repo1',
  owner: 'owner',
  branch: 'main',
  path: 'services',
  reference: 'service',
  menu: {
    component: 'FullHeaderMenu',
    collection: 'providers',
  },
};

export const ExternalURL: Story = {
  args: {
    props: {
      src: 'https://cloud.githubusercontent.com/assets/5456665/13322882/e74f6626-dc00-11e5-921d-f6d024a01eaa.png', // replace with a default image URL
    },
    baseContext: context,
  },
};

export const AbsoluteURL: Story = {
  args: {
    props: {
      src: '/hero/architecture.png', // replace with a default image URL
    },
    baseContext: context,
  },
};

export const SmallImage: Story = {
  args: {
    props: {
      src: '/hero/architecture.png', // replace with a default image URL
    },
    baseContext: context,
  },
};

export const LargeImage: Story = {
  args: {
    props: {
      src: '/backgrounds/sheffield.jpg', // replace with a default image URL
    },
    baseContext: context,
  },
};

export const RelativeURL: Story = {
  args: {
    props: {
      src: './architecture.png', // replace with a default image URL
    },
    baseContext: context,
  },
};
