import React from "react";
import GlobalStyles from '@mui/material/GlobalStyles';
import PresentationMode from "@/components/presentations/PresentationMode";
import Swipeable from "@/components/presentations/Swipeable";
import { Storage } from "../../hooks/useStorage";

import dynamic from 'next/dynamic'

import Zoom from '@/components/presentations/Zoom';
import Box from '@mui/material/Box';


const globalStyles = `

  body,
  html {
    overflow: auto;
    width: 100vw;
    margin: 0;
    padding: 0;
    background-color: grey;
  }

  @print {
    @top-left {
      background: #4AC7F0;
      content: '';
      display: block;
      height: .05cm;
      opacity: .5;
      width: 100%; }
    @top-center {
      background: #4AC7F0;
      content: '';
      display: block;
      height: .05cm;
      opacity: .5;
      width: 100%; }
    @top-right {
      content: string(heading);
      font-size: 9pt;
      height: 1cm;
      vertical-align: middle;
      width: 100%; }
    @bottom-center {
      background: #4AC7F0;
      content: '';
      display: block;
      height: .05cm;
      opacity: .5;
      width: 100%; }
    @bottom-right {
      background: #4AC7F0;
      content: counter(page);
      height: 1cm;
      text-align: center;
      width: 1cm; }
   }
  
  @page :blank {
    @top-left {
      background: none;
      content: ''; }
    @top-center {
      content: none; }
    @top-right {
      content: none; } }
  
  @page no-chapter {
    /* @top-left {
      background: none;
      content: none; }
    @top-center {
      content: none; } */
    @top-right {
      content: none; } }
  
  @print :first {
    background: url(../../../../backgrounds/airwalk-header.png) no-repeat;
    /* background-image: url(/backgrounds/airwalk-header.png) no-repeat; */
    background-size: cover;
    margin: 0; }
  
  @print {
    /* background: url(../../../../airwalk/Airwalk-Logo-Blue.png) no-repeat; */
    background: url(/airwalk/Airwalk-Logo-Blue.png) no-repeat;
    background-position: left -10px bottom -50px;
    background-size: 140px;
    padding-top: 20px;
    padding-bottom: 15px;
    z-index: -1000 ;   
    size: A4;
    }
  
  @page chapter {
    background: #002b3d;
    margin: 0;
    /* @top-left {
      content: none; }
    @top-center {
      content: none; } */
    @top-right {
      content: none; } }

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
  const pageSize = { width:2480, height:3508}

  // 2480 x 3508 A4

  return (
    <Zoom maxWidth={parseInt(pageSize.width)} width={parseInt(pageSize.width)} maxHeight={parseInt(pageSize.height)} height={parseInt(pageSize.height)} sx={{maxWidth: '100vw', maxHeight: '100vh'}}>

    <Box sx={{width:'2480px',minHeight: '3508px', px: "25px", pt: '20px', backgroundColor: 'background.paper', position:'relative'}}>
      <GlobalStyles styles={globalStyles} />
      {children}
    </Box>
    </Zoom>
  );
}
