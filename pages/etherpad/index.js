import * as React from 'react';
import { useState, useEffect, } from 'react';
import AppBar from '@mui/material/AppBar';
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
import Link from '@mui/material/Link';
import { ThemeProvider } from '@mui/material/styles';
import { baseTheme } from '../../constants/baseTheme';

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

  useEffect(() => {
    fetch(`/api/etherpad/all-pads`)
      .then((res) => res.json())
      .then((data) => {
        setPadList(data.pads);
      })
      .catch((error) => {
        // // console.log(error)
      })
      .finally(() => {
        setTimeout(() => setRefreshToken(Math.random()), 5000);
      });
  }, [refreshToken]);

  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <AppBar color="primary" position="relative">
        <Toolbar>
          <SlideshowIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Presentations as Code
          </Typography>
        </Toolbar>
      </AppBar>
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
                href={"https://pad.airview.airwalkconsulting.io"}
                variant="contained"
              >
                Create New
              </Button>
              <Button
                href={`/output/file/markdown/test.mdx?format=doc`}
                variant="outlined"
              >
                Documentation (Doc)
              </Button>
              <Button
                href={`/output/file/markdown/test.mdx?format=ppt`}
                variant="outlined"
              >
                Documentation (PPT)
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