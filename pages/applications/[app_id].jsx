import React from "react";

import { Typography, Box } from "@mui/material";

import Topbar from '../../components/TopBar';
import { theme } from '../../constants/baseTheme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { getApplications, getApplicationById } from '../../backend/applications';

import { ComplianceTable } from "../../components/airview-compliance-ui/features/compliance-table";
import { ControlOverview, useControlOverviewController, } from "../../components/airview-compliance-ui/features/control-overview";
import dynamic from 'next/dynamic'

// temporary data
import { applicationsData } from "../../components/airview-compliance-ui/stories/compliance-table/applications-data";
import { groups, controls, resources } from "../../components/airview-compliance-ui/stories/control-overview/data";
///

export default dynamic(() => Promise.resolve(Page), {
    ssr: false,
  });

function Page({app}) {
    const topBarHeight = 64;

    const noDataMessage={
    title: "No issues",
    message: "There are no issues to display for this application",
  };
  const invalidPermissionsMessage = {
    title: "Notice",
    message: "You do not have the required permissions to view the data for this application",
  };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Topbar menu={false} topBarHeight={topBarHeight} logo={true} />
            <div style={{ marginTop: topBarHeight, paddingLeft: 0, }}
            ><Box sx={{ px: '5%' }}>
                    {app && app.name && <Typography variant="h1" component="h1">{app.name}</Typography>}
                    {app && app.description && <Typography variant="h4" color='text.highlight'>{app.description}</Typography>}
                    {/* <Container maxWidth="lg" sx={{ height: '100vh' }}> */}
                    <Grid container spacing={4} alignItems="stretch">
                        <Grid item xs={3} md={3} sx={{ mb: '20px' }}>
                        </Grid>
                    </Grid>

                    <ComplianceTable title="Issues" noDataMessage={noDataMessage} invalidPermissionsMessage={invalidPermissionsMessage} loading={false} applications={applicationsData} />;
                    <ApplicationControls/>
                    {/* </Container> */}
                </Box>
            </div>
        </ThemeProvider>
    )
}


export async function getStaticPaths() {
    let pages = [];
    let location = 'services';
    try {
        const apps = await getApplications()
        const pages = apps.map((file) => {
            return '/applications/' + file.id
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
        const app = await getApplicationById(context.params.app_id);
        return {
            props: {
                app: app
            },
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                app: {}
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
  