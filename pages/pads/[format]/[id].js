import { MDXRemote } from 'next-mdx-remote'
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { mdComponents } from "../../../components/MDXProvider";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../../../constants/theme';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Previewer } from 'pagedjs';


export default dynamic(() => Promise.resolve(Pad), {
  ssr: false,
});

function Pad() {
  const router = useRouter()
  const { id, format } = router.query
  const [pad, setPad] = useState();
  const [rev, setRev] = useState(0);
  const [refreshToken, setRefreshToken] = useState(Math.random());
  const mdxContainer = useRef(null);
  const previewContainer = useRef(null);
  let contentMdx = ``;

  useLayoutEffect(() => {
    if (pad && pad.source && format === 'pdf') {
      const paged = new Previewer();
      contentMdx = `${mdxContainer.current?.innerHTML}`;
      paged
        .preview(contentMdx,
          ['/pdf.css'],
          previewContainer.current
        )
        .then((flow) => {
          console.log('====flow====')
          console.log(flow)
        });
      return () => {
        document.head
          .querySelectorAll("[data-pagedjs-inserted-styles]")
          .forEach((e) => e.parentNode?.removeChild(e));
      };
    }

  }, [pad])

  useEffect(() => {
    fetch(`/api/etherpad/pad-revs?pad=${id}`)
    .then((res) => res.json())
    .then(data => {
      // console.log('data.rev : ', data.rev , 'rev : ', rev)
      if (data.rev && data.rev > rev) {
        console.log('new revision :', data.rev)
        const newrev = data.rev
        fetch(`/api/etherpad/fetch-pad?pad=${id}&format=${format}&rev=${newrev}`)
        .then((res) => res.json())
        .then(data => {
            if (data.source && !data.error) { 
              console.log(data.source)

              setPad(data)
              setRev(newrev);
            };
            // setRev(newrev);

        })
        .catch(error => {
          console.log(error)
        })        
      }
      
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setTimeout(() => setRefreshToken(Math.random()), 5000);
      });

  }, [refreshToken]);


  if (format === 'pdf') {
    return (
      <>
        <div ref={mdxContainer} style={{ display: 'none' }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {pad && pad.source && <MDXRemote {...pad.source} components={mdComponents} />}
          </ThemeProvider>
        </div>
        <div className="pagedjs_page" ref={previewContainer}></div>
      </>
    )
  } else {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {pad && pad.source && <MDXRemote {...pad.source} components={mdComponents} />}
      </ThemeProvider>
    )
  }
  // return (
  //   <ThemeProvider theme={theme}>
  //     <CssBaseline />
  //       {pad && <MDXRemote {...pad.source} components={mdComponents} /> }
  //   </ThemeProvider>
  // )
}