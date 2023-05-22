import React, { useEffect } from "react";
import { useRouter } from "next/router";
import GlobalStyles from '@mui/material/GlobalStyles';
import { Slide } from 'airview-mdx';
import PresentationMode from "../components/PresentationMode";
import Swipeable from "../components/Swipeable";
import useEventListener from "../hooks/useEventListener";
import { useTotalPages } from "../context/TotalPagesContext";
import { useMode } from "../context/ModeContext";
import { useCurrentSlide } from "../context/CurrentSlideContext";
import { Storage } from "../hooks/useStorage";
import { MODES } from "../constants/modes";

import dynamic from 'next/dynamic'

import Zoom from '../components/Zoom';


const globalStyles = `

  body,
  html {
    overflow: auto;
    width: 100vw;
    margin: 0;
    padding: 0;
    background-color: black;
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

export default dynamic(() => Promise.resolve(PrintSlide), {
  ssr: false,
});

function PrintSlide({ children, next }) {
  // console.log('PrintSlide:children : ', children)
  let generatedSlides = [];
  let generatorCount = 0;
  // Filter down children by only Slides
  React.Children.map(children, (child) => {
    // Check for <hr> element to separate slides
    const childType = child && child.props && (child.type || []);
    if (childType && childType === "hr") {
      generatorCount += 1;
      return;
    }

    if (!Array.isArray(generatedSlides[generatorCount])) {
      generatedSlides[generatorCount] = [];
    }

    if (typeof childType !== 'function') {
      // Add slide content to current generated slide
      if (!Array.isArray(generatedSlides[generatorCount])) {
        generatedSlides[generatorCount] = [];
      }
      generatedSlides[generatorCount].push(child);
      // Check if it's a SpeakerNotes component
    } else if (childType.name !== 'SpeakerNotes') {
      // Add slide content to current generated slide
      generatedSlides[generatorCount].push(child);
    }

  });

  const pageSize = { width: 1920, height: 1080 }

  return (
    <>
      <GlobalStyles styles={globalStyles} />
      {generatedSlides.map(d => (
        <Zoom maxWidth={parseInt(pageSize.width)} width={parseInt(pageSize.width)} maxHeight={parseInt(pageSize.height)} height={parseInt(pageSize.height)} sx={{ maxWidth: '100vw', maxHeight: '100vh' }}>
          {/* // <Zoom maxWidth={parseInt(pageSize.width)} width={parseInt(pageSize.width)} maxHeight={parseInt(pageSize.height)} height={parseInt(pageSize.height)} > */}
          <div id="slide" style={{ width: pageSize.width, height: pageSize.height }}>
            <Slide>{d}</Slide>
          </div>
        </Zoom>

      ))}
    </>
  );
}
