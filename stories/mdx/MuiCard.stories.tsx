"use client";
import React from 'react';
import Card from '@mui/material/Card';
import { StoryObj, Meta } from '@storybook/react';
import { Wrapper} from './utils/mdxify';

const meta: Meta<typeof Card> = {
  title: 'MDX/Material-ui/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    color: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'highlight', 'accent', 'muted', 'paper'],
      control: { type: 'select' },
    }
  },
  
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Primary: Story = {
  args: {
    children: (
`### Header

cloud

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusm
`
    ),
    color: 'secondary',
    }
  };

export const NoHeader: Story = {
  args: {
    children: (
`cloud

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusm
`
    ),
    color: 'secondary',
  }
};

export const NoIcon: Story = {
  args: {
    children: (
      `### Header, no icon

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
`
    ),
    color: 'secondary',
  }
};