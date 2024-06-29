// components/Editor.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { delay, http, HttpResponse } from 'msw';
import React from 'react';

import type { ContentItem } from '@/lib/Types';

import EditorWrapper from './EditorWrapper';

const dummyContext: ContentItem = {
  source: 'github',
  repo: 'airwalk_patterns',
  owner: 'airwalk-digital',
  branch: 'another-branch',
  path: 'providers',
  reference: 'provider',
  collections: ['services'],
  file: '/test/test.mdx',
};

const dummyDefaultContext: ContentItem = {
  source: 'github',
  repo: 'airwalk_patterns',
  owner: 'airwalk-digital',
  branch: 'main',
  path: 'providers',
  reference: 'provider',
  collections: ['services'],
};

const branches = [
  {
    name: 'main',
    commit: {
      sha: '53bfd8457509778140caa47b01c6476d661f1b34',
      url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/53bfd8457509778140caa47b01c6476d661f1b34',
    },
    protected: true,
  },
  {
    name: 'branch-1',
    commit: {
      sha: '53bfd8457509778140caa47b01c6476d661f1b34',
      url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/53bfd8457509778140caa47b01c6476d661f1b34',
    },
    protected: false,
  },
  {
    name: 'branch-2',
    commit: {
      sha: '09a01dc4e148c35412d3a6a00a384930a41b813b',
      url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/09a01dc4e148c35412d3a6a00a384930a41b813b',
    },
    protected: false,
  },
  {
    name: 'branch-3',
    commit: {
      sha: '7080423b89568b0427cb781f8b753f52fbc394e0',
      url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/7080423b89568b0427cb781f8b753f52fbc394e0',
    },
    protected: false,
  },
];

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
];

const meta: Meta<typeof EditorWrapper> = {
  title: 'Components/EditorWrapper',
  component: EditorWrapper,
  tags: ['autodocs'],
  args: {
    context: dummyContext,
    defaultContext: dummyDefaultContext,
    branches,
  },
};

export default meta;

type Story = StoryObj<typeof EditorWrapper>;

const Template: Story = {
  render: ({ ...args }) => {
    return (
      <EditorWrapper
        defaultContext={args.defaultContext}
        context={args.context}
        branches={args.branches}
      />
    );
  },
};
export const Default = {
  ...Template,
  parameters: {
    msw: {
      handlers: [
        http.post(
          '/api/github/content?owner=owner&repo=repo&branch=branch&path=filePath',
          async () => {
            await delay(800);
            return HttpResponse.json({ response: 'success' }, { status: 201 });
          }
        ),
        http.get(
          '/api/github/content?owner=airwalk-digital&repo=airwalk_patterns&path=/test/test.mdx&branch=another-branch',
          async () => {
            await delay(800);
            const content = await (await fetch('/test/full-mdx.mdx')).text();
            return new HttpResponse(content, { status: 200 });
          }
        ),
        http.get('/api/content/structure', async () => {
          await delay(800);
          return HttpResponse.json(TestData);
        }),
      ],
    },
  },
};

export const CreateFailure = {
  ...Template,
  parameters: {
    msw: {
      handlers: [
        http.post(
          '/api/github/content?owner=owner&repo=repo&branch=branch&path=filePath',
          async () => {
            await delay(800);
            return HttpResponse.json(
              { response: 'Error in API' },
              { status: 500 }
            );
          }
        ),
        http.get(
          '/api/github/content?owner=airwalk-digital&repo=airwalk_patterns&path=/test/test.mdx&branch=another-branch',
          async () => {
            await delay(800);
            const content = await (await fetch('/test/full-mdx.mdx')).text();
            return new HttpResponse(content, { status: 200 });
          }
        ),
        http.get('/api/content/structure', async () => {
          await delay(800);
          return HttpResponse.json(TestData);
        }),
      ],
    },
  },
};
