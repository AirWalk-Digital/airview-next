import React from "react";

import { Typography, Box } from "@mui/material";
import { TopBar } from "@/components/dashboard";
import { baseTheme } from "../../constants/baseTheme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getFrameworks, getFrameworkByName } from "../../backend/frameworks";
import { Stack } from "@mui/material";
import { Chip } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import dynamic from "next/dynamic";

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});

function Page({ framework }) {
  const topBarHeight = 64;
  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <TopBar menu={false} topBarHeight={topBarHeight} logo={true} />
      <div style={{ marginTop: topBarHeight, paddingLeft: 0 }}>
        <Box sx={{ px: "5%" }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ pt: "2%" }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4" color="text.main">
              {framework?.catalog?.metadata?.title}
            </Typography>
            <Chip
              label={framework?.catalog?.metadata?.version}
              variant="outlined"
              sx={{ ml: "auto", mr: "5%" }}
            />
          </Stack>
          {framework?.catalog.groups
            ? framework.catalog.groups.map((fr, i) => (
                <FrameworkSection key={i} domain={fr} />
              ))
            : null}
        </Box>
      </div>
    </ThemeProvider>
  );
}
function FrameworkSection({ domain }) {
  return (
    <Accordion sx={{ my: "1%" }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h5" sx={{ width: "50%", flexShrink: 0 }}>
          {domain.title} ({domain.id.toUpperCase()})
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {domain.controls
          ? domain.controls.map((ct, i) => (
              <FrameworkControl key={i} control={ct} />
            ))
          : null}
      </AccordionDetails>
    </Accordion>
  );
}

function controlSections(jsonSection) {
  let description = "";
  let discussion = "";

  const formattedElements = [];

  function formatParts(parts, marginLeft = 0) {
    const formattedElements = [];
    for (const part of parts) {
      if (part.name && part.prose) {
        let subparts = "";
        let text = "";
        if (part.parts) {
          subparts = formatParts(part.parts, marginLeft + 10);
        }
        if (part.props && part.props[0].value) {
          text = part.props[0].value + " " + part.prose;
        } else {
          text = part.prose;
        }

        formattedElements.push(
          <Typography
            key={part.id}
            variant="body2"
            style={{ marginLeft: `${marginLeft}px` }}
          >
            {text}
            <Stack direction="column">{subparts}</Stack>
          </Typography>
        );
      }
    }
    return formattedElements;
  }

  for (const part of jsonSection) {
    if (part.name && part.name === "statement") {
      // statement
      if (part.prose) {
        // all in one prop
        description = (
          <Typography variant="body2" color="text.main">
            {part.prose}
          </Typography>
        );
      } else if (part.parts) {
        // built up
        description = (
          <Typography variant="h2" color="text.main">
            <Stack direction="column">{formatParts(part.parts)}</Stack>
          </Typography>
        );
      }
    } else if (part.name && part.name === "guidance") {
      if (part.prose) {
        // all in one prop
        discussion = (
          <Typography variant="body2" color="text.main">
            {part.prose}
          </Typography>
        );
      } else if (part.parts) {
        // built up
        description = (
          <Typography variant="h2" color="text.main">
            <Stack direction="column">{formatParts(part.parts)}</Stack>
          </Typography>
        );
      }
    }
  }

  return (
    <>
      <Box>
        <Typography variant="h5" color="text.main">
          Description
        </Typography>
        {description}
      </Box>
      <Box>
        <Typography variant="h5" color="text.main">
          Discussion
        </Typography>
        {discussion}
      </Box>
    </>
  );
}

function FrameworkControl({ control }) {
  // // // console.log('control : ', control)
  let description = "";
  if (control.parts) {
    description = controlSections(control.parts);
  }
  return (
    <Box
      sx={{
        boxShadow: 0,
        border: 1,
        borderRadius: 2,
        p: 2,
        m: "1%",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ pt: "2%" }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h4" color="text.main">
          {control.title}
        </Typography>
        <Chip
          label={control.id.toUpperCase()}
          variant="outlined"
          sx={{ ml: "auto", mr: "5%" }}
        />
      </Stack>
      <Accordion sx={{ my: "1%" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          Control Details
        </AccordionSummary>
        <AccordionDetails>{description && description}</AccordionDetails>
      </Accordion>
    </Box>
  );
}

export async function getServerSideProps(context) {
  try {
    const framework = await getFrameworkByName(context.params.section[0]);
    return {
      props: {
        framework: framework,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        framework: {},
      },
    };
  }
}
