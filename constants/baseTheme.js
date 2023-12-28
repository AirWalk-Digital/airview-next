import { createTheme } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { getContrastYIQ } from "@/lib/utils/colors";

import "@fontsource/heebo"; // Defaults to weight 400.
import "@fontsource/heebo/200.css"; // Defaults to weight 400.

import "@fontsource/roboto-mono";

let palette = createTheme({
  palette: {
    primary: {
      main: "#002b3d",
    },
    secondary: {
      main: "#4AC7F0",
    },
    tertiary: {
      main: "#45BABD",
    },
    quaternary: {
      main: "#8064A9",
    },
    text: {
      main: "#004857", // text when the background is light
      invtext: "#F2F2F2", // text if the background is dark
      highlight: "#4AC7F0", // highlighted text
    },
    muted: {
      main: "#BDBDBD",
    },
    white: {
      main: "#FFFFFF",
    },
    background: {
      paper: "#fff",
      primary: "#002b3d",
      secondary: "#4AC7F0",
      tertiary: "#45BABD",
      quaternary: "#8064A9",
      highlight: "#F26419",
      accent: "#33658A",
      muted: "#BDBDBD",
    },
  },
});

const baseTheme = deepmerge(
  palette,
  createTheme({
    overrides: {
      MuiTypography: {
        root: {
          fontFamily: "Heebo",
          fontWeight: 200,
          // fontSize: '2rem',
          color: palette.palette.text.main,
        },
      },
    },
    typography: {
      fontFamily: "Heebo",
      fontWeight: 200,
      fontWeightBold: 400,
      fontWeightLight: 100,
      fontWeightRegular: 200,
      fontSize: 14,
      h1: {
        fontWeight: 200,
        lineHeight: 1.2,
        fontFamily: "Heebo",
        marginBottom: "1%",
        marginTop: "1%",
        paddingTop: "5px",
        paddingBottom: "5px",
        marginLeft: "-25px",
        marginRight: "-25px",
        paddingLeft: "25px",
        page: "no-chapter",
        breakBefore: "always",
        fontSize: "3rem",
      },
      h2: {
        fontFamily: "Heebo",
        fontWeight: 200,
        lineHeight: 1.2,
        breakAfter: "avoid-column",
        my: "1%",
        fontSize: "2rem",
      },
      h3: {
        margin: "0%",
        marginTop: "1%",
        marginBottom: "1%",
        breakAfter: "avoid",
        fontSize: "1.7rem",
      },
      h4: { margin: "0px", breakAfter: "avoid", fontSize: "1.5rem" },
      h5: { margin: "0px", fontSize: "1.5rem"  },
      h6: { margin: "0px", fontSize: "1.5rem"  },
      body1: {
        color: palette.palette.text.main,
      },
      body2: {
        color: palette.palette.text.main,
      },

      pre: {
        fontFamily: "Roboto Mono",
        overFlow: "visible",
        overflowX: "visible",
        overflowY: "visible",
        lineHeight: 1,
        textOverflow: "ellipsis",
        display: "inline",
        backgroundColor: palette.palette.background.muted,
        pt: "1%",
        pb: "1%",
        pl: "1%",
        pr: "1%",
      },
      code: {
        fontFamily: "Roboto Mono",
        lineHeight: 1,
        overflow: "visible",
        whiteSpace: "pre-wrap",
        display: "inline",
      },
      p: {
        fontFamily: "Heebo",
        breakInside: "avoid-column",
        textAlign: "left",
        lineHeight: 1.2,
        marginTop: "0.5%",
        marginBottom: "0.5%",
        color: palette.palette.text.main,
        display: "block",
      },
      img: {
        height: "100%",
      },
      strong: {
        fontWeight: 400,
        color: palette.palette.text.highlight,
      },
      ul: {
        display: "inline-block",
        breakInside: "avoid-column",
        listStyleType: "circle",
        li: {
          listStylePosition: "inside",
          "::marker": {
            color: "tertiary",
          },
          span: {
            display: "inline",
          },
        },
      },
      table: {
        display: "inline-table",
        width: "100%",
        border: "1px solid",
        borderRadius: "5px",
        borderSpacing: "0",
        borderCollapse: "separate",
        borderColor: palette.palette.background.primary,
        overflow: "hidden",
        marginBottom: "2%",
        marginTop: "2%",
        thead: {
          backgroundColor: palette.palette.background.primary,
          fontWeight: "200",
          textAlign: "left",
          color: getContrastYIQ(palette.palette.background.primary, palette),
          tr: {
            borderRight: "10px solid",
            th: {
              ":not(:last-child)": {
                borderRight: "1px solid",
              },
              paddingLeft: "1%",
              paddingRight: "1%",
              paddingTop: "0.5%",
              paddingBottom: "0.5%",
            },
          },
        },
        td: {
          paddingLeft: "1%",
          paddingRight: "1%",
          ":not(:last-child)": {
            borderRight: "1px solid",
          },
          borderBottom: "0.5px solid lightgray",
          color: palette.palette.text.main,
        },
      },
      blockquote: {
        marginTop: "10px",
        marginBottom: "10px",
        marginLeft: "50px",
        paddingLeft: "15px",
        borderLeft: "3px solid #ccc",
        display: 'block'
      },
    },
  })
);

export { baseTheme };
