// Menu.stories.tsx
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import type { MainButtonMenuProps } from './MainButtonMenu';
import { MainButtonMenu } from './MainButtonMenu';

export default {
  title: 'Menus/MainButtonMenu',
  component: MainButtonMenu,
} as Meta;

const Template: StoryFn<MainButtonMenuProps> = (args) => (
  <MainButtonMenu {...args} />
);

export const Default = Template.bind({});
Default.args = {
  menu: [
    {
      label: 'Home',
      url: '/',
      menuItems: [
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
      menuItems: [
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
  collapsible: true,
  initialCollapsed: false,
};

export const Providers = Template.bind({});
Providers.args = {
  menu: [
    { label: 'Test Service 1', url: 'services/test_1_service/_index.md' },
    {
      label: 'Test 2 Service',
      url: 'services/test_2_service/_index.mdx',
      menuItems: [
        {
          groupTitle: 'Chapters',
          links: [
            {
              label: 'Test 2 content',
              url: 'services/test_2_service/blah.mdx',
            },
          ],
        },
      ],
    },
  ],
  open: true,
  top: 0,
  drawerWidth: 240,
  collapsible: true,
  initialCollapsed: true,
};

export const ComplexMenu = Template.bind({});
ComplexMenu.args = {
  menu: [
    {
      label: 'Artificial Intelligence CoE',
      url: '/docs/solutions/artificial_intelligence_coe/_index.md',
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
    },
    {
      label: 'Cloud Architecture',
      url: '/docs/solutions/cloud_architecture/_index.md',
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
    },
  ],
  open: true,
  top: 0,
  drawerWidth: 240,
  collapsible: true,
  initialCollapsed: true,
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
  menu: [
    {
      label: 'Artificial Intelligence CoE',
      url: '/docs/solutions/artificial_intelligence_coe/_index.md',
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
    },
    {
      label: 'Cloud Architecture',
      url: '/docs/solutions/cloud_architecture/_index.md',
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
    },
  ],
  open: true,
  top: 0,
  drawerWidth: 240,
  collapsible: true,
  initialCollapsed: true,
};
