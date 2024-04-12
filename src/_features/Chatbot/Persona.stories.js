import { useArgs } from '@storybook/preview-api';
import Persona from './Persona';
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Chatbot/Persona',
  component: Persona,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: '',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    persona: {
      control: {
        type: 'select',
        options: ['jim', 'abi'],
      },
    },
    setPersona: { action: 'setPersona' },
    clearChat: { action: 'clearChat' },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  render: function Component(args) {
    const [, setArgs] = useArgs();

    const onChange = (value) => {
      args.setPersona(value);
      setArgs({ persona: value });
    };
    return (
      <Persona {...args} setPersona={onChange} clearChat={args.clearChat} />
    );
  },
  args: {
    persona: 'jim',
  },
};
