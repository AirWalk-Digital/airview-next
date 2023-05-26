import React from "react";
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
import { getBusinessUnits } from '../../backend/business-units';
import Link from "next/link";

import { MiniStatisticsCard } from "../../components/dashboard";


export const AppTile = ({ name, app_id }) => {
    const location = '/business-units/' + app_id
    return (
        <Grid item xs={3} md={3} sx={{ mb: '20px' }}>
            <ApplicationTile>
                <ApplicationTileHeader
                    leftContent={
                        <ApplicationTileTitle>{name}</ApplicationTileTitle>
                    }
                    rightContent={
                        <ApplicationTileCallToActionButton component={Link} linkProps={{ href: location}} label="View" />
                    }
                />

                <ApplicationTileContent>
                    <ApplicationTileContentRow>
                        <ApplicationTileTitle size="small" level="h3">
                            Production
                        </ApplicationTileTitle>

                        <ProgressBar value={80} color="#2e7d32" />

                        <ApplicationTileTitle size="small" level="h3">
                            UAT
                        </ApplicationTileTitle>

                        <ProgressBar value={40} color="#1976d2" />

                        <ApplicationTileTitle size="small" level="h3">
                            Development
                        </ApplicationTileTitle>

                        <ProgressBar value={65} color="#d32f2f" />
                    </ApplicationTileContentRow>
                </ApplicationTileContent>

                <ApplicationTileDivider />

                <ApplicationTileContent collapsible initialCollapsed={true}>
                    <ApplicationTile gutter>
                        <ApplicationTileHeader
                            dense
                            leftContent={
                                <ApplicationTileTitle level="h4">Production</ApplicationTileTitle>
                            }
                        />

                        <ApplicationTileContent>
                            <ApplicationTileContentRow inlineContent>
                                <ApplicationTileChip
                                    tooltipLabel="Low Impact Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="success.main"
                                />

                                <ApplicationTileChip
                                    tooltipLabel="Medium Impact Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="warning.main"
                                />

                                <ApplicationTileChip
                                    tooltipLabel="High Impact Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="error.main"
                                />

                                <ApplicationTileChip
                                    tooltipLabel="Exempt Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="grey.800"
                                />
                            </ApplicationTileContentRow>
                        </ApplicationTileContent>
                    </ApplicationTile>

                    <ApplicationTile gutter>
                        <ApplicationTileHeader
                            dense
                            leftContent={
                                <ApplicationTileTitle level="h4">UAT</ApplicationTileTitle>
                            }
                        />

                        <ApplicationTileContent>
                            <ApplicationTileContentRow inlineContent>
                                <ApplicationTileChip
                                    tooltipLabel="Low Impact Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="success.main"
                                />

                                <ApplicationTileChip
                                    tooltipLabel="Medium Impact Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="warning.main"
                                />

                                <ApplicationTileChip
                                    tooltipLabel="High Impact Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="error.main"
                                />

                                <ApplicationTileChip
                                    tooltipLabel="Exempt Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="grey.800"
                                />
                            </ApplicationTileContentRow>
                        </ApplicationTileContent>
                    </ApplicationTile>

                    <ApplicationTile>
                        <ApplicationTileHeader
                            dense
                            leftContent={
                                <ApplicationTileTitle level="h4">
                                    Development
                                </ApplicationTileTitle>
                            }
                        />

                        <ApplicationTileContent>
                            <ApplicationTileContentRow inlineContent>
                                <ApplicationTileChip
                                    tooltipLabel="Low Impact Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="success.main"
                                />

                                <ApplicationTileChip
                                    tooltipLabel="Medium Impact Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="warning.main"
                                />

                                <ApplicationTileChip
                                    tooltipLabel="High Impact Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="error.main"
                                />

                                <ApplicationTileChip
                                    tooltipLabel="Exempt Resources"
                                    icon={<WarningIcon />}
                                    label="2"
                                    dense
                                    color="grey.800"
                                />
                            </ApplicationTileContentRow>
                        </ApplicationTileContent>
                    </ApplicationTile>
                </ApplicationTileContent>
            </ApplicationTile>
        </Grid>
    );
};


export default function Page({ businessUnits }) {

    const topBarHeight = 64;

    return (
        <ThemeProvider theme={baseTheme}>
            <CssBaseline />
            <Topbar menu={false} topBarHeight={topBarHeight} logo={true} />
            <div style={{ marginTop: topBarHeight, paddingLeft: 0, }}
            ><Box sx={{ px: '5%' }}>
                    <Typography variant="h1" component="h1">Business Units</Typography>


                    <Grid container spacing={4} alignItems="stretch" sx={{ pt: '2%' }} justifyContent="center">
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

                    <Container maxWidth="lg" sx={{ height: '100vh' }}>
                        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
                            {businessUnits ? (
                                businessUnits.map((bu, i) => <AppTile key={i} name={bu.name} app_id={bu.bu_id} />)
                            ) : (
                                null
                            )}
                        </Grid>
                    </Container>
                </Box>
            </div>
        </ThemeProvider>
    )
}

export async function getStaticProps() {
    try {
        const businessUnits = await getBusinessUnits();
        return {
            props: {
                businessUnits: businessUnits
            },
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                businessUnits: {}
            },
        };
    }
}
