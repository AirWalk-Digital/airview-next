import React, { useState, useEffect } from 'react'
import { Box, Fab } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
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
  const [ printView , setPrintView ] = useState(false);
  const [ viewType, setViewType ] = useState('SlidePage')

  const handlePrint = () => {
    if (!printView) {
      setViewType('PrintSlide')
    } else {
      setViewType('SlidePage')
    }
    setPrintView(!printView)

};


  useEffect(() => {
    const { mdxContent, frontmatter } = useMDX(content, 'mdx', viewType);
    setContent({ content: mdxContent, frontmatter: frontmatter });
  }, [content, viewType])

  if (pageContent.content && pageContent.frontmatter) {
    const Content = pageContent.content;
    return (
      <>
        <Box onClick={() => handlePresentation()} role="presentation" sx={{ position: 'fixed', top: 16, right: 16, displayPrint: 'none', zIndex: 9999 }}>
          <Fab size="small">
            <CloseIcon />
          </Fab>
        </Box>
        <Box onClick={() => handlePrint()} role="presentation" sx={{ position: 'fixed', top: 16, right: 80, displayPrint: 'none', zIndex: 9999 }}>
          <Fab size="small">
            <PrintIcon />
          </Fab>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" sx={{width: '90%', height: '90%', ml: '5%', mt: '5%'}}>
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
