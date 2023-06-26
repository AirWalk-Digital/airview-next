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
import { FormControl, Link, Dialog, DialogTitle, DialogContent, ButtonGroup, DialogContentText, Select, MenuItem, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { baseTheme } from '../../constants/baseTheme';
import * as matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import { dirname, basename } from 'path';


function Copyright() {
  return (
    <Typography variant="body2" color="text.main" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://airwalkreply.com/">
        airwalkreply.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Pad({ children }) {
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
            Etherpad
          </Typography>
          <Typography variant="p" sx={{ fontSize: "1rem" }}>
            {children}
          </Typography>
        </CardContent>
        <CardActions>
          {/* <Button href={`/pads/ppt/${children}`} size="small">PPT</Button> */}
          {/* <Button href={`/pads/print/${children}`}size="small">Print</Button> */}
          <Button href={`/output/pad/${children}?format=ppt`} size="small">
            PPT
          </Button>
          <Button href={`/output/pad/${children}?format=doc`} size="small">
            Doc
          </Button>
          <Button
            href={`https://pad.airview.airwalkconsulting.io/p/${children}`}
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


  // dialogs
  // New Pad
  const [createOpen, setCreateOpen] = useState(false);
  const [dropDownData, setDropDownData] = useState([]);
  const [selectedDropDown, setSelectedDropDown] = useState('');
  const [docType, setDocType] = useState('designs');

  const [parent, setParent] = useState('None');

  const [title, setTitle] = useState('');
  const parents = ['None', 'Solution', 'Design', 'Service', 'Provider'];
  const docTypes = [{ label: 'Solution', prefix: 'solutions' }, { label: 'Design', prefix: 'designs' }, { label: 'Service', prefix: 'services' }, { label: 'Provider', prefix: 'providers' }, { label: 'Knowledge', prefix: 'knowledge' }];

  const handleCreateDialog = () => {
    setCreateOpen(!createOpen);
  };
  const handleCreateNew = async () => {
    console.log('create new pad: ', title, ' / ', selectedDropDown, ' / ', parent);
    let pad = uuidv4();  // Generate a unique padID



    let frontmatter;
    if (parent === 'None') {
      // define the object for when parent === 'None'
      frontmatter = {
        type: docType,
        title: title
      };
    } else {
      // define the object for when parent !== 'None'
      frontmatter = {
        type: docType,
        [parent.toLowerCase()]: dirname(selectedDropDown),
        title: title,
        parentType: parent.toLowerCase(),
        parentName: dirname(selectedDropDown)
      };
    }
    const initialContent = matter.stringify('\n', frontmatter);

    try {
      const response = await fetch(`/api/etherpad/new?padID=${pad}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initialContent }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else {
        setCreateOpen(false);
      }

    } catch (error) {
      console.error('Error:', error);
    }


  };

  const handleParentChange = async (parent) => {
    setParent(parent);
    if (parent === 'Solution') {
      console.log(siteContent.menuStructure['solutionMenu'])
      setDropDownData(siteContent.menuStructure['solutionMenu']);
    }

  };

  const handleDocTypeChange = async (x) => {
    setDocType(x);
  };

  const handleDropDownChange = (event) => {
    setSelectedDropDown(event.target.value);
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
    console.log('import pad')

    
      // const resPadRevs = await fetch(`/api/etherpad/pad-revs?pad=${padId}`);
      // const dataPadRevs = await resPadRevs.json();
      // const response = await fetch(`/api/etherpad/pad?pad=${padId}`);
      // console.log('fetch response:', response.json())
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

      // Store the returned data
      // setPadData(response.content);

      // console.log(padData)
      // fetch(`/api/etherpad/pad?pad=${location}`)
      //         .then((res) => res.json())
      //         .then(data => {
      //           console.log('fetch data:', data)
      //           if (data.content) {
      //             setPadData(data.content)
      //             console.log('fetch :', data.content)
      //           }
      //         })
      //         .catch(error => {
      //           console.log(error)
      //         })


      // const resPad = await fetch(`/api/etherpad/pad?pad=${padId}`);
      // const dataPad = await resPad.json();
      // console.log('fetchPadContent: ', await resPad);

      // if (dataPad.content) {

      //   try {
      //     const response = await fetch(`/api/etherpad/new?padID=${padId}&import=true`, {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({ content: dataPad.content }),
      //     });

      //     if (!response.ok) {
      //       throw new Error('Network response was not ok');
      //     } else {
      //       setPadData()
      //       setCreateOpen(false);
      //     }
      //   } catch (error) {
      //     console.error('Error:', error);
      //   }
      // }

    
  };

  useEffect(() => {
    fetch(`/api/etherpad/all-pads`)
      .then((res) => res.json())
      .then((data) => {
        setPadList(data.pads);
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setTimeout(() => setRefreshToken(Math.random()), 5000);
      });
  }, [refreshToken]);


  useEffect(() => {
    const fetchSiteContent = async () => {
      fetch(`/api/structure`)
        .then((res) => res.json())
        .then(data => {
          setSiteContent(data);
          setDropDownData(data.menuStructure['solutionMenu']);
          console.log('SiteConfig: ', data)

        })
        .catch(error => {
          console.log(error)
        })
    }
    fetchSiteContent()
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
            pb: 6,
          }}
        >
          <Container maxWidth="m">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.main"
              gutterBottom
            >
              Presentations as Code
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.highlight"
              paragraph
            >
              Create Presentations using Markdown or MDX.
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
              <Dialog open={createOpen} onClose={handleCreateDialog}>
                <DialogTitle>Create New</DialogTitle>
                <DialogContent>
                  {/* Title Input */}
                  <Typography variant="subtitle1" gutterBottom>
                    Title
                  </Typography>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Title"
                    type="text"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {/* Parent Buttons */}
                  <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px' }}>
                    Document Type
                  </Typography>
                  <ButtonGroup variant="outlined" color="primary" aria-label="outlined primary button group">
                    {docTypes.map((docTypeItem) => (
                      <Button
                        variant={docTypeItem.prefix === docType ? "contained" : "outlined"}
                        onClick={() => handleDocTypeChange(docTypeItem.prefix)}
                      >
                        {docTypeItem.label}
                      </Button>
                    ))}
                  </ButtonGroup>



                  {/* Document Type Buttons */}
                  <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px' }}>
                    Select Parent
                  </Typography>
                  <ButtonGroup variant="outlined" color="primary" aria-label="outlined primary button group">
                    {parents.map((parentOption) => (
                      <Button
                        variant={parentOption === parent ? "contained" : "outlined"}
                        onClick={() => handleParentChange(parentOption)}
                      >
                        {parentOption}
                      </Button>
                    ))}
                  </ButtonGroup>

                  {/* Dropdown for selected parent */}
                  <Typography variant="subtitle1" gutterBottom style={{ marginTop: '20px' }}>
                    Select Item
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={selectedDropDown}
                      onChange={handleDropDownChange}
                    >
                      {dropDownData && dropDownData.map((item, index) => (
                        <MenuItem key={index} value={item.url}>{item.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </DialogContent>

                <DialogActions>
                  <Button onClick={handleCreateDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNew}>
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                onClick={handleImportDialog}
                variant="outlined"
              >
                Import
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
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}

          <Grid container spacing={4}>
            {padList ? (
              padList.map((pad, i) => <Pad key={i}>{pad}</Pad>)
            ) : (
              <Pad>Etherpad Error</Pad>
            )}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}