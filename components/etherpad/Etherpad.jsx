import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import { fetchPadDetails } from '@/lib/etherpad'
import { useMDX } from '@/lib/content/mdx'
import { FullScreenSpinner } from '@/components/dashboard';
import * as matter from 'gray-matter';
import { siteConfig } from "../../site.config.js";


export function Etherpad({ file, frontMatterCallback }) {


  const etherpad_host = siteConfig?.etherpad?.url ?? null
  // const etherpad_host = 'http://192.168.64.13:9001';

  const [pageContent, setPageContent] = useState({ content: undefined, frontmatter: undefined });

  const [content, setRawContent] = useState(null);
  const [padId, setPadId] = useState(null);
  // const [menuStructure, setMenuStructure] = useState(null);
  const [rev, setRev] = useState(0);
  const [editorURL, setEditorURL] = useState(null);
  const [refreshToken, setRefreshToken] = useState(Math.random());


  // // console.log('Etherpad: ', padId)
  // const url = `https://pad.airview.airwalkconsulting.io/p/${padId}?showControls=false&showChat=false&showLineNumbers=false&useMonospaceFont=false`

  const url = `${etherpad_host}/p/${padId}?showControls=false&showChat=false&showLineNumbers=false&useMonospaceFont=false`

  // console.log('Etherpad:url: ', url)
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  const handleToggleEditor = () => {
    setIsEditorVisible(!isEditorVisible);
  };

  useEffect(() => { // process the rawcontent
    const { mdxContent, frontmatter } = useMDX(content, 'mdx');
    setPageContent({ content: mdxContent, frontmatter: frontmatter });
    frontMatterCallback(frontmatter);
  }, [content])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const cacheKey = 'etherpad:/' + file;
  //     try {
  //       const pad = await fetchPadDetails(cacheKey);
  //       return pad;
  //     } catch (error) {
  //       console.error('Error fetching pad details:', error);
  //       return null;
  //     }
  //   };

  //   if (file && file.endsWith(".etherpad")) {

  //     const fetchDataAndSetState = async () => {
  //       const padDetails = await fetchData();
  //       // console.log('useEffect:fetchData1: ', padDetails);

  //       if (padDetails && padDetails.rawContent && padDetails.frontmatter) {
  //         setPadId(padDetails.frontmatter.padID);
  //         // console.log('useEffect:fetchData2: ', padDetails);
  //         setRev(padDetails.rev);
  //         setRawContent(matter.stringify(padDetails.rawContent, padDetails.frontmatter));
  //       }
  //     };

  //     fetchDataAndSetState();
  //   }
  // }, [file]);

  useEffect(() => {

    const fetchData = async () => {
      const cacheKey = 'etherpad:/' + file;
      try {
        const pad = await fetchPadDetails(cacheKey);
        return pad;
      } catch (error) {
        console.error('Error fetching pad details:', error);
        return null;
      }
    };

    const fetchPadMetadata = async () => {
      const padDetails = await fetchData();
      // console.log('useEffect:fetchPadDetails: ', padDetails);

      if (padDetails && padDetails.rawContent && padDetails.frontmatter) {
        setPadId(padDetails.frontmatter.padID);
        setEditorURL(`${etherpad_host}/p/${padDetails.frontmatter.padID}?showControls=false&showChat=false&showLineNumbers=false&useMonospaceFont=false`);
        setRev(padDetails.rev);
        setRawContent(matter.stringify(padDetails.rawContent, padDetails.frontmatter));
      }
    };


    const fetchPadContent = async () => {
      fetch(`/api/etherpad/pad-revs?pad=${padId}`)
        .then((res) => res.json())
        .then(data => {
          // // console.log('fetchPadContent:data.rev : ', data.rev, 'rev : ', rev)
          if (data.rev && data.rev > rev) {
            // // console.log('fetchPadContent:new revision :', data.rev)
            const newrev = data.rev
            fetch(`/api/etherpad/pad?pad=${padId}&rev=${newrev}`)
              .then((res) => res.json())
              .then(data => {
                if (data.content) {
                  setRawContent(data.content.text);
                  setRev(newrev); // update the revision after successful fetch
                }
              })
              .catch(error => {
                console.error('Etherpad:Error refreshing pad: ', error)
              })
          }

        })
        .catch(error => {
          console.error('Etherpad:Error refreshing pad revisions: ', error)
        })
        
    }

    if (padId) { 
      fetchPadContent()
      setTimeout(() => setRefreshToken(Math.random()), 5000);
      console.log('Etherpad:useEffect:PadRefresh')
    } else { fetchPadMetadata() }

  }, [refreshToken]);



  if (pageContent.content && pageContent.frontmatter) {

    const Content = pageContent.content;


    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ mt: '1%' }}>
          <Button variant="contained" onClick={handleToggleEditor}>
            {isEditorVisible ? 'Hide' : 'Show'} Edit
          </Button>
        </Grid>
        { isEditorVisible && (
          <Grid item xs={12} md={6}>
            <iframe src={editorURL} width="100%" height="100%" frameborder="0"></iframe>
            {/* <iframe name="embed_readwrite" src="https://pad.airview.airwalkconsulting.io/p/5072ba3e-90c2-409b-908b-9a89f58f85c8?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false" width="100%" height="600" frameborder="0"></iframe> */}
          </Grid>
        )}
        <Grid item xs={12} md={isEditorVisible ? 6 : 12}>

          <Content />

        </Grid>

      </Grid>
    );

  } else {
    // console.log('pageContent: ', pageContent)

    return (<FullScreenSpinner />)
  }
};


    // <iframe name="embed_readwrite" src="https://pad.airview.airwalkconsulting.io/p/5072ba3e-90c2-409b-908b-9a89f58f85c8?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false" width="100%" height="600" frameborder="0"></iframe>

