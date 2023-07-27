import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../constants/theme";

function Copyright() {
  return (
    <Typography variant="body2" color="text.main" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://airwalkreply.com/">
        airwalkreply.com
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Pad({ endpoint, padID, title }) {
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
            {title}
          </Typography>
        </CardContent>
        <CardActions>
          {/* <Button href={`/pads/ppt/${children}`} size="small">PPT</Button> */}
          {/* <Button href={`/pads/print/${children}`}size="small">Print</Button> */}
          <Button href={`/result/pad/${padID}?format=ppt`} size="small">
            PPT
          </Button>
          <Button href={`/result/pad/${padID}?format=doc`} size="small">
            Doc
          </Button>
          <Button
            href={`${endpoint}/p/${padID}`}
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
  const [environment, setEnvironment] = useState("");
  const [refreshToken, setRefreshToken] = useState(Math.random());

  useEffect(() => {
    fetch(`/api/etherpad/all-pads`)
      .then((res) => res.json())
      .then((data) => {
        setPadList(data.pads);
      })
      .catch((error) => {
        // console.log(error)
      })
      .finally(() => {
        setTimeout(() => setRefreshToken(Math.random()), 5000);
      });
  }, [refreshToken]);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch("/api/environment");
      const data = await resp.json();
      console.log(data);
      setEnvironment(data);
    };
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
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
          <Container maxWidth="m" sx={{ mt: "1%" }}>
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
              <Button href={environment.ETHERPAD_URL} variant="contained">
                Create New
              </Button>
              <Button
                href={`/result/file/markdown/test.mdx?format=doc`}
                variant="outlined"
              >
                Documentation (Doc)
              </Button>
              <Button
                href={`/result/file/markdown/test.mdx?format=ppt`}
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
            {padList ||
              ["Etherpad Error"].map((pad, i) => (
                <Pad endpoint={environment.ETHERPAD_URL} key={i} pad={pad} />
              ))}
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

function PadView(pads) {
  const [environment, setEnvironment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch("/api/environment");
      const data = await resp.json();
      console.log(data);
      setEnvironment(data);
    };
    fetchData();
  }, []);

  // console.log('PadView:pads: ', pads)
  const collections = Object.entries(pads.pads).map(([key, value]) => {
    return {
      [key]: Object.values(value),
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
              <Pad
                endpoint={environment.ETHERPAD_URL}
                padID={element.padID}
                title={element.title}
              />
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
