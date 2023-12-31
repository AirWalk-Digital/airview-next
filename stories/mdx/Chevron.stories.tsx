"use client";
import React from 'react';
import { Chevrons } from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';
import { Wrapper} from './utils/mdxify';

const meta: Meta<typeof Chevrons> = {
  title: 'MDX/Components/Chevrons',
  component: Chevrons,
  tags: ['autodocs'],
  argTypes: {
    color: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'highlight', 'accent', 'muted', 'paper'],
      control: { type: 'select' },
    }
  },
  decorators: [
    (Story, context) => (
      <Wrapper context={context}>
        <Story />
      </Wrapper>
    ),
], 
  
};
export default meta;

type Story = StoryObj<typeof Chevrons>;

export const Primary: Story = {
  args : {
    children: (
      `- star
        - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim.
        - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim.
      `
        ),
        color: 'secondary',
      }
};

