// Menu.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import type { MenuProps } from './Menu';
import { Menu } from './Menu';

export default {
  title: 'Menus/Menu',
  component: Menu,
} as Meta;

const Template: StoryFn<MenuProps> = (args) => <Menu {...args} />;

export const Default = Template.bind({});
Default.args = {
  menuTitle: 'Sample Menu',
  loading: false,
  fetching: false,
  menuItems: [
    {
      groupTitle: 'Group 1',
      links: [
        { label: 'Link 1', url: '/link1' },
        { label: 'Link 2', url: '/link2' },
      ],
    },
    {
      groupTitle: 'Group 2',
      links: [
        { label: 'Link 3', url: '/link3' },
        { label: 'Link 4', url: '/link4' },
      ],
    },
  ],
  collapsible: true,
  initialCollapsed: false,
  currentRoute: '/link1',
};
