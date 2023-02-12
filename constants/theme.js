import { createTheme } from '@mui/material/styles';
// import { createTheme } from '@material-ui/core/styles';

// import { Roboto, Heebo } from '@next/font/google';

import "@fontsource/heebo"; // Defaults to weight 400.

// export const heebo = Heebo({
//   weight: ['300', '400', '500', '700'],
//   display: 'swap',
//   fallback: ['Helvetica', 'Arial', 'sans-serif'],
// });

const theme = createTheme({
  typography: {
    fontFamily: "Heebo",
  },
  palette: {
    primary: {
      main: "#002b3d",
    },
    secondary: {
      main: '#4AC7F0'
    },
    tertiary: {
      main: '#45BABD'
    },
    quaternary: {
      main: '#8064A9'
    },
    text: {
      main: '#004857', // text when the background is light
      invtext: '#F2F2F2', // text if the background is dark
    },
    muted: {
      main: '#BDBDBD'
    },
    background: {
      paper: '#fff',
      primary: "#002b3d",
      secondary: '#4AC7F0',
      tertiary: '#45BABD',
      quaternary: '#8064A9',
      highlight: '#F26419',
      accent: '#33658A',
      muted: '#BDBDBD'
    },
  },
});

export { theme };
