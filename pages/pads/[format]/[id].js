import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { useState, useEffect, } from 'react';
import { mdComponents } from "../../../components/MDXProvider";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../../../constants/theme';
import { useRouter } from 'next/router'

export default function Pad() {
  const router = useRouter()
  const { id, format } = router.query
  const [pad, setPad] = useState();
  const [rev, setRev] = useState(0);
  const [refreshToken, setRefreshToken] = useState(Math.random());

  useEffect(() => {
    fetch(`/api/etherpad/pad-revs?pad=${id}`)
    .then((res) => res.json())
    .then(data => {
      console.log('data.rev : ', data.rev , 'rev : ', rev)
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        {pad && <MDXRemote {...pad.source} components={mdComponents} /> }
    </ThemeProvider>
  )
}