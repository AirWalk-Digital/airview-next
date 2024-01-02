import { PagedOutput } from "@/components/layouts/PagedOutput";
import { StoryObj, Meta } from '@storybook/react';
import { WrapMDX, WrapTheme} from './utils/mdxify';

export default {
  title: 'Content/Print',
  component: PagedOutput,
  tags: ['autodocs'],
  argTypes: { zoom: { control: 'select', options: ['ppt', 'a4', 'storybook'] } },
  args: { context: null },
  decorators: [
    (Story, context) => (
      <WrapTheme>
<Story />
      </WrapTheme>
    ),
], 
};


const Template = (args, context) => {

  function dummyFunction() {}

  return (
    
      <PagedOutput handlePrint={dummyFunction}>
      <WrapMDX>
      {args.children}
      </WrapMDX>
      </PagedOutput>
    
  );
};
export const Default = Template.bind({});


Default.args = {

    children: (
      `# Title
      ## subtitle
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim.
      
      ![](http:///localhost:6006/hero/lizards.png)

      `
    ),
    zoom: 'ppt'
};





