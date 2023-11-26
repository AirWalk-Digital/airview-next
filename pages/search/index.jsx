import React, { useState } from 'react'
import { Chatbot } from '@/components/chatbot';
import { baseTheme } from '../../constants/baseTheme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TopBar } from '@/components/appbar';
import Box from '@mui/material/Box';

export default function Home() {

  const navDrawerWidth = 300;
  const topBarHeight = '65px';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <TopBar onNavButtonClick={null}
        navOpen={false}
        menu={false}
        topBarHeight={topBarHeight} />

      <Box sx={{ mt: topBarHeight, pl: menuOpen ? navDrawerWidth : 0 }}>
        <Chatbot />
      </Box>
    </ThemeProvider>
  );
}
