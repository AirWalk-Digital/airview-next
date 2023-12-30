import { Slide }from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof Slide> = {
  title: 'Slides/Slide',
  component: Slide,
  tags: ['autodocs'],
  argTypes: { zoom: { control: 'select', options: ['ppt', 'a4', 'storybook'] } },
};
export default meta;

type Story = StoryObj<typeof Slide>;

export const NormalSlide: Story = {
  args: {
    children: (
      `# Title
      ## subtitle
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim.
      `
    ),
    background: 'image1.jpeg',
    zoom: 'ppt'
  }
};

export const NoHeading: Story = {
  args: {
    children: (
      `## subtitle
        
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim.
        `
    ),
    background: 'image1.jpeg',
    zoom: 'ppt'
  }
};

export const NoSubtitle: Story = {
  args: {
    children: (
      `# Title
          
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim.
          `
    ),
    background: 'image1.jpeg',
    zoom: 'ppt'
  }
};

export const TitleSlide: Story = {
  args: {
    children: (
      `<TitleSlide background="image1.jpeg" format="storybook">
      # Title
      subtitle
      
      </TitleSlide>
          `
    ),
    background: 'image1.jpeg',
    zoom: 'ppt'
  }
};



