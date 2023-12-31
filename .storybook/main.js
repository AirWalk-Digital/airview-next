/** @type { import('@storybook/nextjs').StorybookConfig } */
import * as path from 'path';

const config = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {
      image: {
        loading: 'eager',
      },
      nextConfigPath: path.resolve(__dirname, '../next.config.js'),
    },
    },
  docs: {
    autodocs: "tag",
  },
  staticDirs: [
    {
      from: '../public',
      to: '/'
    },
    '../stories/assets',
  ],
};
export default config;
