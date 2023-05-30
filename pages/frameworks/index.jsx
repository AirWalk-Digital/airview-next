import React, { useState, useEffect } from 'react'
import WarningIcon from "@mui/icons-material/Warning";
import { Typography, Box } from "@mui/material";
import {
    ApplicationTile,
    ApplicationTileHeader,
    ApplicationTileTitle,
    ApplicationTileDivider,
    ApplicationTileContent,
    ApplicationTileContentRow,
    ApplicationTileCallToActionButton,
    ApplicationTileChip,
} from "../../components/airview-compliance-ui/features/application-tile";
import { ProgressBar } from "../../components/airview-compliance-ui/features/progress-bar";
import Topbar from '../../components/TopBar';
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
import { Menu, NavigationDrawer } from '@/components/airview-ui';

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
    console.log('control : ', control)

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

    const navItemsDocs = [
        {
            groupTitle: "Infrastructure-as-Code",
            links: [
                {
                    label: "terraform-azure-storage",
                    url: "",
                },
            ],
        },
        {
            groupTitle: "Designs",
            links: [
                {
                    label: "Static Content Website",
                    url: "",
                },
                {
                    label: "Data Lakes",
                    url: "",
                },
            ],
        },
    ];
    const navDrawerWidth = 300;
    const topBarHeight = 64;
    const [menuOpen, setMenuOpen] = useState(true);

    const handleOnNavButtonClick = () => setMenuOpen((prevState) => !prevState); return (
        <ThemeProvider theme={baseTheme}>
            <CssBaseline />
            <Topbar onNavButtonClick={handleOnNavButtonClick}
                navOpen={menuOpen}
                menu={true}
                topBarHeight={topBarHeight} />
            <NavigationDrawer
                open={menuOpen}
                top={topBarHeight}
                drawerWidth={navDrawerWidth}
            >
                <Menu
                    menuTitle="Mapped Frameworks"
                    menuItems={navItemsDocs}
                    initialCollapsed={false}
                    loading={false}
                    fetching={false}
                    linkComponent={Link}

                />
            </NavigationDrawer>
            <div style={{ marginTop: topBarHeight, paddingLeft: menuOpen ? navDrawerWidth : 0, }}>
                <Box sx={{ px: '5%' }}>
                    <Typography variant="h1" component="h1">{framework.name} ({framework.version})</Typography>
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
                    <>
                        {framework.domains ? (
                            framework.domains.map((fr, i) => <FrameworkSection key={i} domain={fr} />)
                        ) : (
                            null
                        )}
                    </>
                    {/* </Container> */}
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
