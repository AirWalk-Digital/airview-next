import { Tile } from '@/components/buttons'
import { WrapTheme } from './mdx/utils/mdxify';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof Tile> = {
  title: 'MDX/Components/Tile',
  component: Tile,
  tags: ['autodocs'],
  argTypes: {
    name: { control: { type: 'text' } },
    url : { control: { type: 'text' } },
    image: { control: { type: 'text' } },
    description: { control: { type: 'text' } },
    isHero: { control: { type: 'boolean' } },
  },
  decorators: [
    (Story, context) => (
      <WrapTheme>
        <Story />
      </WrapTheme>
    ),
], 
};
export default meta;

type Story = StoryObj<typeof Tile>;

export const Primary: Story = {
  args: {
    name: 'Tile here.............',
    url: 'https://www.google.com',
    image: '/hero/architecture.png',
    }
  };

  export const WithDescription: Story = {
    args: {
      name: 'Cloud Architecture',
      url: '',
      image: '/hero/architecture.png',
      description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
      }
    };

    export const HeroImage: Story = {
      args: {
        name: 'Lizards',
        url: 'https://www.google.com',
        image: '/hero/lizards.png',
        description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica',
        isHero: true
        }
      };
  

    export const NoImage: Story = {
      args: {
        name: 'Lizards',
        url: 'https://www.google.com',
        // image: '/hero/hero1.png',
        description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
        }
      };
    
      export const TitleOnly: Story = {
        args: {
          name: 'Lizards...............',
          // url: 'https://www.google.com',
          // image: '/hero/hero1.png',
          // description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
          }
        };


        export const MultiLineTitle: Story = {
          args: {
            name: 'Lizards are a widespread group of squamate reptiles',
            // url: 'https://www.google.com',
            // image: '/hero/hero1.png',
            // description: 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'
            }
          };