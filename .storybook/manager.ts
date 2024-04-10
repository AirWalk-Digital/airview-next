import { addons } from '@storybook/manager-api';
import customTheme from './theme.js';

addons.setConfig({
  theme: customTheme,
});