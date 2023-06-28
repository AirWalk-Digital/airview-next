import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';

export function Etherpad({ padId, children }) {

  const [pageContent, setContent] = useState({ content: undefined, frontmatter: undefined });

  const [content, setRawContent] = useState(initialContent);
    const [contentSource, setContentSource] = useState(null)
  const [menuStructure, setMenuStructure] = useState(null);
  const [rev, setRev] = useState(0);

  console.log('Etherpad: ', padId)
  // const url = `https://pad.airview.airwalkconsulting.io/p/${padId}?showControls=false&showChat=false&showLineNumbers=false&useMonospaceFont=false`

  const url = ` http://192.168.64.13:9001/p/${padId}?showControls=false&showChat=false&showLineNumbers=false&useMonospaceFont=false`
 
  console.log('Etherpad:url: ', url)
  const [isLeftVisible, setIsLeftVisible] = useState(false);

  const handleToggleLeft = () => {
    setIsLeftVisible(!isLeftVisible);
  };

  useEffect(() => {
    console.log('useEffect:MDX:File: ', file)
    let format;
    if (file && file.endsWith(".md")) {
      format = 'md';
    } else if (file && file.endsWith(".mdx")) {
      format = 'mdx';
    } else if (file && file.endsWith(".etherpad")) {
      format = 'mdx';
    } else {
      format = 'mdx;'
    }
    const { mdxContent, frontmatter } = useMDX(content, format);
    setContent({ content: mdxContent, frontmatter: frontmatter });
  }, [content])

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
  
    if (file && file.endsWith(".etherpad")) {
      
      const fetchDataAndSetState = async () => {
        const padDetails = await fetchData();
        console.log('useEffect:fetchData1: ', padDetails);
  
        if (padDetails && padDetails.rawContent && padDetails.frontmatter) {
          setContentSource('etherpad:' + padDetails.frontmatter.padID);

          console.log('useEffect:fetchData2: ', padDetails);
  
          setRev(padDetails.rev);
          setRawContent(matter.stringify(padDetails.rawContent, padDetails.frontmatter));
        }
      };
  
      fetchDataAndSetState();
    } else {
      setContentSource('git')
    }
  }, [file]);


  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{mt: '1%'}}>
        <Button variant="contained" onClick={handleToggleLeft}>
          {isLeftVisible ? 'Hide' : 'Show'} Edit
        </Button>
      </Grid>
      {isLeftVisible && (
        <Grid item xs={12} md={6}>
          <iframe src={url} width="100%" height="100%" frameborder="0"></iframe>
          {/* <iframe name="embed_readwrite" src="https://pad.airview.airwalkconsulting.io/p/5072ba3e-90c2-409b-908b-9a89f58f85c8?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false" width="100%" height="600" frameborder="0"></iframe> */}


        </Grid>
      )}
      <Grid item xs={12} md={isLeftVisible ? 6 : 12}>

        {children}

      </Grid>
      
    </Grid>
  );

};


    // <iframe name="embed_readwrite" src="https://pad.airview.airwalkconsulting.io/p/5072ba3e-90c2-409b-908b-9a89f58f85c8?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false" width="100%" height="600" frameborder="0"></iframe>

