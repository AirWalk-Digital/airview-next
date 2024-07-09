// components/Editor.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { type MDXEditorMethods } from '@webtech0321/mdx-editor-collab';
import React, { useRef } from 'react';

import { Editor } from '@/components/Editor';
import type { ContentItem } from '@/lib/Types';

const dummyContext: ContentItem = {
  source: 'github',
  repo: 'dummy_patterns',
  owner: 'dummy-digital',
  branch: 'another-branch',
  path: 'providers',
  reference: 'provider',
  collections: ['services'],
};

const dummyDefaultContext: ContentItem = {
  source: 'github',
  repo: 'dummy_patterns',
  owner: 'dummy-digital',
  branch: 'main',
  path: 'providers',
  reference: 'provider',
  collections: ['services'],
};

const meta: Meta<typeof Editor> = {
  title: 'Components/Editor',
  component: Editor,
  tags: ['autodocs'],
  args: {
    context: dummyContext,
    defaultContext: dummyDefaultContext,
    enabled: true,
    colabID: '12345',
    top: 0,
    editorSaveHandler: fn(async () => {
      return Promise.resolve('successfully saved file');
    }),
    imageUploadHandler: async () => {
      // console.log('Image upload handler called with image:', image);
      return Promise.resolve('https://picsum.photos/200/300?grayscale');
    },
    imagePreviewHandler: async () => {
      // console.log('Image preview handler called with source:', imageSource);
      return Promise.resolve(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAYCAYAAABurXSEAAAAAXNSR0IArs4c6QAAAGJlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAABJKGAAcAAAASAAAAUKABAAMAAAABAAEAAKACAAQAAAABAAAALaADAAQAAAABAAAAGAAAAABBU0NJSQAAAFNjcmVlbnNob3QGyMkKAAAB1GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yNDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj40NTwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlVzZXJDb21tZW50PlNjcmVlbnNob3Q8L2V4aWY6VXNlckNvbW1lbnQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgq7qfQQAAADGUlEQVRYCWP8DwQMQwwwDTH3gp076mh6xdpoSA+7kH795g3DspWrGV68eAn229Vr18H8P3/+kO5XUJGHDeQWlfxX0zHAJvX/y5cv/wUlZP5390/EKo9N8PSZs2A9Bw4eAktPnDINzP/27Rs25XjFcKbpf3//Mnz/8QNrKABNBIv/+/cPqzytBXE6mtYWU2I+1Rz9+fMXhsbWdgZTa3sGOVVNBmDyYrhz9y5Jbtuzbz9DXFIqg5CkLIOtsxtDc3snw/fv3zHMoIqj/wKTUnpOHgMwnTLYWFkyJCfEMezavZchIDSS4e27dxiWYhM4dOQoQ1h0HMNtoEfLiwsZtDU1GfonTWFIz85jAJmPDFiQOehsYIYDWhyBLszw+/dvFLEdu/cw7Ni1m2HGlIkMYcFBYLmQwABwaM1dsIihrKgART02TnF5FYOCvBzDzs0bGfj4eMFKdLS1GOqaWhgOHDrM4OzoANdGMKQ5ODgY0DEnJyfcABDj/IWLYL6CnBzDhUuXwfg3tCg7ceoUilpsHFDg3L13jyEqIhzuYJC62OhIsPJLl6+gaMMb0jw8PAwrFi9A0QDigCwBpVsYOHfhApjp4RcIE4LTV69eh7NxMe49eACWUpSXR1HCz8fHAHLDrdt3UMTxOhpFJR6OproGw4GDhxluX73IwMSEGnnofGzGyEhLg4WfPX+OIg3KhKAAAiUbZIBqA7IMCWx9PR2w6mvXbzAICgjA8aHDRxjOnD1H0CQhQUEGKUlJhg2btwDzC6KG3L5zN1ivjo42ihlUcbSHqyuDupoqQ3RCMsO0mbMZtmzfwZBTUMSQmJbJ8ODhIxQLcXGqykvBeSMxLZ1h3YZNDBMmT2VIycxmMDTQZ3Cyt0PRhjN5MKJFM7IuRkZGMBdGg3L7qqWLGEoraxhqGprAcqC02FBTxZAUH4uslYEBTS/MjKjwUIavX78yzJo7H+xYkCYvDzeGvs4OBvSMzwiq5FFNpYz3C1gcfvzwkUFYWAgjfRNr8vsPHxh4gZ5mYcEeplR3NLEOo0QdVdI0JQ4gR++oo8kJNXL0AADsUIxP1kwKcwAAAABJRU5ErkJggg=='
      );
    },
  },
};

export default meta;

type Story = StoryObj<typeof Editor>;

const Template: Story = {
  render: (args, { loaded: { mdx } }) => {
    const editorRef = useRef<MDXEditorMethods | null>(null);
    return (
      <Editor
        markdown={mdx}
        editorRef={editorRef}
        context={args.context}
        defaultContext={args.defaultContext}
        editorSaveHandler={args.editorSaveHandler}
        imageUploadHandler={args.imageUploadHandler}
        imagePreviewHandler={args.imagePreviewHandler}
        enabled={args.enabled}
        top={args.top}
        colabID={args.colabID}
        // {...args}
        // other props you might need to pass
      />
    );
  },
};
export const Default = {
  ...Template,
};

Default.loaders = [
  async () => ({
    mdx: await (await fetch('/test/full-mdx.mdx')).text(),
  }),
];

export const MinimalMDX = {
  ...Template,
};
MinimalMDX.loaders = [
  async () => ({
    mdx: await (await fetch('/test/short-mdx.mdx')).text(),
  }),
];

export const SameBranch = {
  ...Template,
  args: {
    context: dummyDefaultContext,
  },
};
SameBranch.loaders = [
  async () => ({
    mdx: await (await fetch('/test/short-mdx.mdx')).text(),
  }),
];

export const APIFailure = {
  ...Template,
};
APIFailure.loaders = [
  async () => ({
    mdx: await (await fetch('/test/full-mdx.mdx')).text(),
  }),
];
APIFailure.args = {
  editorSaveHandler: fn(async () => {
    return Promise.reject(new Error('failed to save file'));
  }),
  // markdown will be dynamically loaded by the loader
};
