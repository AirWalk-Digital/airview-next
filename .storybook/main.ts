import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [// "@storybook/addon-onboarding",
  "@storybook/addon-links", "@storybook/addon-essentials", // "@chromatic-com/storybook",
  // "@storybook/addon-mdx-gfm"
  "@storybook/addon-interactions", "@chromatic-com/storybook"],

  framework: {
    name: "@storybook/nextjs",
    options: {},
  },

  docs: {},

  staticDirs: ["../public"],

  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib': path.resolve(__dirname, "../src/lib"),
        '@/components': path.resolve(__dirname, "../src/_components"),
        '@/styles': path.resolve(__dirname, "../src/_styles"),
        '@/features': path.resolve(__dirname, "../src/_features"),
      };
    }

    return config;
  },

  core: {disableWhatsNewNotifications: true},

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};
export default config;
