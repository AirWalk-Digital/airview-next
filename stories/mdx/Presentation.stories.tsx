import { PresentationOutput }from '@/components/layouts/PresentationOutput';
import { StoryObj, Meta } from '@storybook/react';
import { Wrapper} from './utils/mdxify';

const meta: Meta<typeof PresentationOutput> = {
  title: 'Pages/Presentation',
  component: PresentationOutput,
  tags: ['autodocs'],
  argTypes: { zoom: { control: 'select', options: ['ppt', 'a4', 'storybook'] } },
  decorators: [
    (Story, context) => (
      <Wrapper context={context}>
        <Story />
      </Wrapper>
    ),
], 
};
export default meta;

type Story = StoryObj<typeof PresentationOutput>;

function dummyFunction() {}


export const NormalSlide: Story = {
  args: {
    content: (
      `
      # Title
      ## subtitle
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim.

      `
    ),
    refresh: false,
    handlePresentation: {dummyFunction}
  }
};


export const MultipleSlides: Story = {
  args: {
    content: (
      `
      # Page 1
      ## subtitle
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim.

      ---
      
      # Page 2
      ## subtitle
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim.
      `
    ),
    refresh: false,
    handlePresentation: {dummyFunction}
  }
};




