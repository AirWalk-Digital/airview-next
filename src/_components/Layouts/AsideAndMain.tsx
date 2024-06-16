import { Box, Container as MuiContainer } from '@mui/material';
import type { CSSProperties, ReactNode } from 'react';
import React from 'react';

interface Props {
  children: ReactNode;
  sx?: CSSProperties;
}

export function AsideAndMainContainer({ children, sx }: Props) {
  return (
    <MuiContainer
      maxWidth={false}
      sx={{ paddingTop: 0, paddingBottom: 6, ...sx }}
    >
      <Box sx={{ display: 'flex' }}>{children}</Box>
    </MuiContainer>
  );
}

export function Main({ children, sx }: Props) {
  return (
    <Box component='main' sx={{ flex: '1 1 auto', ...sx }}>
      {children}
    </Box>
  );
}

export function Aside({ children, sx }: Props) {
  return (
    <Box
      component='aside'
      sx={{
        flex: '0 0 auto',
        width: 300,
        displayPrint: 'none',
        pt: '2%',
        paddingLeft: 4,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
