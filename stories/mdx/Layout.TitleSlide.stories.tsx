import { TitleSlide }from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';
import { Wrapper} from './utils/mdxify';

const meta: Meta<typeof TitleSlide> = {
  title: 'Slides/TitleSlide',
  component: TitleSlide,
  tags: ['autodocs'],
  argTypes: { format: { control: 'select', options: ['ppt', 'a4', 'storybook'] } },
  decorators: [
    (Story, context) => (
      <Wrapper context={context}>
        <Story />
      </Wrapper>
    ),
], 
};
export default meta;

type Story = StoryObj<typeof TitleSlide>;

export const Dark: Story = {
  args: {
    children: (
      `# Title
  
      ## subtitle
      more text
`
    ),
    background: 'image1.jpeg',
    format: 'storybook'
    }
  };

  export const Light: Story = {
    args: {
      children: (
  `# Title
  
  ## subtitle
  more text
  `
      ),
      background: 'image11.jpeg',
      format: 'storybook'
      }
    };
  