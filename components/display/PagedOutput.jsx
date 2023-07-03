import React, { useState, useEffect, useRef } from 'react'
import { AppBar, Box, Toolbar, useScrollTrigger, Container, Fab, Fade, IconButton } from '@mui/material';
import { Previewer } from 'pagedjs'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';


export function PagedOutput({ children, handlePrint }) {
  const mdxContainer = useRef(null);
  const previewContainer = useRef(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    console.log('useEffect running');
    if (!rendered) {
      if (mdxContainer.current !== null) {
        const paged = new Previewer();
        const contentMdx = `${mdxContainer.current.innerHTML}`;

        // Clear the content of previewContainer
        previewContainer.current.innerHTML = '';
        paged.preview(contentMdx, ['/pdf.css'], previewContainer.current).then((flow) => {
          setRendered(true);

          // Delay the removal of the second instance of .pagedjs_pages
          setTimeout(() => {
            const pagedPages = previewContainer.current.getElementsByClassName('pagedjs_pages');
            if (pagedPages.length > 1) {
              pagedPages[0].remove();
            }
          }, 0);
        });
        
      }
    }
  }, [children]);



  return (
    <>
      <Box
        // onClick={handleClick}
        onClick={() => handlePrint()}
        role="presentation"
        sx={{ position: 'fixed', top: 16, right: 16, displayPrint: 'none' }}
      >
        <Fab size="small" aria-label="scroll back to top">
          <CloseIcon />
        </Fab>
      </Box>
      {/* <AppBar position="static">
  <Toolbar variant="dense">
  
  </Toolbar>
      </AppBar> */}
      <div id="back-to-top-anchor" sx={{ displayPrint: 'none', height: 0 }} />

      <div className="pagedjs_page" ref={previewContainer}> </div>
      <div ref={mdxContainer} style={{ display: 'none' }}>
        {children && children}
      </div>
      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top" sx={{ displayPrint: 'none' }}>
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  )


}

function ScrollTop({ children }) {
  // const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    // target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      '#back-to-top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}
