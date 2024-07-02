import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { getContrastYIQ } from './lib/colors';

import '@fontsource/heebo'; // Defaults to weight 400.
import '@fontsource/heebo/200.css'; // Defaults to weight 400.

import '@fontsource/roboto-mono';

const palette = createTheme({
  // typography: {
  //   fontFamily: "Heebo",
  //   fontWeight: 200,
  //   fontSize: '2rem',

  // },

  palette: {
    primary: {
      main: '#002b3d',
    },
    secondary: {
      main: '#4AC7F0',
    },
    tertiary: {
      main: '#45BABD',
    },
    quaternary: {
      main: '#8064A9',
    },
    text: {
      main: '#004857', // text when the background is light
      invtext: '#F2F2F2', // text if the background is dark
      highlight: '#4AC7F0', // highlighted text
    },
    muted: {
      main: '#BDBDBD',
    },
    background: {
      paper: '#fff',
      primary: '#002b3d',
      secondary: '#4AC7F0',
      tertiary: '#45BABD',
      quaternary: '#8064A9',
      highlight: '#F26419',
      accent: '#33658A',
      muted: '#BDBDBD',
    },
  },
});

const theme = deepmerge(
  palette,
  createTheme({
    overrides: {
      MuiTypography: {
        root: {
          fontFamily: 'Heebo',
          fontWeight: 200,
          // fontSize: '2rem',
          color: palette.palette.text.main,
        },
      },
    },
    typography: {
      fontFamily: 'Heebo',
      fontWeight: 200,
      fontWeightBold: 400,
      fontWeightLight: 100,
      fontWeightRegular: 200,
      fontSize: 20,
      h1: {
        fontSize: '2.5rem',
        fontWeight: 200,
        lineHeight: 1.2,
        color: getContrastYIQ(palette.palette.background.secondary, palette),
        fontFamily: 'Heebo',
        marginBottom: '1%',
        marginTop: '1%',
        paddingTop: '5px',
        paddingBottom: '5px',
        background: palette.palette.background.secondary,
        marginLeft: '-25px',
        marginRight: '-25px',
        paddingLeft: '25px',
        page: 'no-chapter',
        breakBefore: 'always',
      },
      h2: {
        fontFamily: 'Heebo',
        fontSize: '2.5rem',
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
        fontSize: '2rem',
      },
      h4: { margin: '0px', breakAfter: 'avoid', fontSize: '1.8rem' },
      h5: { margin: '0px' },
      h6: { margin: '0px' },
      body1: {
        color: palette.palette.text.main,
      },
      body2: {
        color: palette.palette.text.main,
      },

      pre: {
        fontFamily: 'Roboto Mono',
        overFlow: 'visible',
        overflowX: 'visible',
        overflowY: 'visible',
        lineHeight: 1,
        fontSize: '1rem',
        textOverflow: 'ellipsis',
        backgroundColor: palette.palette.background.muted,
        pt: '1%',
        pb: '1%',
        pl: '1%',
        pr: '1%',
      },
      code: {
        fontFamily: 'Roboto Mono',
        lineHeight: 1,
        fontSize: '1rem',
        overflow: 'visible',
      },
      p: {
        fontFamily: 'Heebo',
        breakInside: 'avoid-column',
        textAlign: 'left',
        fontSize: '1.5rem', // 24px
        lineHeight: 1.2,
        marginTop: '0.5%',
        marginBottom: '0.5%',
        color: palette.palette.text.main,
        display: 'block',
      },
      img: {
        height: '100%',
      },
      strong: {
        fontWeight: 400,
        color: palette.palette.text.highlight,
      },
      ul: {
        display: 'inline-block',
        breakInside: 'avoid-column',
        listStyleType: 'circle',
        li: {
          listStylePosition: 'inside',
          '::marker': {
            color: 'tertiary',
          },
          span: {
            display: 'inline',
          },
        },
      },
      table: {
        display: 'inline-table',
        width: '100%',
        border: '1px solid',
        borderRadius: '10px',
        borderSpacing: '0',
        borderCollapse: 'separate',
        overflow: 'hidden',
        marginBottom: '2%',
        marginTop: '2%',
        thead: {
          backgroundColor: palette.palette.background.secondary,
          fontWeight: '200',
          color: getContrastYIQ(palette.palette.background.secondary, palette),
          tr: {
            fontSize: '1.5rem',
            borderRight: '10px solid',
            th: {
              ':not(:last-child)': {
                borderRight: '1px solid',
              },
            },
          },
        },
        td: {
          paddingLeft: '1%',
          paddingRight: '1%',
          ':not(:last-child)': {
            borderRight: '1px solid',
          },
          color: palette.palette.text.main,
        },
      },
    },
  })
);

// eslint-disable-next-line import/prefer-default-export
export { theme };
