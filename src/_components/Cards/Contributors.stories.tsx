import type { Meta, StoryObj } from '@storybook/react';

import Contributors from './Contributors';

const meta: Meta<typeof Contributors> = {
  title: 'Cards/Contributors',
  component: Contributors,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Contributors>;

export const Primary: Story = {
  args: {
    contributors: [
      {
        authorName: 'John Doe',
        authorDate: 'Wed Apr 03 2024',
      },
      {
        authorName: 'Jane Doe',
        authorDate: 'Tue Apr 02 2024',
      },
    ],
  },
};

export const ManyAuthors: Story = {
  args: {
    contributors: [
      {
        authorName: 'John Doe',
        authorDate: 'Wed Apr 03 2024',
      },
      {
        authorName: 'Jane Smith',
        authorDate: 'Tue Apr 02 2024',
      },
      {
        authorName: 'Alice Johnson',
        authorDate: 'Mon Apr 01 2024',
      },
      {
        authorName: 'Bob Williams',
        authorDate: 'Sun Mar 31 2024',
      },
      {
        authorName: 'Charlie Brown',
        authorDate: 'Sat Mar 30 2024',
      },
      {
        authorName: 'David Davis',
        authorDate: 'Fri Mar 29 2024',
      },
      {
        authorName: 'Eve Martin',
        authorDate: 'Thu Mar 28 2024',
      },
      {
        authorName: 'Frank Thompson',
        authorDate: 'Wed Mar 27 2024',
      },
      {
        authorName: 'Grace Wilson',
        authorDate: 'Tue Mar 26 2024',
      },
      {
        authorName: 'Helen Miller',
        authorDate: 'Mon Mar 25 2024',
      },
      {
        authorName: 'Ivan Taylor',
        authorDate: 'Sun Mar 24 2024',
      },
      {
        authorName: 'Julia Anderson',
        authorDate: 'Sat Mar 23 2024',
      },
      {
        authorName: 'Kevin Thomas',
        authorDate: 'Fri Mar 22 2024',
      },
      {
        authorName: 'Laura Jackson',
        authorDate: 'Thu Mar 21 2024',
      },
      {
        authorName: 'Michael White',
        authorDate: 'Wed Mar 20 2024',
      },
      {
        authorName: 'Nancy Harris',
        authorDate: 'Tue Mar 19 2024',
      },
      {
        authorName: 'Oliver Martin',
        authorDate: 'Mon Mar 18 2024',
      },
      {
        authorName: 'Patricia Thompson',
        authorDate: 'Sun Mar 17 2024',
      },
      {
        authorName: 'Robert Garcia',
        authorDate: 'Sat Mar 16 2024',
      },
      {
        authorName: 'Sarah Martinez',
        authorDate: 'Fri Mar 15 2024',
      },
    ],
  },
};
