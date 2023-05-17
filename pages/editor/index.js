import * as React from 'react';
import { useState, useEffect, } from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { ThemeProvider } from '@mui/material/styles';
// import { useTheme } from '@mui/material/styles';

import { theme } from '../../constants/theme';

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

function Pad({children}) {

return (
  <Grid item xs={12} sm={6} md={4}>
  <Card
    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
  >
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
      <Typography variant="p" sx={{fontSize: '1rem'}}>
        {children}
      </Typography>
    </CardContent>
    <CardActions>
      <Button href={`/pads/ppt/${children}`} size="small">PPT</Button>
      <Button href={`/pads/print/${children}`}size="small">Print</Button>
      <Button href={`https://pad.airview.airwalkconsulting.io/p/${children}`} size="small">Edit</Button>
    </CardActions>
  </Card>
</Grid>
);


}



const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// const theme = createTheme();

export default function Home() {
  // const theme = useTheme();
  const [padList, setPadList] = useState(0);
  const [refreshToken, setRefreshToken] = useState(Math.random());

  useEffect(() => {
    fetch(`/api/etherpad/listAllPads`)
    .then((res) => res.json())
    .then(data => {
      setPadList(data.pads)
      // console.log('data : ', data )
      })
      .catch(error => {
        // console.log(error)
      })
      .finally(() => {
        setTimeout(() => setRefreshToken(Math.random()), 5000);
      });
  
  }, [refreshToken]);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar color='primary' position="relative">
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
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >

        <Container sx={{ py: 8 }} >
          {/* End hero unit */}

          <Grid container spacing={4}>
          <Card
    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
  > text </Card>
  <Card><iframe src='http://pad.airview.airwalkconsulting.io/p/documentation' width='600' height='400'></iframe>

    
</Card>
          </Grid>
          </Container>

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
            <Typography variant="h5" align="center" color="text.highlight" paragraph>
              Create Presentations using Markdown or MDX.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button href={'https://pad.airview.airwalkconsulting.io'} variant="contained">Create New</Button>
              <Button href={`/files/mdx/test.mdx`} variant="outlined">Documentation</Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}

          <Grid container spacing={4}>
            {padList ? padList.map((pad, i) => (
                <Pad key={i}>{pad}</Pad>
              )) : <Pad>Etherpad Error</Pad>
            } 
          </Grid>


          {/* <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random"
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography>
                    <Typography>
                      This is a media card. You can use this section to describe the
                      content.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid> */}
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        {/* <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography> */}
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}








// export default function () {
//   const [padList, setPadList] = useState(0);
//   const [refreshToken, setRefreshToken] = useState(Math.random());

//   useEffect(() => {
//     fetch(`/api/etherpad/listAllPads`)
//     .then((res) => res.json())
//     .then(data => {
//       setPadList(data.pads)
//       // console.log('data : ', data )
//       })
//       .catch(error => {
//         // console.log(error)
//       })
//       .finally(() => {
//         setTimeout(() => setRefreshToken(Math.random()), 5000);
//       });
  
//   }, [refreshToken]);


//   return (
//     <>
      
//       <br />
//       {padList ? (
//         <>


//           Available pads from Etherpad:
//           <br />
//           <h2>Presentations</h2>
//           {
//             padList.map((pad, i) => (
//               <Box key={i}>
//                 <Link  href={`/pads/ppt/${pad}`}>{pad}</Link>
//               </Box>
//             ))
//           }
//         </>
//       ) : 'Etherpad is not running'
//       }
//     </>
//   )
// }