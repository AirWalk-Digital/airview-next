"use client";
import React from 'react';
import { Icon } from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';
import { Wrapper} from './utils/mdxify';

const meta: Meta<typeof Icon> = {
  title: 'MDX/Components/Icons',
  component: Icon,
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

type Story = StoryObj<typeof Icon>;

export const Primary: Story = {
  args : {
  children: (
`star`
  ),
  color: 'secondary',
}
};


export const Custom: Story = {
args : {
  children: (
`fak-terraform`
  ),
  color: 'secondary',
}
};
