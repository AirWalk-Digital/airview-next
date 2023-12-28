import React, { useEffect, useState } from 'react';
import { Fab, useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


export const ScrollToBottom = () => {
    const theme = useTheme();
    const [isVisible, setIsVisible] = useState(true);
  
    useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        setIsVisible(scrollPosition + windowHeight < documentHeight);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    const handleScrollToBottom = () => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    };
  
    const handleVisibilityToggle = () => {
      if (!isVisible) return;
  
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
  
      setIsVisible(scrollPosition + windowHeight < documentHeight);
    };
  
    useEffect(() => {
      window.addEventListener('scroll', handleVisibilityToggle);
      return () => {
        window.removeEventListener('scroll', handleVisibilityToggle);
      };
    }, []);
  
    return (
      <Fab
        sx={{
          position: 'fixed',
          bottom: theme.spacing(2),
          right: '50%',
        //   transform: 'translateX(50%)',
          visibility: isVisible ? 'visible' : 'hidden',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
        //   border: '2px solid',
        //   borderColor: theme.palette.primary.main,
        //   backgroundColor: theme.palette.background.default,
        //   color: theme.palette.primary.main,
        }}
        color="primary"
        aria-label="Scroll to bottom"
        onClick={handleScrollToBottom}
      >
        <KeyboardArrowDownIcon />
      </Fab>
    );
  };