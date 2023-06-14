import React from 'react';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

const FullScreenSpinnerWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 9999,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

export const FullScreenSpinner = () => {
  return (
    <FullScreenSpinnerWrapper>
      <CircularProgress color="primary" />
    </FullScreenSpinnerWrapper>
  );
};

