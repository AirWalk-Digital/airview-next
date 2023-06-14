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
import { TopBar } from '@/components/dashboard';
import { baseTheme } from '../../constants/baseTheme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { getApplications } from '../../backend/applications';
import Link from "next/link";
import { Stack } from '@mui/material'
import { Chip } from '@mui/material'

const ButtonLink = ({ className, href, hrefAs, children, prefetch }) => (
    <Link href={href} as={hrefAs} prefetch>
      <a className={className}>
        {children}
      </a>
    </Link>
  )

export const AppTile = ({ name, app_id, data_classification='Public', tier=3 }) => {
    const location = '/applications/' + app_id
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
                    <Stack direction="row" spacing={1} sx={{ pt: '2%' }}>
          {data_classification === 'Public' && <Chip label="Data: Public" color="success" />}
          {data_classification === 'Restricted' && <Chip label="Data: Restricted" color="warning" />}
          {data_classification === 'Highly Restricted' && <Chip label="Data: Highly Restricted" color="error" />}
          {tier && <Chip label={`Tier ${tier}`} variant="outlined"/>}

        </Stack>
                        <ApplicationTileTitle size="small" level="h3">
                            Compliance
                        </ApplicationTileTitle>

                        <ProgressBar value={80} color="#2e7d32" />

                        {/* <ApplicationTileTitle size="small" level="h3">
                            UAT
                        </ApplicationTileTitle>

                        <ProgressBar value={40} color="#1976d2" />

                        <ApplicationTileTitle size="small" level="h3">
                            Development
                        </ApplicationTileTitle>

                        <ProgressBar value={65} color="#d32f2f" /> */}
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


export default function Page({ apps }) {
    const topBarHeight = 64;
    return (
        <ThemeProvider theme={baseTheme}>
            <CssBaseline />
            <TopBar menu={false} topBarHeight={topBarHeight} logo={true} />
            <div style={{ marginTop: topBarHeight, paddingLeft: 0, }}
            ><Box sx={{ px: '5%' }}>
                    <Typography variant="h1" component="h1">Applications</Typography>

                    <Typography variant="body1">Welcome to the Cloud Applications section of our internal website, dedicated to providing comprehensive documentation for our IT teams. Here, you will find a wealth of information on our suite of cloud-based applications, designed to enhance efficiency, scalability, and collaboration across our organization. As an IT professional, this section serves as your go-to resource for understanding the ins and outs of our cloud applications, from deployment and configuration to ongoing management and troubleshooting. Explore our extensive documentation to gain valuable insights into the features, integrations, and best practices for leveraging the power of our cloud applications. Let's embark on a journey through the world of cloud technology and equip ourselves with the knowledge needed to drive innovation and success within our organization. </Typography>
                    <Container maxWidth="lg" sx={{ py:'5%', height: '100vh' }}>
                        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
                                {apps ? (
                                    apps.map((app, i) => <AppTile key={i} name={app.name} app_id={app.app_id} tier={app.tier} data_classification={app.data_classification} />)
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
        const apps = await getApplications();
        return {
            props: {
                apps: apps
            },
        };
    } catch (error) {
        console.error(error);
        return {
            props: {
                apps: {}
            },
        };
    }
}
