'use client';

import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from '@mui/material';
import NextImage from 'next/image';
import path from 'path';
import React, { useState } from 'react';

import type { ContentItem } from '@/lib/Types';

function isSharePointUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const { hostname } = urlObj;
    return hostname.endsWith('sharepoint.com');
  } catch {
    return false;
  }
}

function isExternalUrl(url: string) {
  if (url.startsWith('http')) {
    return true;
  }
  return false;
}

function getAPIUrl(src: string, baseContext: ContentItem) {
  let url = src;
  if (isSharePointUrl(src)) {
    // it's from SharePoint.. use the sharepoint loader API
    url = `/api/content/sharepoint?url=${src}`;
  } else if (isExternalUrl(src)) {
    // it's external.. just get it directly
    url = src;
  } else if (baseContext.source === 'github') {
    // strip off leading ./ if present
    let newSrc = src;
    newSrc = src.replace('./', '');

    if (newSrc.slice(0, 1) === '/') {
      newSrc = newSrc.slice(1);
    }
    // get directory from the file path

    if (baseContext.file) {
      const dir = path.dirname(baseContext.file);

      if (!dir.startsWith('.')) {
        newSrc = `${dir}/${newSrc}`;
      } // ignore base paths
    }
    url = `/api/content/github?owner=${baseContext.owner}&repo=${baseContext.repo}&path=${newSrc}&branch=${baseContext.branch}`;
    // console.debug('mdxProvider:MdxImage:src: ', src)
  } else if (src.slice(0, 1) === '/') {
    // it's an absolute URL and not from Github or SharePoint
    url = src;
  } else if (src.slice(0, 2) === './') {
    // it's a relateive URL and not from Github or SharePoint
    let newSrc = src;
    newSrc = src.replace('./', '');
    if (baseContext.file) {
      const dir = path.dirname(baseContext.file);
      newSrc = `/${dir}/${newSrc}`;
    }
    url = newSrc;
  } else {
    url = '/image-not-found.png';
  }
  return url;
}

function ImageComponent({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const [zoomable, setZoomable] = useState(false);
  // const [width, height] = useWindowSize();
  // const [containerSize, containerRef] = useContainerSize();

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const handleClickOpen = () => {
    if (zoomable) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageLoaded = (event: any) => {
    // console.log('handleImageLoad:event', event.target);
    const { naturalWidth, naturalHeight } = event.target;
    setImageSize({ width: naturalWidth, height: naturalHeight });
    setZoomable(naturalWidth > 300 || naturalHeight > 300);
  };

  return (
    <>
      <Box
        height={imageSize.height > 300 ? '300px' : imageSize.height}
        // ref={containerRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '70%',
          maxHeight: '70%',
          cursor: imageSize.height > 300 ? 'zoom-in' : 'default',
          margin: 'auto',
          py: '1%',
        }}
        onClick={handleClickOpen}
      >
        <NextImage
          sizes="100vw"
          height={imageSize.height}
          width={imageSize.width}
          src={src}
          alt={alt || 'n/a'}
          onLoad={handleImageLoaded}
          unoptimized
          style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
        />
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        sx={{ maxWidth: '90%' }}
      >
        <DialogActions>
          <IconButton color="primary" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogActions>

        <DialogContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            margin: 'auto',
            overflowY: 'visible',
          }}
        >
          <NextImage
            height={imageSize.height}
            width={imageSize.width}
            src={src}
            alt={alt || 'n/a'}
            unoptimized
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function Image({
  props,
  baseContext,
}: {
  props: any;
  baseContext: ContentItem;
}) {
  let { src } = props;

  src = getAPIUrl(src, baseContext);

  return <ImageComponent src={src} alt={props.alt} />;
}
