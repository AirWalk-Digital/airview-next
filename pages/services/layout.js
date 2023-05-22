import { MDXProvider } from '@mdx-js/react'
import { theme } from '../../constants/baseTheme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { mdComponents } from "../../constants/mdxProvider";

export default function ServicesLayout({
  children, // will be a page or nested layout
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MDXProvider components={mdComponents}>
        <h1>this is wrapped by layout</h1>
      {children}
      </MDXProvider>
    </ThemeProvider>
  )
}
