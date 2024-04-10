import React from 'react';
import { Chatbot } from '@/features/Chatbot';
// eslint-disable-next-line import/extensions
import { TopBar } from '@/components/Layouts';
import Box from '@mui/material/Box';

export default function Home() {
  const navDrawerWidth = 300;
  const topBarHeight = '65px';

  const menuOpen = false;

  return (
    <main>
      <TopBar navOpen={false} logo={true} menu={false} />
      <Box sx={{ mt: topBarHeight, pl: menuOpen ? navDrawerWidth : 0 }}>
        <Chatbot />
      </Box>
    </main>
  );
}
