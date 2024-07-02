import type { Meta, StoryObj } from '@storybook/react';

import ServiceTile from './ServiceTile';

const meta: Meta<typeof ServiceTile> = {
  title: 'Cards/ServiceTile',
  component: ServiceTile,
  tags: ['autodocs'],
  argTypes: {
    frontmatter: { control: { type: 'object' } },
    file: { control: { type: 'text' } },
  },
};
export default meta;

type Story = StoryObj<typeof ServiceTile>;

export const Primary: Story = {
  args: {
    frontmatter: {
      title: 'Tile here.............',
      description: 'description here',
      image: '/hero/hero1.png',
    },
    file: '/knowledgebase/blah/_index.mdx',
  },
};
