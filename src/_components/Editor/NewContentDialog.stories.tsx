import type { StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { delay, http, HttpResponse } from 'msw';
import React from 'react';

import { NewContentDialog } from './NewContentDialog';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'App Bar/NewContentDialog',
  component: NewContentDialog,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    handleAdd: { action: 'clicked' },
    // backgroundColor: { control: 'color' },
  },
  args: {
    handleDialog: fn(),
  },
};

type Story = StoryObj<typeof NewContentDialog>;

const Template: Story = {
  render: ({ ...args }) => {
    return (
      <NewContentDialog
        dialogOpen
        handleDialog={args.handleDialog}
        // other props you might need to pass
      />
    );
  },
};
export const Default = {
  ...Template,
};

const TestData = [
  {
    label: 'GenAI Agentic Automation with AutoGen',
    url: '/docs/designs/ai_autogen/_index.md',
  },
  {
    label: 'AI Request Routing',
    url: '/docs/designs/ai_request_routing_lwkvef8q/_index.md',
  },
  {
    label: 'AWS Cost Analysis',
    url: '/docs/designs/aws_cost_analysis/_index.md',
  },
  {
    label: 'AWS Endpoint Service (PrivateLink)',
    url: '/docs/designs/aws_endpoint_service_privatelink_ld2yt8og/_index.md',
  },
  {
    label: 'AWS Landing Zone',
    url: '/docs/designs/aws_landing_zone_lo70o5w8/_index.md',
  },
  {
    label: 'AWS Usage optimisation',
    url: '/docs/designs/aws_usage_optimisation/_index.md',
  },
  {
    label: 'Azure Cost Allocation',
    url: '/docs/designs/azure_cost_allocation/_index.md',
  },
  {
    label: 'Azure Landing Zone',
    url: '/docs/designs/azure_landing_zone/_index.md',
  },
  {
    label: 'Azure Private Link Services',
    url: '/docs/designs/azure_private_link_services_ldd7nuqc/_index.md',
  },
  {
    label: 'Azure Usage Analysis',
    url: '/docs/designs/azure_usage_analysis/_index.md',
  },
  {
    label: 'Azure Usage optimisation',
    url: '/docs/designs/azure_usage_optimisation/_index.md',
  },
  {
    label: 'Conditional Access',
    url: '/docs/designs/conditional_access_lqgfqwth/_index.md',
  },
  {
    label: 'Discovery - Azure Governance Export',
    url: '/docs/designs/discovery_azure_governance_export_l7yyys9e/_index.md',
  },
  {
    label: 'AWS Landing Zone - Elastic Kubernetes Service (EKS)',
    url: '/docs/designs/elastic_kubernetes_service_eks_ljwysr3d/_index.md',
  },
  {
    label: 'Maturity Model',
    url: '/docs/designs/finops_maturity_model/_index.md',
  },
  {
    label: 'Github Codespaces',
    url: '/docs/designs/github_codespaces/_index.md',
  },
  {
    label: 'High Level Design',
    url: '/docs/designs/high_level_design_lczbvf99/_index.md',
  },
  {
    label: 'Istio Ambient Mesh',
    url: '/docs/designs/istio_ambient_mesh_leemxsdx/_index.md',
  },
  {
    label: 'Microsoft 365 DSC',
    url: '/docs/designs/microsoft_365_dsc_l7yx1xgu/_index.md',
  },
];

export const MockedSuccess = {
  ...Template,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/content/structure', async () => {
          await delay(800);
          return HttpResponse.json(TestData);
        }),
      ],
    },
  },
};

export const MockedError = {
  ...Template,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/content/structure', async () => {
          await delay(800);
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
