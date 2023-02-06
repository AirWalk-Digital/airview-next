import React from 'react'
import { ThemeProvider as TP, createTheme } from '@mui/material/styles';

const theme = createTheme({
  colors: {
    primary: '#0070f3',
  },
})

export const ThemeProvider = ({ children }) => {
  return <TP theme={theme}>{children}</TP>
}

export default ThemeProvider
