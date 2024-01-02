import { Footer }from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';
import { Wrapper} from './utils/mdxify';

const meta: Meta<typeof Footer> = {
  title: 'MDX/Layouts/Footer',
  component: Footer,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => (
      <Wrapper context={context}>
        <Story />
      </Wrapper>
    ),
], 
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    tagline: 'Technology, done right',
    company: 'airwalkreply.com'
    }
  };

  