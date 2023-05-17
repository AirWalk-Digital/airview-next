import React, { useEffect } from "react";
import { useRouter } from "next/router";
import GlobalStyles from '@mui/material/GlobalStyles';
// import Slide from "../components/Slide";
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
    height: 100vw;
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

export default dynamic(() => Promise.resolve(SlidePage), {
  ssr: false,
}); 

function SlidePage({ children, next }) {
  const {
    currentSlide,
    setSlide,
    steps,
    currentStep,
    setCurrentStep,
    clearSteps,
  } = useCurrentSlide();
  const router = useRouter();
  const totalPages = useTotalPages();
  const { mode, setMode } = useMode();

  const NEXT = [13, 32, 39];
  const PREV = 37;
  const PRESENTER = 80;
  let slideCount = 0;

  const navigate = ({ keyCode, altKey }) => {
    // Handle Presentation Mode shortcut
    if (altKey) {
      if (keyCode === PRESENTER) {
        if (mode === MODES.SPEAKER) {
          setMode(MODES.SLIDESHOW);
          router.push(
            router.pathname,
            `${router.asPath.split("?")[0]}?format=ppt&mode=${MODES.SLIDESHOW}#${currentSlide}`,
            { shallow: true }
          );
        } else {
          setMode(MODES.SPEAKER);
          router.push(
            router.pathname,
            `${router.asPath.split("?")[0]}?format=ppt&mode=${MODES.SPEAKER}#${currentSlide}`,
            { shallow: true }
          );
        }
        return false;
      }
    }

    // Handle Previous page
    if (keyCode === PREV && currentSlide === 0) {
      if (router.query && router.pathname) {
        if (router.pathname > 1) {
          router.push(`${parseInt(router.pathname, 10) - 1}?mode=${mode}#999`);
        }
      }
      return false;
    }

    // Handle next page
    if (NEXT.indexOf(keyCode) !== -1 && currentSlide === slideCount) {
      if (router.query && router.pathname && next) {
        router.push(`${next}?mode=${mode}`);
      }
      return false;
    }

    // Handle slide changes
    if (NEXT.indexOf(keyCode) !== -1) {
      // Do we have Steps inside the slide? Navigate those first
      if (steps.length > 0 && currentStep < steps.length - 1)
        return setCurrentStep((prevStep) => prevStep + 1);

      // Otherwise go to next slide

      setSlide((prevState) => {
        return prevState + 1;
      });
      clearSteps();
    } else if (keyCode === PREV) {
      // Do we have Steps inside the slide? Navigate those first
      if (steps.length > 0 && currentStep !== 0)
        return setCurrentStep((prevStep) => prevStep - 1);

      // Otherwise go to prev slide
      setSlide((prevState) => {
        // router.push(
        //   `${router.pathname}`,
        //   `${router.pathname}?mode=${mode}#${prevState - 1}`
        // );
        return prevState - 1;
      });
      clearSteps();
    }
  };

  useEffect(() => {
    router.push(
      `${router.asPath}`,
      `${router.asPath.split("?")[0]}?format=ppt&mode=${mode}#${currentSlide}`
    );
  }, [currentSlide, mode, router.pathname]);

  useEventListener("keydown", navigate);

  const swipeLeft = () => {
    navigate({ keyCode: NEXT[0] });
  };

  const swipeRight = () => {
    navigate({ keyCode: PREV });
  };

  const slideNotes = () => {
    let generatorCount = 0;
    let generatedNotes = [];
    // Filter down children by only Slides
    React.Children.map(children, (child) => {
      // Check for <hr> element to separate slides
      const childType = child && child.props && (child.type || []);
      if (childType && childType === "hr") {
        generatorCount += 1;
        return;
      }
      // Check if it's a SpeakerNotes component
      if (typeof childType === 'function' && childType.name === 'SpeakerNotes') {
        if (!Array.isArray(generatedNotes[generatorCount])) {
          generatedNotes[generatorCount] = [];
        }
        generatedNotes[generatorCount].push(child);
      }
    });
    return generatedNotes;
  };

  const renderSlide = () => {
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
      } else if ( childType.name !== 'SpeakerNotes') {
        // Add slide content to current generated slide
        generatedSlides[generatorCount].push(child);
      }
      
    });

    // Get total slide count
    slideCount = generatorCount;
    // Return current slide
    if (currentSlide === 999) {
      router.push(
        router.pathname,
        `${router.pathname}?mode=${mode}#${slideCount}`,
        { shallow: true }
      );
      setSlide(slideCount);
    }

    console.log('generatedSlides[currentSlide]: ', generatedSlides[currentSlide])
    return <Slide>{generatedSlides[currentSlide]}</Slide>;
  };
  
  const pageSize = { width:1920, height:1080}

  return (
    <Zoom maxWidth={parseInt(pageSize.width)} width={parseInt(pageSize.width)} maxHeight={parseInt(pageSize.height)} height={parseInt(pageSize.height)} sx={{maxWidth: '100vw', maxHeight: '100vh'}}>
    <Swipeable onSwipedLeft={swipeLeft} onSwipedRight={swipeRight}>
      <GlobalStyles styles={globalStyles} />
      <Storage />
      <PresentationMode mode={mode} notes={slideNotes()} currentSlide={currentSlide} >
        <div id="slide" style={{ width: pageSize.width, height: pageSize.height }}>
          {renderSlide()}
        </div>
      </PresentationMode>
    </Swipeable>
    </Zoom>
  );
}
