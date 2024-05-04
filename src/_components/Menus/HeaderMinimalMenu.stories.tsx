// Menu.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import type { HeaderMinimalMenuProps } from './HeaderMinimalMenu';
import { HeaderMinimalMenu } from './HeaderMinimalMenu';

export default {
  title: 'Menus/HeaderMinimalMenu',
  component: HeaderMinimalMenu,
} as Meta;

const Template: StoryFn<HeaderMinimalMenuProps> = (args) => (
  <HeaderMinimalMenu {...args} />
);

export const Default = Template.bind({});
Default.args = {
  menu: [
    {
      label: 'Home',
      url: '/',
      children: [
        {
          groupTitle: 'Submenu',
          links: [
            {
              label: 'Submenu 1',
              url: '/submenu1',
            },
            {
              label: 'Submenu 2',
              url: '/submenu2',
            },
          ],
        },
      ],
    },
    {
      label: 'About',
      url: '/about',
      children: [
        {
          links: [
            {
              label: 'Submenu 1',
              url: '/submenu1',
            },
            {
              label: 'Submenu 2',
              url: '/submenu2',
            },
          ],
        },
      ],
    },
  ],
  open: true,
  top: 0,
  drawerWidth: 240,
};
