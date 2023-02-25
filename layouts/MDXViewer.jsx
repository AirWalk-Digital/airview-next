import React from "react";
import GlobalStyles from '@mui/material/GlobalStyles';
import PresentationMode from "../components/PresentationMode";
import Swipeable from "../components/Swipeable";
import { Storage } from "../hooks/useStorage";

import dynamic from 'next/dynamic'

import Zoom from '../components/Zoom';
import Box from '@mui/material/Box';


const globalStyles = `

  body,
  html {
    overflow: auto;
    width: 100vw;
    height: 100vw;
    margin: 0;
    padding: 0;
    background-color: grey;
  }

  @media print {
    @page {
      margin: 0mm 0mm 0mm 0mm;
      size: 1280px 1080px;
    }
  }

  #slide {
    display: flex;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
  }

`;

export default dynamic(() => Promise.resolve(MDXViewer), {
  ssr: false,
});

function MDXViewer({ children, next }) {

  // const pageSize = { width:1920, height:1080}

  return (
    <Box sx={{width:'800px', p: '5%', backgroundColor: 'background.paper', mx: 'auto' }}>
      <GlobalStyles styles={globalStyles} />
      {children}
    </Box>
  );
}
