import React, { useState, useEffect, useRef } from 'react'

import { Previewer } from 'pagedjs'

export function PagedOutput({ children }) {
  const mdxContainer = useRef(null);
  const previewContainer = useRef(null);
  useEffect(() => {
    if (print) {
      if (mdxContainer.current !== null) {
        const paged = new Previewer();
        const contentMdx = `${mdxContainer.current?.innerHTML}`;
        paged
          .preview(contentMdx, ['/pdf.css'], previewContainer.current)
          .then((flow) => {
            // // console.log('====flow====')
            // // console.log(flow)
          });
        // return () => {
        //   document.head
        //     .querySelectorAll("[data-pagedjs-inserted-styles]")
        //     .forEach((e) => e.parentNode?.removeChild(e));
        // };
      }
    }
  }, []);


  return (
    <>
      <div className="pagedjs_page" ref={previewContainer}> </div>
      <div ref={mdxContainer} style={{ display: 'none' }}>
        {children && children}
      </div>
    </>
  )


}