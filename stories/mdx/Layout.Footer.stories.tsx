import { Footer }from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof Footer> = {
  title: 'MDX/Layouts/Footer',
  component: Footer,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    tagline: 'Technology, done right',
    company: 'airwalkreply.com'
    }
  };

  