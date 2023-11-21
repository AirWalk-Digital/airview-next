// nextImageLoader.js
import Image from 'next/image';

export default function nextImageLoader({ src, width, height, quality, ...props }) {
  // Add a leading slash to the image URL if it doesn't already exist
  const srcWithLeadingSlash = src.startsWith('/') ? src : `/${src}`;
  return srcWithLeadingSlash;
  return (
    <Image
      src={srcWithLeadingSlash}
      width={width}
      height={height}
      quality={quality}
      {...props}
    />
  );
}
