import React, { useState, useLayoutEffect, useRef } from 'react'
import { getContent } from '../components/utils/mdxContent';
import { Header, Banner, Footer } from '../components/HeaderFooter';
import Box from '@mui/material/Box';
import Image from 'next/image';


export const DefaultLayout = ({ children, sx = {} }) => {
  let banner = '';
  let background = 'image1.jpeg'
  let header = getContent('h1', children); //just match h1 for the heading
  children = header.children;
  if (header.element) { // there must be a header to have a banner
    banner = getContent('h2', header.children)
    children = banner.children;
  }; // h2 text after the heading
  const ref = useRef(null)
  const [height, setHeight] = useState(0)
  let divHeight = 1024 - 80 + 15 - 60 + 20

  if (!header.element) {divHeight = divHeight + 80 + 15}
  
  useLayoutEffect(() => {
    setHeight(ref.current?.clientHeight || 0);
  });
  
  return (
    <>
      <Image alt='background' src={'/backgrounds/' + background} fill style={{zIndex: '-1'}}/>

      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", py: "0", height: '100%', ...sx }} >

        {header.element && <Header heading={header.element} sx={{ backgroundColor: 'white' }} />}
        <div ref={ref}>
        {banner.element && <Banner text={banner.element} />}
        </div>
        {/* <Box sx={{ display: "flex", flexDirection: "column", py: '20px', overflow: 'hidden'}} > */}

        <Box sx={{ display: "flex", flexDirection: "column", px: "25px", pt: '20px', overflow: 'hidden', height: divHeight - height }} >
          {children}
        </Box>
        <Footer />
      </Box>
    </>
  );
};
