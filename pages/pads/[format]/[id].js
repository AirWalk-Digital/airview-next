import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import { useState, useEffect, } from 'react';
import { mdComponents } from "../../../components/MDXProvider";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { theme } from '../../../constants/theme';


export async function getStaticPaths() {
  const axios = require('axios');
  const client = axios.create({
    baseURL: process.env.ETHERPAD_BASE_URL,
    timeout: 1000,
    params: { 'apikey': process.env.ETHERPAD_API_KEY },
  });

  // List all pads
  // http://localhost:9001/api/1.2.1/listAllPads?apikey=f50403c112c30485607554afa2cf37675ef791681ad36001134f55b05a3deca1
  let paths = [];
  try {
    let pads = (await client.get('listAllPads')).data.data.padIDs.map(id => { return id });

    for (const id of pads) {
      paths.push({
        params: {
          format: 'print',
          id,
        },
      })
      paths.push({
        params: {
          format: 'ppt',
          id,
        },
      })
      paths.push({
        params: {
          format: 'mdx',
          id,
        },
      })
    }

  } catch (error) {
    console.log('Error fetching available pads');
    console.log(error)
  }
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const axios = require('axios');
  const client = axios.create({
    baseURL: process.env.ETHERPAD_BASE_URL,
    timeout: 1000,
    params: { apikey: process.env.ETHERPAD_API_KEY },
  });
  let pad = null;
  let revision = null;
  try {
    // Get text for pad
    let padData = (await client.get('listSavedRevisions', {
      params: {
        padID: context.params.id,
      }
    })).data.data?.savedRevisions
    revision = Math.max(...padData)
  } catch (error) {
    console.log(error)
  }

  try {
    // Get text for pad
    pad = (await client.get('getText', {
      params: {
        padID: context.params.id,
        rev: revision,
      }
    })).data.data?.text
    if (context.params.format === 'ppt') {
      pad = '<SlidePage>\n' + pad + '\n</SlidePage>'
    } else if (context.params.format === 'print') {
      pad = '<PrintSlide>\n' + pad + '\n</PrintSlide>'
    } else {
      pad = '<MDXViewer>\n' + pad + '\n</MDXViewer>'
    }

  } catch (error) {
    console.log(error)
  }

  const mdxSource = await serialize(pad ?? 'No content', {
    scope: {},
    mdxOptions: {
      format: 'mdx',
    },
    parseFrontmatter: true,
  })
  // console.log(mdxSource)
  return { props: { source: mdxSource, padId: context.params.id, format: context.params.format, revision: revision } }
}

const isDifferent = (oldPad, newPad) => {
  return (oldPad.source.compiledSource !== newPad.source.compiledSource);
}

const fetchPad = (padID, format, revision) => {
  fetch(`/api/fetch-pad?pad=${padID}&format=${format}&rev=${revision}`)
      .then((res) => res.json())
      .then(data => {
          return(data)
      })
      .catch(error => {
        console.log(error)
      })
}

export default function Pad(props) {
  const [pad, setPad] = useState(props);
  const [rev, setRev] = useState();
  const [refreshToken, setRefreshToken] = useState(Math.random());

  useEffect(() => {
    fetch(`/api/pad-revs?pad=${props.padId}`)
    .then((res) => res.json())
    .then(data => {
      // console.log('rev :', rev, 'newrev : ', data.rev)
      if (data.rev !== rev) {
        const newrev = data.rev
        fetch(`/api/fetch-pad?pad=${props.padId}&format=${props.format}&rev=${data.rev}`)
        .then((res) => res.json())
        .then(data => {
            setPad(data)
            setRev(newrev);

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
      {/* <div className="wrapper" style={{ maxWidth: '100vw', maxHeight: '100vh' }}> */}
        <MDXRemote {...pad.source} components={mdComponents} />
      {/* </div> */}
    </ThemeProvider>
  )
}