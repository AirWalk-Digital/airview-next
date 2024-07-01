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

export const ComplexMenu = Template.bind({});
ComplexMenu.args = {
  menuTitle: 'Artificial Intelligence CoE',
  url: '/docs/solutions/artificial_intelligence_coe/_index.md',
  collapsible: true,
  initialCollapsed: false,
  menuItems: [
    {
      groupTitle: 'Designs',
      links: [
        {
          label: 'GenAI Agentic Automation with AutoGen',
          url: '/docs/designs/ai_autogen/_index.md',
        },
        {
          label: 'AI Request Routing',
          url: '/docs/designs/ai_request_routing_lwkvef8q/_index.md',
        },
      ],
    },
  ],
};

export const MultipleGroups = Template.bind({});
MultipleGroups.args = {
  menuTitle: 'Cloud Architecture',
  url: '/docs/solutions/cloud_architecture/_index.md',
  collapsible: true,
  initialCollapsed: true,
  menuItems: [
    {
      groupTitle: 'Chapters',
      links: [
        {
          label: 'Cloud Architecture Presentation',
          url: '/docs/solutions/cloud_architecture/architecture_presentation.ppt.mdx',
        },
        {
          label: 'Test MDX',
          url: '/docs/solutions/cloud_architecture/test.mdx',
        },
      ],
    },
    {
      groupTitle: 'Solutions',
      links: [
        {
          label: 'CSP Landing Zones',
          url: '/docs/solutions/cloud_landing_zones/_index.md',
        },
      ],
    },
    {
      groupTitle: 'Designs',
      links: [
        {
          label: 'Discovery - Azure Governance Export',
          url: '/docs/designs/discovery_azure_governance_export_l7yyys9e/_index.md',
        },
      ],
    },
  ],
};
