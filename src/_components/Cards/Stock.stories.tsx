// Stocks.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Stock } from './Stock';

export default {
  title: 'Cards/Stock',
  component: Stock,
} as Meta;

type Story = StoryObj<typeof Stock>;

export const Primary: Story = {
  args: {
    symbol: 'AAPL',
    price: 150.12,
    delta: 0.12,
  },
};
