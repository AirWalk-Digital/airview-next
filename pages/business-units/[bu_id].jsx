import React from "react";

import { Typography, Box } from "@mui/material";

import { TopBar } from '@/components/dashboard';
import { baseTheme } from '../../constants/baseTheme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { getBusinessUnits, getBusinessUnitById } from '../../backend/business-units';

import { ComplianceTable } from "../../components/airview-compliance-ui/features/compliance-table";
import { ControlOverview, useControlOverviewController, } from "../../components/airview-compliance-ui/features/control-overview";
import dynamic from 'next/dynamic'
import { MiniStatisticsCard } from "../../components/dashboard";
// temporary data
import { applicationsData } from "../../components/airview-compliance-ui/stories/compliance-table/applications-data";
import { groups, controls, resources } from "../../components/airview-compliance-ui/stories/control-overview/data";
///

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});

function Page({ bu }) {
  const topBarHeight = 64;

  const noDataMessage = {
    title: "No issues",
    message: "There are no issues to display for this Business Unit",
  };
  const invalidPermissionsMessage = {
    title: "Notice",
    message: "You do not have the required permissions to view the data for this Business Unit",
  };
  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <Topbar menu={false} topBarHeight={topBarHeight} logo={true} />
      <div style={{ marginTop: topBarHeight, paddingLeft: 0, }}
      ><Box sx={{ px: '5%' }}>
          {bu && bu.name && <Typography variant="h1" component="h1">{bu.name}</Typography>}
          {bu && bu.description && <Typography variant="h4" color='text.highlight'>{bu.description}</Typography>}
          {/* <Container maxWidth="lg" sx={{ height: '100vh' }}> */}




          <Grid container spacing={4} alignItems="stretch" sx={{pt: '2%'}}>
            <Grid item xs={3} md={3} sx={{ mb: '20px' }}>
              <MiniStatisticsCard
                color="text.highlight"
                title="Controls"
                count="132"
                percentage={{ value: '55%', text: "coverage" }}
                icon={{ color: "error", icon: 'check' }}
              />
            </Grid>
            <Grid item xs={3} md={3} sx={{ mb: '20px' }}>
              <MiniStatisticsCard
                color="text.highlight"
                title="Sev 1"
                count="1"
                percentage={{ value: '', text: "non-compliances" }}
                icon={{ color: "warning", icon: 'triangle-exclamation' }}
              />
            </Grid>
            <Grid item xs={3} md={3} sx={{ mb: '20px' }}>
              <MiniStatisticsCard
                color="text.highlight"
                title="Sev 2"
                count="3"
                percentage={{ value: '', text: "non-compliances" }}
                icon={{ color: "error", icon: 'circle-exclamation' }}
              />
            </Grid>
            <Grid item xs={3} md={3} sx={{ mb: '20px' }}>
              <MiniStatisticsCard
                color="text.highlight"
                title="Sev 3"
                count="34"
                percentage={{ value: '', text: "non-compliances" }}
                icon={{ color: "error", icon: 'info' }}
              />
            </Grid>
          </Grid>

          <ComplianceTable title="Issues" noDataMessage={noDataMessage} invalidPermissionsMessage={invalidPermissionsMessage} loading={false} applications={applicationsData} />;
          <ApplicationControls />
          {/* </Container> */}
        </Box>
      </div>
    </ThemeProvider>
  )
}


export async function getStaticPaths() {
  let pages = [];
  try {
    const apps = await getBusinessUnits()
    const pages = apps.map((file) => {
      return '/business-units/' + file.bu_id
    })
    return {
      fallback: true,
      paths: pages
    }
  } catch (error) {
    console.error(error)
    return {
      fallback: true,
      paths: pages
    }
  }


}
export async function getStaticProps(context) {
  try {
    const bu = await getBusinessUnitById(context.params.bu_id);
    return {
      props: {
        bu: bu
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        bu: {}
      },
    };
  }
}


const ApplicationControls = () => {
  const [state, setControlsData, setResourcesData] =
    useControlOverviewController(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(groups);
        }, [500]);
      });
    }, 1);

  const handleOnRequestOfControlsData = (id) => {
    setControlsData(id, () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (id === 3) resolve("error");

          resolve(controls[id]);
        }, [500]);
      });
    });
  };

  const handleOnRequestOfResourcesData = (id) => {
    setResourcesData(id, () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (id === 3) resolve("error");

          resolve(resources[id]);
        }, [500]);
      });
    });
  };

  const handleOnResourceExemptionDelete = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, [1000]);
    });
  };

  const handleOnResourceExemptionSave = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, [1000]);
    });
  };

  return (
    <ControlOverview
      title="Control Overview"
      data={state}
      onRequestOfControlsData={handleOnRequestOfControlsData}
      onRequestOfResourcesData={handleOnRequestOfResourcesData}
      onResourceExemptionDelete={handleOnResourceExemptionDelete}
      onResourceExemptionSave={handleOnResourceExemptionSave}
    />
  );
};
