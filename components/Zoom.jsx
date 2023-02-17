import {useRef, useLayoutEffect, useEffect, useState, useCallback} from 'react';
import Box from '@mui/material/Box';

// import PropTypes from 'prop-types';

const isNumber = value => (value !== null) && !isNaN(value);

const useResizeObserver = () => {
    const [observerEntry, setObserverEntry] = useState([undefined, undefined]);
    const [node, setNode] = useState(null);
    const observer = useRef(null);
  
    const disconnect = useCallback(() => observer.current?.disconnect(), []);
    const observe = useCallback(() => {
      observer.current = new ResizeObserver(([entry]) => {
        setObserverEntry([entry.contentRect.width, entry.contentRect.height]);
      });
      if (node) {
        observer.current.observe(node);
      }
    }, [node]);
  
    useLayoutEffect(() => {
      observe();
      return () => disconnect();
    }, [disconnect, observe]);
  
    return [setNode, ...observerEntry];
  };
  

const getTargetSize = (ref, width, height, aspectRatio) => {
  if (ref && ref.current) {
    width = isNumber(width) ? (width * ref.current.offsetWidth) : ref.current.offsetWidth;
    if (isNumber(aspectRatio)) {
      height = width / aspectRatio;
    } else {
      height = isNumber(height) ? (height * ref.current.offsetHeight) : ref.current.offsetHeight;
    }
  } else if (!isNumber(width) && !isNumber(height)) {
    width = window.innerWidth;
    height = isNumber(aspectRatio) ? (width / aspectRatio) : window.innerHeight;
  } else if (!isNumber(width)) {
    width = isNumber(aspectRatio) ? (height * aspectRatio) : window.innerWidth;
  } else if (!isNumber(height)) {
    height = isNumber(aspectRatio) ? (width / aspectRatio) : window.innerHeight;
  }

  return [width, height];
};

const Zoom = ({
  children,
  width,
  height,
  aspectRatio,
  sizeReference,
  alignX = 'left',
  alignY = 'top',
  scaleOn = 'both',
  maxWidth,
  maxHeight,
  sx = {},
  ...props
}) => {
  const scaleElement = useRef();
  const [wrapperElement, wrapperWidth, wrapperHeight] = useResizeObserver();

  useEffect(() => {
    if (wrapperWidth && wrapperHeight && scaleElement.current) {
      if (
        (!isNumber(maxWidth) && !isNumber(maxHeight)) ||
        (isNumber(maxWidth) && (wrapperWidth <= maxWidth)) ||
        (isNumber(maxHeight) && (wrapperHeight <= maxHeight))
      ) {
        const [targetWidth, targetHeight] = getTargetSize(sizeReference, width, height, aspectRatio);

        let scale;
        if (scaleOn === 'width') {
          scale = wrapperWidth / targetWidth;
          // WrapperElement.current.style.height = `${targetHeight * scale}px`;
        } else if (scaleOn === 'height') {
          scale = wrapperHeight / targetHeight;
          // WrapperElement.current.style.width = `${targetWidth * scale}px`;
        } else {
          scale = Math.min(wrapperWidth / targetWidth, wrapperHeight / targetHeight);
        }

        let offsetX = 0;
        if (alignX === 'center') {
          offsetX = Math.max(0, wrapperWidth - (scale * targetWidth)) / 2;
        } else if (alignX === 'right') {
          offsetX = Math.max(0, wrapperWidth - (scale * targetWidth));
        }

        let offsetY = 0;
        if (alignY === 'center') {
          offsetY = Math.max(0, wrapperHeight - (scale * targetHeight)) / 2;
        } else if (alignY === 'bottom') {
          offsetY = Math.max(0, wrapperHeight - (scale * targetHeight));
        }

        scaleElement.current.style.width = `${targetWidth}px`;
        scaleElement.current.style.height = `${targetHeight}px`;
        scaleElement.current.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      } else {
        scaleElement.current.style.width = null;
        scaleElement.current.style.height = null;
        scaleElement.current.style.transform = null;
      }
    }
  }, [wrapperWidth, wrapperHeight]);

  return (
    <Box
      ref={wrapperElement}
      sx={sx}
      {...props}
    >
      <Box
        ref={scaleElement}
        sx={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          transformOrigin: '0 0'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Zoom;
