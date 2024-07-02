import React from 'react';
import type { Preview } from '@storybook/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { initialize, mswLoader } from 'msw-storybook-addon';
// import { baseTheme } from '@/styles/baseTheme';
import { baseTheme } from '../src/_styles/baseTheme';
// import theme from './theme';
initialize();
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*|^handle*' },
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader], // 👈 Add the MSW loader to all stories
  decorators: [
    (Story) => (
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={baseTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </AppRouterCacheProvider>
    ),
  ],
};

export default preview;
