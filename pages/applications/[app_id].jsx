import React, { useEffect } from "react";

import { Typography, Box } from "@mui/material";

import { TopBar } from "@/components/dashboard";
import { baseTheme } from "../../constants/baseTheme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import {
  getApplications,
  getApplicationById,
  getComplianceAggregation,
} from "../../backend/applications";

import { ComplianceTable } from "../../components/airview-compliance-ui/features/compliance-table";
import {
  ControlOverview,
  useControlOverviewController,
} from "../../components/airview-compliance-ui/features/control-overview";
import dynamic from "next/dynamic";

// temporary data
// import { getApplicationsData } from "../../components/airview-compliance-ui/stories/compliance-table/applications-data";
import {
  groups,
  controls,
  resources,
} from "../../components/airview-compliance-ui/stories/control-overview/data";
///
import { MiniStatisticsCard } from "../../components/dashboard";
import { Stack } from "@mui/material";
import { Chip } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});

async function complianceOnAcceptOfRisk(data) {
  try {
    const exclusion = {
      controlId: data.controlId.value,
      summary: data.summary.value,
      isLimitedExclusion: data.limitedExemption.value,
      resources: data.resources.value,
    };
    const res = await fetch(`/api/compliance/exclusions/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exclusion),
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function Page({ app, applicationsData }) {
  const topBarHeight = 64;
  // console.log('Page:app: ', app)
  let data_classification = "";
  let tier = "";

  const noDataMessage = {
    title: "No issues",
    message: "There are no issues to display for this application",
  };
  const invalidPermissionsMessage = {
    title: "Notice",
    message:
      "You do not have the required permissions to view the data for this application",
  };

  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <TopBar menu={false} topBarHeight={topBarHeight} logo={true} />
      <div style={{ marginTop: topBarHeight, paddingLeft: 0 }}>
        {(app && (
          <Box sx={{ px: "5%" }}>
            <Grid
              container
              spacing={4}
              alignItems="center"
              justifyContent="left"
            >
              {app && app.name && (
                <Grid item xs={3} md={3}>
                  <Typography variant="h1" component="h1">
                    {app.name}
                  </Typography>
                </Grid>
              )}
              {app.id && (
                <Grid item xs={3} md={3}>
                  <Typography variant="h5">Application ID: {app.id}</Typography>
                </Grid>
              )}
              <Grid item xs={3} md={3}>
                <Stack direction="row" spacing={1} sx={{ pt: "2%" }}>
                  {app.data_classification === "Public" && (
                    <Chip label="Data: Public" color="success" />
                  )}
                  {app.data_classification === "Restricted" && (
                    <Chip label="Data: Restricted" color="warning" />
                  )}
                  {app.data_classification === "Highly Restricted" && (
                    <Chip label="Data: Highly Restricted" color="error" />
                  )}
                  {app.tier && (
                    <Chip label={`Tier ${app.tier}`} variant="outlined" />
                  )}
                </Stack>
              </Grid>
            </Grid>
            {app && app.description && (
              <Typography variant="h4" color="text.highlight">
                {app.description}
              </Typography>
            )}

            <Grid
              container
              spacing={4}
              alignItems="stretch"
              sx={{ pt: "2%" }}
              justifyContent="center"
            >
              <Grid item xs={3} md={3} sx={{ mb: "20px" }}>
                <MiniStatisticsCard
                  color="text.highlight"
                  title="Controls"
                  count="132"
                  percentage={{ value: "55%", text: "coverage" }}
                  icon={{ color: "error", icon: "check" }}
                />
              </Grid>
              <Grid item xs={3} md={3} sx={{ mb: "20px" }}>
                <MiniStatisticsCard
                  color="text.highlight"
                  title="Sev 1"
                  count="1"
                  percentage={{ value: "", text: "non-compliances" }}
                  icon={{ color: "warning", icon: "triangle-exclamation" }}
                />
              </Grid>
              <Grid item xs={3} md={3} sx={{ mb: "20px" }}>
                <MiniStatisticsCard
                  color="text.highlight"
                  title="Sev 2"
                  count="3"
                  percentage={{ value: "", text: "non-compliances" }}
                  icon={{ color: "error", icon: "circle-exclamation" }}
                />
              </Grid>
              <Grid item xs={3} md={3} sx={{ mb: "20px" }}>
                <MiniStatisticsCard
                  color="text.highlight"
                  title="Sev 3"
                  count="34"
                  percentage={{ value: "", text: "non-compliances" }}
                  icon={{ color: "error", icon: "info" }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4} alignItems="stretch">
              <Grid item xs={3} md={3} sx={{ mb: "20px" }}></Grid>
            </Grid>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography sx={{ width: "50%", flexShrink: 0 }}>
                  Issues and Exemptions
                </Typography>
                <Chip
                  label="5 exemptions"
                  variant="outlined"
                  sx={{ ml: "auto" }}
                />
                <Chip label="37" color="error" sx={{ ml: "auto", mr: "5%" }} />
              </AccordionSummary>
              <AccordionDetails>
                <ComplianceTable
                  title="Issues"
                  onAcceptOfRisk={complianceOnAcceptOfRisk}
                  noDataMessage={noDataMessage}
                  invalidPermissionsMessage={invalidPermissionsMessage}
                  loading={false}
                  applications={applicationsData}
                />
                ;
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Controls</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ApplicationControls applicationId={app.id} />
              </AccordionDetails>
            </Accordion>

            {/* </Container> */}
          </Box>
        )) ||
          "not found"}
      </div>
    </ThemeProvider>
  );
}

export async function getStaticPaths() {
  let pages = [];
  let location = "services";
  try {
    const apps = await getApplications();
    const pages = apps.map((file) => {
      return "/applications/" + file.id;
    });
    return {
      fallback: true,
      paths: pages,
    };
  } catch (error) {
    console.error(error);
    return {
      fallback: true,
      paths: pages,
    };
  }
}
export async function getStaticProps(context) {
  try {
    const app = (await getApplicationById(context.params.app_id)) || null;
    // const applicationsData = await getApplicationsData();

    const applicationsData = await getComplianceAggregation(
      context.params.app_id
    );
    return {
      props: {
        app: app,
        applicationsData,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        app: {},
      },
    };
  }
}

const ApplicationControls = ({ applicationId }) => {
  console.log(applicationId);
  // const [state, setControlsData, setResourcesData] =
  //   useControlOverviewController(() => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve(groups);
  //       }, [500]);
  //     });
  //   }, 1);

  // const handleOnRequestOfControlsData = (id) => {
  //   setControlsData(id, () => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         if (id === 3) resolve("error");

  //         resolve(controls[id]);
  //       }, [500]);
  //     });
  //   });
  // };

  // const handleOnRequestOfResourcesData = (id) => {
  //   setResourcesData(id, () => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         if (id === 3) resolve("error");

  //         resolve(resources[id]);
  //       }, [500]);
  //     });
  //   });
  // };

  // let models = {};

  const [state, setControlsData, setResourcesData] =
    useControlOverviewController(() => fetchGroupData(applicationId), null);

  // useEffect(() => {
  //   return () => {
  //     models = {};
  //   };
  // }, []);

  if (!state) return null;

  async function fetchGroupData(applicationId) {
    try {
      const modelData = await (
        await fetch(
          `/api/compliance/applications/${applicationId}/quality-models/`
        )
      ).json();
      return modelData.map((item, index) => {
        const model = {
          id: item.name,
          title:
            item.name.charAt(0).toUpperCase() +
            item.name.slice(1).toLowerCase(),
        };
        return model;
      });
    } catch {
      return [];
    }
  }

  async function fetchControlsData({ applicationId, id }) {
    const controls = await (
      await fetch(
        `/api/compliance/applications/${applicationId}/control-overviews?qualityModel=${id}`
      )
    ).json();
    return controls.map((item) => {
      return {
        ...item,
        severity:
          item.severity.charAt(0).toUpperCase() +
          item.severity.slice(1).toLowerCase(),

        control: { name: item.name, url: "/" },
        frameworks: [],
        controlAction:
          item.controlAction.charAt(0).toUpperCase() +
          item.controlAction.slice(1).toLowerCase(),
        lifecycle: item.systemStage,
      };
    });
  }

  async function fetchResourcesData({ applicationId, id }) {
    const resources = await (
      await fetch(
        `/api/compliance/aggregations/control-overview-resources/${applicationId}?technicalControlId=${id}`
      )
    ).json();
    return resources.map((item) => {
      const status =
        item.state || "FLAGGED" === "FLAGGED" ? "Non-Compliant" : "Monitoring";
      return { ...item, type: "Unknown", status: status };
    });
  }

  return (
    <ControlOverview
      title="Control Overview"
      data={state}
      onRequestOfControlsData={(id) =>
        setControlsData(id, () => fetchControlsData({ applicationId, id }))
      }
      onRequestOfResourcesData={(id) =>
        setResourcesData(id, () => fetchResourcesData({ applicationId, id }))
      }
      onResourceExemptionDelete={() => {}}
      onResourceExemptionSave={() => {}}
    />
  );
};
