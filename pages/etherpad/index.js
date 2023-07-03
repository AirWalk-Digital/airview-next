import * as React from 'react';
import { useState, useEffect, } from 'react';
import { TopBar } from '@/components/dashboard';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Skeleton, FormControl, Link, Dialog, DialogTitle, DialogContent, ButtonGroup, DialogContentText, Select, MenuItem, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { baseTheme } from '../../constants/baseTheme';
import * as matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import { dirname, basename } from 'path';

import { NewPadDialog } from '@/components/etherpad';

function Pad({ padID, title }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* <CardMedia
      component="img"
      sx={{
        // 16:9
        pt: '56.25%',
      }}
      image="https://source.unsplash.com/random"
      alt="random"
    /> */}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            
          </Typography>
          <Typography variant="p" sx={{ fontSize: "1rem" }}>
            {title}
          </Typography>
        </CardContent>
        <CardActions>
          {/* <Button href={`/pads/ppt/${children}`} size="small">PPT</Button> */}
          {/* <Button href={`/pads/print/${children}`}size="small">Print</Button> */}
          <Button href={`/output/pad/${padID}?format=ppt`} size="small">
            PPT
          </Button>
          <Button href={`/output/pad/${padID}?format=doc`} size="small">
            Doc
          </Button>
          <Button
            href={`https://pad.airview.airwalkconsulting.io/p/${padID}`}
            rel="noopener noreferrer"
            target="_blank"
            size="small"
          >
            Edit
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default function Home() {
  const [padList, setPadList] = useState(0);
  const [refreshToken, setRefreshToken] = useState(Math.random());

  const [airviewPads, setAirviewPads] = useState(null);

  // dialogs
  // New Pad
  const [createOpen, setCreateOpen] = useState(false);

  function handleCreateDialog() {
    setCreateOpen(!createOpen);
  };


  // Import Pad
  const [importOpen, setImportOpen] = useState(false);
  const [padData, setPadData] = useState(null);
  const [padMetadata, setPadMetadata] = useState(null);

  const [padId, setPadId] = useState(null);
  const [siteContent, setSiteContent] = useState(null);


  const handleImportDialog = () => {
    setPadData(null)
    setImportOpen(!importOpen);
  };
  const handleImport = async () => {
    // console.log('import pad')


    // const resPadRevs = await fetch(`/api/etherpad/pad-revs?pad=${padId}`);
    // const dataPadRevs = await resPadRevs.json();
    // const response = await fetch(`/api/etherpad/pad?pad=${padId}`);
    // // console.log('fetch response:', response.json())
    if (!padData) {
      try {
        fetch(`/api/etherpad/pad?pad=${padId}`)
          .then((res) => res.json())
          .then(data => {
            if (data.content) {
              const matterData = matter(data.content, { excerpt: false }).data || null;
              const dataArray = Object.entries(matterData).map(([key, value]) => ({ key, value }));
              setPadData(data.content);
              setPadMetadata(dataArray);

            }
          })
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      try {
        const response = await fetch(`/api/etherpad/new?padID=${padId}&import=true`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initialContent: padData }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        } else {
          handleImportDialog();
        }

      } catch (error) {
        console.error('Error:', error);
      }
    }

    refreshPads()

  };

  const handleImportAll = async () => {
    try {
      const res = await fetch(`/api/etherpad/all-pads`);
      const data = await res.json();
      // console.log('handleImportAll:', data.pads);

      //   const padPromises = data.pads.map((pad) =>
      //   fetch(`/api/etherpad/pad?pad=${pad}`).then((res) => res.json())
      // );
      const padPromises = data.pads.map((pad) =>
        fetch(`/api/etherpad/pad?pad=${pad}`)
          .then((res) => res.json())
          .then((data) => ({ pad, ...data }))
      );


      const padResponses = await Promise.all(padPromises);
      // console.log('handleImportAll:padResponses: ', padResponses)
      padResponses.forEach((data) => {
        if (data.content) {
          const matterData = matter(data.content, { excerpt: false }).data || null;

          if (matterData && matterData.type && matterData.title && data.pad && !matterData.archived) {

            try {
              const response = fetch(`/api/etherpad/new?padID=${data.pad}&import=true`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ initialContent: matter.stringify('', { ...matterData }) }),
              });
              
              if (!response.ok) {
                throw new Error('handleImportAll:Network response was not ok:', response);
              }

            } catch (error) {
              console.error('Error:', error);
            }

          }
        }
      });
      refreshPads()
    } catch (error) {
      console.error('Error:', error);
    }
  };



  // useEffect(() => {
  //   fetch(`/api/etherpad/all-pads`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setPadList(data.pads);
  //     })
  //     .catch((error) => {
  //       // console.log(error)
  //     })
  //     .finally(() => {
  //       setTimeout(() => setRefreshToken(Math.random()), 5000);
  //     });
  // }, [refreshToken]);


  const refreshPads = async () => {
    const fetchPads = async () => {
      const res = await fetch(`/api/etherpad/imported`);
      const data = await res.json();
      return data;
    };

    const fetchDataAndUpdateState = async () => {
      const pads = await fetchPads();
      setAirviewPads(pads);
    }

    fetchDataAndUpdateState()
  }


  useEffect(() => {
    const fetchPads = async () => {
      const res = await fetch(`/api/etherpad/imported`);
      const data = await res.json();
      return data;
    };

    const fetchDataAndUpdateState = async () => {
      const pads = await fetchPads();
      setAirviewPads(pads);
      // console.log('useEffect:LoadPads: ', pads)
    }

    fetchDataAndUpdateState()
  }, []);

  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <TopBar />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 1,
          }}
        >
          <Container maxWidth="m" sx={{mt: '1%'}}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.main"
              gutterBottom
            >
              Collaboration
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.highlight"
              paragraph
            >
              Create and collaborate on <strong>Documents</strong> and  <strong>Presentations</strong> using Markdown or MDX.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button
                onClick={handleCreateDialog}
                variant="contained"
              >
                Create New
              </Button>
              <NewPadDialog dialogOpen={createOpen} handleDialog={handleCreateDialog} siteContent={siteContent} />
              <Button
                onClick={handleImportDialog}
                variant="outlined"
              >
                Import
              </Button>
              <Button
                onClick={handleImportAll}
                variant="outlined"
              >
                Import ALL
              </Button>
              <Dialog open={importOpen} onClose={handleImportDialog}>
                <DialogTitle>Import Pad</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Enter the Pad ID to import:
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Pad ID"
                    type="text"
                    fullWidth
                    value={padId}
                    onChange={(event) => setPadId(event.target.value)} />
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Field</TableCell>
                          <TableCell>Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {padMetadata && padMetadata.map((row) => (
                          <TableRow key={row.key}>
                            <TableCell>{row.key}</TableCell>
                            <TableCell>{row.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleImportDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleImport}>
                    {padData ? "Import" : "Load"}
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                href={`/output/file/markdown/test.mdx?format=doc`}
                variant="outlined"
              >
                Documentation
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 0 }} maxWidth="md">
          {/* End hero unit */}
          {airviewPads ? (
            <PadView pads={airviewPads.collections} />) : (
            <>
              <h3>loading........</h3>
              <Skeleton animation="wave" />
            </>
          )}

        </Container>
      </main>

    </ThemeProvider>
  );
}


function PadView(pads) {

  // console.log('PadView:pads: ', pads)
  const collections = Object.entries(pads.pads).map(([key, value]) => {
    return {
      [key]: Object.values(value)
    };
  });

  // console.log('PadView:collections: ', collections)

  return (
    <div>
      {Object.entries(pads.pads).map(([category, elements]) => (
        <div key={category}>
          <h2>{capitalizeFirstLetter(category)}</h2>
          <Grid container spacing={4}>

            {elements.map((element, index) => (
              <Pad padID={element.padID} title={element.title} />
            ))}
          </Grid>
        </div>
      ))}
    </div>
  );
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};