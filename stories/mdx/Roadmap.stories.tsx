"use client";
import React from 'react';
import { Roadmap} from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';
import { Wrapper} from './utils/mdxify';

const meta: Meta<typeof Roadmap> = {
  title: 'MDX/Components/Roadmap',
  component: Roadmap,
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

type Story = StoryObj<typeof Roadmap>;

export const Primary: Story = {
  args : {
    children: (
`1. Phase 1 *sub text*
- things to do :
  - something
  - something else
  
2. Phase 2 *sub text*
- things to do :
  - something
  - something else

`
        ),
  color: 'secondary',
}
};

