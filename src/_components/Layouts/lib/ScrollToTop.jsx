import React, { useEffect, useState } from 'react';
import { useTheme, Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTop = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Fab
      sx={{
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        visibility: isVisible ? 'visible' : 'hidden',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
      }}
      color='primary'
      aria-label='Scroll to top'
      onClick={handleScrollToTop}
    >
      <KeyboardArrowUpIcon />
    </Fab>
  );
};

export default ScrollToTop;
