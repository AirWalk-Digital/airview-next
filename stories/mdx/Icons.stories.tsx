"use client";
import React from 'react';
import { Icon } from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';
import { Wrapper} from './utils/mdxify';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icons',
  component: Icon,
  tags: ['autodocs'],
  args: {
    size: '75px', 
  },
  argTypes: {
    color: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'highlight', 'accent', 'muted', 'paper'],
      control: { type: 'select' },
    },
    type: {
      options: ["light", "solid", "brands", "thin", "custom"],
      control: { type: 'select' },
      defaultValue: "light"
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
    type: "light",
  children: (
`star`
  ),
  color: 'secondary',
}
};


export const Custom: Story = {
args : {
  type: "custom",
  children: (
`terraform`
  ),
  color: 'secondary',
}
};
