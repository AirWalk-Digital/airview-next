import React, { useState, useEffect } from 'react'
import { Box, Fab } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CloseIcon from '@mui/icons-material/Close';
import dynamic from 'next/dynamic'
import { FullScreenSpinner } from '@/components/dashboard/index.js';
import { useMDX } from '@/lib/content/mdx'
import { theme } from '../../constants/theme';
import { CurrentSlideProvider } from "../../context/CurrentSlideContext";
import { ModeProvider } from "../../context/ModeContext";

export const PresentationOutput = dynamic(() => Promise.resolve(PresentationOutputPage), {
  ssr: true,
});


function PresentationOutputPage({ children, handlePresentation, refresh = false, content }) {
  const [pageContent, setContent] = useState({ content: undefined, frontmatter: undefined });

  useEffect(() => {
    const { mdxContent, frontmatter } = useMDX(content, 'mdx', 'SlidePage');
    setContent({ content: mdxContent, frontmatter: frontmatter });
  }, [content])

  if (pageContent.content && pageContent.frontmatter) {
    const Content = pageContent.content;
    return (
      <>
        <Box onClick={() => handlePresentation()} role="presentation" sx={{ position: 'fixed', top: 16, right: 16, displayPrint: 'none', zIndex: 9999 }}>
          <Fab size="small">
            <CloseIcon />
          </Fab>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" sx={{maxWidth: '100vw', maxHeight: '100%'}}>
          {/* <div> */}
            <CurrentSlideProvider>
              <ModeProvider>
                <ThemeProvider theme={theme}>
                  <CssBaseline />
                  <Content />
                </ThemeProvider>
              </ModeProvider>
            </CurrentSlideProvider>
          {/* </div> */}
        </Box>
      </>
    )
  } else {

    return (
      <FullScreenSpinner />
    )
  }

}
