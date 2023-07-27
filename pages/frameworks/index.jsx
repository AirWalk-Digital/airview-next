import React, { useState, useEffect } from 'react'
import WarningIcon from "@mui/icons-material/Warning";
import { Typography, Box, Button } from "@mui/material";
import { ProgressBar } from "../../components/airview-compliance-ui/features/progress-bar";
import { TopBar } from '@/components/dashboard';
import { baseTheme } from '../../constants/baseTheme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { getBaseFramework } from '../../backend/frameworks';
import Link from "next/link";
import { Stack } from '@mui/material'
import { Chip } from '@mui/material'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ButtonMenu, NavigationDrawer } from '@/components/airview-ui';
import { FrameworkCoverageTable } from '@/components/compliance/ControlFrameworkTables'


function FrameworkSection({ domain }) {


    return (
        <Accordion sx={{ my: '1%' }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography sx={{ width: '50%', flexShrink: 0 }}>{domain.title} ({domain.id})</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {domain.controls ? (
                    domain.controls.map((ct, i) => <FrameworkControl key={i} control={ct} />)
                ) : (
                    null
                )}

            </AccordionDetails>
        </Accordion>
    )
}

function FrameworkControl({ control }) {
    // // // console.log('control : ', control)

    return (
        <Box
            sx={{
                // bgcolor: 'background.paper',
                // borderColor: 'error', //icon.color,
                boxShadow: 0,
                border: 1,
                borderRadius: 2,
                p: 2,
                m: '1%'
                // minWidth: 300,
            }}
        >
            <Stack direction="row" spacing={1} sx={{ pt: '2%' }} alignItems="center" justifyContent="space-between">
                <Typography variant="h4" color='text.main'>{control.title}</Typography>
                <Chip label={control.id} variant="outlined" sx={{ ml: 'auto', mr: '5%' }} />
            </Stack>
            <Typography variant="body2" color='text.main'>{control.specification}</Typography>
        </Box>
    )
};

export default function Page({ framework }) {
    // // console.log('framework : ', framework)
    const [selectedControl, setControl] = useState('');
    const controlsNav = framework.domains.map(domain => ({
        groupTitle: domain.title,
        links: domain.controls.map(control => ({
            label: `${control.title} (${control.id})`,
            url: control.id
        }))
    }));

    const navDrawerWidth = 400;
    const topBarHeight = 64;
    const [menuOpen, setMenuOpen] = useState(true);

    function controlDomainNav(nav, setControl) {
        const handleButtonClick = (url, label) => {
            // Update the state or perform any other desired actions with the URL
            // // console.log("Clicked Label:", label);
            // Update the 'control' state in your page component
            setControl({url, label});
          };
        return nav.map((domain, i) => {
            return (
                <ButtonMenu key={i}
                    menuTitle={domain.groupTitle}
                    menuItems={[{ links: domain.links }]}
                    initialCollapsed={true}
                    loading={false}
                    fetching={false}
                    handleButtonClick={handleButtonClick}
                />
            )
        }
        )
    }



    const rows = [
        { id: 1, appName: 'Airview', businessUnit: 'Cloud CoE', exemptions: 35, controls: [{name: 'AC1', name: 'Control Storage Accounts', issues: 5, criticality: 'high'  },{name: 'AC2', name: 'Control Storage Accounts', issues: 5, criticality: 'high'  },{name: 'AC3', name: 'Control Storage Accounts', issues: 5, criticality: 'high'  }]},
        { id: 2, appName: 'Microsoft Teams', businessUnit: 'Central IT', exemptions: 42,controls: [{name: 'AC1', name: 'Control Storage Accounts', issues: 5, criticality: 'high'  },{name: 'AC2', name: 'Control Storage Accounts', issues: 5, criticality: 'high'  },{name: 'AC3', name: 'Control Storage Accounts', issues: 5, criticality: 'high'  }]},
        { id: 3, appName: 'Public Website', businessUnit: 'Marketing', exemptions: 45, controls: [{name: 'AC1', name: 'Control Storage Accounts', issues: 5, criticality: 'high'  },{name: 'AC2', name: 'Control Storage Accounts', issues: 5, criticality: 'high'  },{name: 'AC3', name: 'Control Storage Accounts', issues: 5, criticality: 'high'  }]},
      ];

    const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState); 
    
    return (
        <ThemeProvider theme={baseTheme}>
            <CssBaseline />
            <TopBar onNavButtonClick={handleOnNavButtonClick}
                navOpen={menuOpen}
                menu={true}
                topBarHeight={topBarHeight} />
            <NavigationDrawer
                open={menuOpen}
                top={topBarHeight}
                drawerWidth={navDrawerWidth}
            > {controlDomainNav(controlsNav, setControl)}

            </NavigationDrawer>
            <div style={{ marginTop: topBarHeight, paddingLeft: menuOpen ? navDrawerWidth : 0, }}>
                <Box sx={{ px: '5%' }}>
                    <Typography variant="h2">{ selectedControl ? selectedControl.label : "Framework Coverage"}</Typography>
                    <Typography variant="p">{framework.name} ({framework.version})</Typography>
                    <Grid container spacing={4} alignItems="stretch" sx={{ pt: '2%' }} justifyContent="center">
                        {/* <Grid item xs={3} md={3} sx={{ mb: '20px' }}>
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
                        </Grid> */}
                    </Grid>

                    {/* <Container maxWidth="lg" sx={{ mx:'0px', px:'0px', height: '100vh' }}> */}
                    {/* <>
                        {framework.domains ? (
                            framework.domains.map((fr, i) => <FrameworkSection key={i} domain={fr} />)
                        ) : (
                            null
                        )}
                    </> */}
                    {/* </Container> */}
                    <FrameworkCoverageTable rows={rows} sx={{ mt: '5%'}} />
                </Box>
            </div>
        </ThemeProvider>
    )
}

export async function getStaticProps() {
    try {
        const framework = await getBaseFramework();
        return {
            props: {
                framework: framework
            },
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                framework: {}
            },
        };
    }
}
