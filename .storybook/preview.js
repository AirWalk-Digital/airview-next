/** @type { import('@storybook/react').Preview } */

import { ThemeProvider } from "@mui/material/styles";
import { baseTheme } from "../constants/baseTheme";
import CssBaseline from "@mui/material/CssBaseline";
import { addDecorator } from "@storybook/react";

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={baseTheme}>
        <CssBaseline /> <Story />
      </ThemeProvider>
    ),
  ],
};


export default preview;
