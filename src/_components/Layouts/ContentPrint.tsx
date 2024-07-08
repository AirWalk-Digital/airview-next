'use client';

import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import { Box, Fab, LinearProgress } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { Previewer } from 'pagedjs';
import React, { useEffect, useRef, useState } from 'react';

interface PagedOutputProps {
  children: React.ReactNode;
}

export default function ContentPrint({ children }: PagedOutputProps) {
  const mdxContainer = useRef<HTMLDivElement>(null);
  const previewContainer = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const router = useRouter();
  const currentPath = usePathname();

  function handleClose() {
    const pathnameArray = currentPath.split('/');

    // Replace 'print' with 'view' in the URL path
    pathnameArray[2] = 'view';

    const newPathname = pathnameArray.join('/');
    router.push(newPathname);
  }
  function handlePrint() {
    window.print();
  }

  useEffect(() => {
    const timerId = setTimeout(() => {
      const paged = new Previewer();
      const contentMdx = `${mdxContainer.current?.innerHTML}`;
      if (previewContainer.current) {
        previewContainer.current.innerHTML = '';
      }
      paged
        .preview(contentMdx, ['/pdf.css'], previewContainer.current)
        .then(() => {
          setRendered(true);
        });
    }, 5000);

    return () => clearTimeout(timerId);
  }, [children]);

  // if (!rendered) {
  //   return (
  //     <div
  //       style={{
  //         marginTop: 100,
  //         paddingLeft: 0,
  //       }}
  //     >
  //       <Box
  //         onClick={() => handleClose()}
  //         role="presentation"
  //         sx={{ position: 'fixed', top: 16, right: 16, displayPrint: 'none' }}
  //       >
  //         <Fab size="small" aria-label="scroll back to top">
  //           <CloseIcon />
  //         </Fab>
  //       </Box>
  //       <LinearProgress />
  //     </div>
  //   );
  // }

  return (
    <>
      {!rendered && (
        <div
          style={{
            marginTop: 100,
            paddingLeft: 0,
          }}
        >
          <LinearProgress />
        </div>
      )}
      <Box
        onClick={() => handleClose()}
        role='presentation'
        sx={{ position: 'fixed', top: 16, right: 16, displayPrint: 'none' }}
      >
        <Fab size='small' aria-label='scroll back to top'>
          <CloseIcon />
        </Fab>
      </Box>
      <Box
        onClick={() => handlePrint()}
        role='presentation'
        sx={{ position: 'fixed', top: 16, right: 70, displayPrint: 'none' }}
      >
        <Fab size='small' aria-label='scroll back to top'>
          <PrintIcon />
        </Fab>
      </Box>

      <div className='pagedjs_page' ref={previewContainer}>
        {' '}
      </div>
      <div ref={mdxContainer} style={{ display: 'none' }}>
        {children}
      </div>
      {/* <ScrollTop>
        <Fab
          size="small"
          aria-label="scroll back to top"
          sx={{ displayPrint: 'none' }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop> */}
    </>
  );
}

// interface ScrollTopProps {
//   children: React.ReactNode;
// }

// function ScrollTop({ children }: ScrollTopProps) {
//   const trigger = useScrollTrigger({
//     disableHysteresis: true,
//     threshold: 100,
//   });

//   const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     const anchor = (event.target.ownerDocument || document).querySelector(
//       '#back-to-top-anchor',
//     );

//     if (anchor) {
//       anchor.scrollIntoView({
//         block: 'center',
//       });
//     }
//   };

//   return (
//     <Fade in={trigger}>
//       <Box
//         onClick={handleClick}
//         role="presentation"
//         sx={{ position: 'fixed', bottom: 16, right: 16 }}
//       >
//         {children}
//       </Box>
//     </Fade>
//   );
// }
