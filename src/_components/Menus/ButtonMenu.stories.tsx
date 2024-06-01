// Menu.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';

import type { ButtonMenuProps } from './ButtonMenu';
import { ButtonMenu } from './ButtonMenu';

export default {
  title: 'Menus/ButtonMenu',
  component: ButtonMenu,
  args: {
    handleButtonClick: fn(),
  },
} as Meta;

const Template: StoryFn<ButtonMenuProps> = (args) => <ButtonMenu {...args} />;

export const Default = Template.bind({});
Default.args = {
  menuTitle: 'menuTitle',
  menuItems: [
    {
      groupTitle: 'Submenu Title',
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
  collapsible: false,
  initialCollapsed: false,
};
