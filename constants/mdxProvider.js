import React from "react";
import { useEffect, useState, useRef } from 'react';

// import { MDXProvider } from "@mdx-js/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import okaidia from "react-syntax-highlighter/dist/cjs/styles/prism/okaidia";
import SlidePage from "../layouts/SlidePage";
import PrintSlide from "../layouts/PrintSlide";
import MDXViewer from "../layouts/MDXViewer";
import Image from "next/image";

// fix for Roadmap, Nest
import { TitleSlide, Header, Banner, Footer, Insights, Chevrons, Nest, Roadmap, Layout, Column, Item, Slide, HeaderCard } from 'airview-mdx'

// import Cover from "./Cover";
import SpeakerNotes from "@/components/presentations/SpeakerNotes";
import Step from "@/components/presentations/Step";
import Steps from "@/components/presentations/Steps";
import { motion } from "framer-motion";

// MUI Components

// import Card from '@material-ui/core/Card';
// import CardContent from '@material-ui/core/CardContent';
// import CardHeader from '@material-ui/core/CardHeader';
import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';

// Custom components

// import { Insight, InsightTable, ChevronProcessTable, StatementBanner, Roadmap } from './Playback';
// import {FaIcon, Icon} from './Images.jsx';
import { FaIcon, Icon } from 'airview-mdx';
import { ProgressTable } from '../components/Tables.jsx';
// import { HeaderCard, Nest } from './Cards';
// import { HeaderCard } from './Cards';
// import { Font } from './Styling';
// Layouts 
// import {Layout, Column, Item } from './Layouts';

import path from 'path';
import { Dialog, DialogContent, DialogActions, Button, Box} from '@mui/material';




function MdxImage({ props, baseContext }) {
  let src = props.src;

  if (baseContext.source === 'local' && baseContext.router.asPath && src.slice(0, 2) === './') { // relative 
    src = src.replace('./', '/');
    src = '/api/files/get-binary?filePath=' + baseContext.router.asPath + src;
  } else if (baseContext.source === 'local' && baseContext.router.asPath && src.slice(0, 1) === '/') { //file is an absolute path (public directory)
    src = src
  } else if (baseContext.source === 'github') {
    // strip off leading / if present
    src = src.replace('./', '');
    if (src.slice(0, 1) === '/') { src = src.slice(1) };
    // get directory from the file path
    let dir = path.dirname(baseContext.file)
    src = dir + '/' + src;

    src = '/api/content/' + baseContext.owner + '/' + baseContext.repo + '?path=' + src + '&branch=' + baseContext.branch;

  } else {
    src = '/image-not-found.png';
  };


  // Custom hook for getting window size
  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    console.log('useWindowSize:size', size)
    return size;
  }
  function useContainerSize() {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
  
    useEffect(() => {
      function updateSize() {
        setSize({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight
        });
      }
      window.addEventListener('resize', updateSize);
      updateSize();
  
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    console.log('useContainerSize:ref', ref)
    return [size, ref];
  }



  function ImageComponent({ src, alt }) {

    

    const [open, setOpen] = useState(false);
    const [width, height] = useWindowSize();
    const [containerSize, containerRef] = useContainerSize();

    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleImageLoad = (event) => {
      console.log('handleImageLoad:event', event.target)
      const { naturalWidth, naturalHeight } = event.target;
      setImageSize({ width: naturalWidth, height: naturalHeight });
    };
    
    return (
      <>
 
        <Box
        ref={containerRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '70%',
            maxHeight: '70%',
            cursor: 'zoom-in',
            margin: 'auto'
          }}
          onClick={handleClickOpen}
        >
          <img
            src={src}
            alt={alt}
            onLoad={handleImageLoad}
            maxWidth={containerSize.width * 0.7}
            // height={imageSize.height}
          />
        </Box>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth={true}
          maxWidth="90%"
        >
           <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
         
          <DialogContent sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            margin: 'auto'
          }}>
            <img src={src} alt={alt}/>
          </DialogContent>
        </Dialog>
      </>
    );
  }



  return (
    <ImageComponent src={src} alt={props.alt} />
  )

}







// export const mdComponents = {
export const mdComponents = (baseContext) => ({
  h1: (props) => <Typography variant="h1">{props.children}</Typography>,
  h2: (props) => <Typography variant="h2">{props.children}</Typography>,
  h3: (props) => <Typography variant="h3">{props.children}</Typography>,
  h4: (props) => <Typography variant="h4">{props.children}</Typography>,
  h5: (props) => <Typography variant="h5">{props.children}</Typography>,
  p: (props) => <Typography variant="p">{props.children}</Typography>,
  img: (props) => (<MdxImage props={props} baseContext={baseContext} fill loading="lazy" />),
  strong: (props) => <Typography variant="strong">{props.children}</Typography>,
  ul: (props) => <Typography variant="ul">{props.children}</Typography>,
  table: (props) => <Typography variant="table">{props.children}</Typography>,
  pre: (props) => props.children,
  code: (props) => {
    const { className } = props;
    const language = className?.replace("language-", "");
    return (
      <SyntaxHighlighter
        className={className}
        language={language}
        style={okaidia}
        customStyle={{ overflow: 'clip', fontSize: '0.75rem' }}
        {...props}
      />
    );
  },
  // layouts
  SlidePage,
  PrintSlide,
  MDXViewer,
  SpeakerNotes,
  Step,
  Steps,
  // Cover,
  motion,
  // MUI Components
  // CardHeader,
  // CardContent,
  // Card,
  Alert,
  // custom component
  Header,
  Banner,
  Footer,
  Insights, Chevrons, Nest, Roadmap,
  // InsightTable, Insight, Chevrons, ChevronProcessTable, StatementBanner, Roadmap,
  FaIcon, Icon,
  ProgressTable,
  HeaderCard, Nest,
  // Font,
  // layouts
  TitleSlide,
  Layout, Column, Item
});

// export default ({ children }) => (
//   <MDXProvider components={mdComponents}>{children}</MDXProvider>
// );
