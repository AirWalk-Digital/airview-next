"use client";
import React from 'react';
import Alert from '@mui/material/Alert';
import { StoryObj, Meta } from '@storybook/react';
import { Wrapper} from './utils/mdxify';

const meta: Meta<typeof Alert> = {
  title: 'MDX/Material-ui/Alert',
  component: Alert,
  //👇 Enables auto-generated documentation for the component story
  tags: ['autodocs'],
  argTypes: {

    severity: { description: 'the type of icon and background color', type: { name: 'string', required: true }, defaultValue: 'info', options: ['error','info','success','warning'], control: { type: 'select' },}	
    // color: {
    //   options: ['primary', 'secondary','tertiary', 'quaternary', 'highlight','accent', 'muted', 'paper'],
    //   control: { type: 'select' },
    // },
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Primary: Story = {
  args: {
    children: 'some text here',
  },
};