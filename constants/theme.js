import { createTheme } from '@mui/material/styles';
import { deepmerge } from "@mui/utils";

// import { createTheme } from '@material-ui/core/styles';

// import { Roboto, Heebo } from '@next/font/google';

import "@fontsource/heebo"; // Defaults to weight 400.
import "@fontsource/roboto-mono";

// export const heebo = Heebo({
//   weight: ['300', '400', '500', '700'],
//   display: 'swap',
//   fallback: ['Helvetica', 'Arial', 'sans-serif'],
// });

let palette = createTheme({

  typography: {
    fontFamily: "Heebo",
    fontWeight: 200,
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


const theme = deepmerge(
  palette, createTheme({
    overrides: {
      MuiTypography: {
        root: {
          fontFamily: "Heebo",
          fontWeight: 200,
        }
      }
    },
  typography: {
    h1:{
      fontSize: '3rem',
      fontWeight: 200,
      lineHeight: 1.2,
      color: palette.palette.text.main,
      fontFamily: "Heebo",
      marginBottom: '1%',
      marginTop: '1%'
    },
    h2:{
      fontFamily: "Heebo",
      fontSize: '2rem',
      fontWeight: 200,
      lineHeight: 1.2,
      breakAfter: 'avoid-column',
      my: '1%',
    },
    h3: {
      margin: '0%',
      marginTop: '1%',
      marginBottom: '1%',
      breakAfter: 'avoid',
      fontSize: 'small'
    },
    h4: { margin: '0px', breakAfter: 'avoid'  },
    h5: { margin: '0px' },
    h6: { margin: '0px' },

    pre: {
      fontFamily: 'Roboto Mono',
      overFlow: 'auto',
      overflowX: 'visible',
      overflowY: 'visible',
      lineHeight: 1,
      fontSize: '1.2rem',
      textOverflow: 'ellipsis',
      backgroundColor: palette.palette.background.muted,
      pt: '1%',
      pb: '1%',
      pl: '1%',
      pr: '1%'
    },
    code: {
      fontFamily: 'Roboto Mono',
      lineHeight: 1,
      overflow: 'visible',

    },
    p: {
      breakInside: 'avoid-column',
      textAlign: 'left',
      lineHeight: 1.2,
      my: '0.5%'
    },
    ul: {
      breakInside: 'avoid-column',
      listStyleType: 'circle',
      li: {
        "::marker": {
           color: 'tertiary',
         }
      }
    },


  },
}));

export { theme };


// fontSizes: {
//   xxxsmall: '0.8rem',
//   xxsmall: '1.2rem',
//   xsmall: '1.5rem', // 24px
//   small: '1.8rem', // 28.8px
//   base: '1.2rem', // 36px
//   medium: '2rem',
//   large: '3rem', // 48px
//   xlarge: '4.5rem', // 72px
//   xxlarge: '6rem', // 96px
//   xxxlarge: '10rem' // 160px
// },

// fontWeights: {
//   default: '200',
//   light: '200',
//   strong: '400'
// },