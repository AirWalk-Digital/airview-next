import { Header }from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof Header> = {
  title: 'MDX/Layouts/Header',
  component: Header,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    heading: (
`Title`
    ),
    }
  };

  