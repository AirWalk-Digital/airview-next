import { Header }from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';
import { Wrapper} from './utils/mdxify';

const meta: Meta<typeof Header> = {
  title: 'MDX/Layouts/Header',
  component: Header,
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

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    heading: (
`Title`
    ),
    }
  };

  