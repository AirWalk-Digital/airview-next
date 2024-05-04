import type { Meta, StoryObj } from '@storybook/react';

import TileCard from '@/components/Cards/TileCard';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export

const meta: Meta<typeof TileCard> = {
  title: 'Cards/TileCard',
  component: TileCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: '',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    name: { control: { type: 'text' } },
    url: { control: { type: 'text' } },
    image: { control: { type: 'text' } },
    description: { control: { type: 'text' } },
    isHero: { control: { type: 'boolean' } },
  },
};

export default meta;
type Story = StoryObj<typeof TileCard>;

export const Primary: Story = {
  args: {
    name: 'Tile here.............',
    url: 'https://www.google.com',
    image: '/hero/architecture.png',
  },
};

export const WithDescription: Story = {
  args: {
    name: 'Cloud Architecture',
    url: '',
    image: '/hero/architecture.png',
    description:
      'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
  },
};

export const HeroImage: Story = {
  args: {
    name: 'Lizards',
    url: 'https://www.google.com',
    image: '/hero/lizards.png',
    description:
      'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
    isHero: true,
  },
};

export const NoImage: Story = {
  args: {
    name: 'Lizards',
    url: 'https://www.google.com',
    // image: '/hero/hero1.png',
    description:
      'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
  },
};

export const TitleOnly: Story = {
  args: {
    name: 'Lizards...............',
    // url: 'https://www.google.com',
    // image: '/hero/hero1.png',
    // description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
  },
};

export const MultiLineTitle: Story = {
  args: {
    name: 'Lizards are a widespread group of squamate reptiles',
    // url: 'https://www.google.com',
    // image: '/hero/hero1.png',
    // description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
  },
};
