import { Nest } from 'airview-mdx';
import { StoryObj, Meta } from '@storybook/react';
import { Wrapper} from './utils/mdxify';

const meta: Meta<typeof Nest> = {
  title: 'MDX/Components/Nest',
  component: Nest,
  tags: ['autodocs'],
  argTypes: {
    color: {
      options: ['primary', 'secondary', 'tertiary', 'quaternary', 'highlight', 'accent', 'muted', 'paper'],
      control: { type: 'select' },
    }
  },  
  decorators: [
    (Story, context) => (
      <Wrapper context={context}>
        <Story />
      </Wrapper>
    ),
], 
};
export default meta;

type Story = StoryObj<typeof Nest>;

export const SingleCard: Story = {
  args: {
    children: (
`# Header H1
## Subheading H2

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusm

`
    ),
    color: 'secondary',
    }
  };

  export const NestedCards: Story = {
    args: {
      children: (
  `# Infrastructure
  ## Infrastructure components
  <Nest>Compute</Nest>
  <Nest>
  # Storage
  <Nest>Object</Nest>
  <Nest>Standard Block</Nest>
  <Nest>High Performance Block</Nest>
  <Nest>File</Nest>
  </Nest>
  <Nest>
  # Network
  ## Network Services
  <Nest>Load Balancer</Nest>
  <Nest>Application Delivery Controller</Nest>
  <Nest>Firewall</Nest>
  </Nest>
  `
      ),
      color: 'secondary',
      }
    };