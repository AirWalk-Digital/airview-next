"use client";
import React from 'react';
import { Mermaid } from 'mdx-mermaid/Mermaid';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof Alert> = {
  title: 'Visualisation/Mermaid',
  component: Mermaid,
  //👇 Enables auto-generated documentation for the component story
  tags: ['autodocs'],
  argTypes: {

    // severity: { description: 'the type of icon and background color', type: { name: 'string', required: true }, defaultValue: 'info', options: ['error','info','success','warning'], control: { type: 'select' },}	
    // color: {
    //   options: ['primary', 'secondary','tertiary', 'quaternary', 'highlight','accent', 'muted', 'paper'],
    //   control: { type: 'select' },
    // },
  },
};
export default meta;

type Story = StoryObj<typeof Mermaid>;

export const Primary: Story = {
  args: {
    chart: `graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
`,
  },
};