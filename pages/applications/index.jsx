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
import { TopBar } from "@/components/dashboard";
import { baseTheme } from "../../constants/baseTheme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { getApplications, getComplianceData } from "../../backend/applications";
import Link from "next/link";
import { Stack } from "@mui/material";
import { Chip } from "@mui/material";

const ButtonLink = ({ className, href, hrefAs, children, prefetch }) => (
  <Link href={href} as={hrefAs} prefetch>
    <a className={className}>{children}</a>
  </Link>
);

export const AppTile = ({
  name,
  id,
  data_classification = "Public",
  tier = 3,
  complianceData,
}) => {
  const filteredData = complianceData.filter((f) => f.applicationName === name);

  let runningTotal = 0;
  let runningCompliant = 0;
  const output = filteredData.reduce((accumulator, current) => {
    const { environmentName, controlSeverity, total, isCompliant, excluded } =
      current;

    runningTotal += total;
    runningCompliant += isCompliant;
    if (!accumulator[environmentName]) {
      // If the environmentName doesn't exist in the accumulator, create it with initial values
      accumulator[environmentName] = {
        environmentName,
        HIGH: 0,
        LOW: 0,
        MEDIUM: 0,
        CRITICAL: 0,
        EXCLUDED: 0,
      };
    }

    // Calculate the difference between total and isCompliant
    const difference = total - isCompliant;

    // Update the count for the controlSeverity
    accumulator[environmentName][controlSeverity] += difference;

    // Update the running total for excluded
    accumulator[environmentName].EXCLUDED += excluded;

    return accumulator;
  }, {});

  // Convert the object into an array of values
  const finalOutput = Object.values(output);

  const location = "/applications/" + id;
  return (
    <Grid item xs={3} md={3} sx={{ mb: "20px" }}>
      <ApplicationTile>
        <ApplicationTileHeader
          leftContent={<ApplicationTileTitle>{name}</ApplicationTileTitle>}
          rightContent={
            <ApplicationTileCallToActionButton
              component={Link}
              linkProps={{ href: location }}
              label="View"
            />
          }
        />

        <ApplicationTileContent>
          <ApplicationTileContentRow>
            <Stack direction="row" spacing={1} sx={{ pt: "2%" }}>
              {data_classification === "Public" && (
                <Chip label="Data: Public" color="success" />
              )}
              {data_classification === "Restricted" && (
                <Chip label="Data: Restricted" color="warning" />
              )}
              {data_classification === "Highly Restricted" && (
                <Chip label="Data: Highly Restricted" color="error" />
              )}
              {tier && <Chip label={`Tier ${tier}`} variant="outlined" />}
            </Stack>
            <ApplicationTileTitle size="small" level="h3">
              Compliance
            </ApplicationTileTitle>

            <ProgressBar
              value={(runningCompliant / runningTotal) * 100}
              color="#2e7d32"
            />
          </ApplicationTileContentRow>
        </ApplicationTileContent>

        <ApplicationTileDivider />

        {finalOutput.map((m) => {
          return (
            <ApplicationTileContent collapsible initialCollapsed={true}>
              <ApplicationTile gutter>
                <ApplicationTileHeader
                  dense
                  leftContent={
                    <ApplicationTileTitle level="h4">
                      {m.environmentName}
                    </ApplicationTileTitle>
                  }
                />

                <ApplicationTileContent>
                  <ApplicationTileContentRow inlineContent>
                    <ApplicationTileChip
                      tooltipLabel="Critical Impact Resources"
                      icon={<WarningIcon />}
                      label={m.CRITICAL.toString()}
                      dense
                      color="success.main"
                    />

                    <ApplicationTileChip
                      tooltipLabel="High Impact Resources"
                      icon={<WarningIcon />}
                      label={m.HIGH.toString()}
                      dense
                      color="warning.main"
                    />

                    <ApplicationTileChip
                      tooltipLabel="Medium Impact Resources"
                      icon={<WarningIcon />}
                      label={m.MEDIUM.toString()}
                      dense
                      color="error.main"
                    />

                    <ApplicationTileChip
                      tooltipLabel="Low Resources"
                      icon={<WarningIcon />}
                      label={m.LOW.toString()}
                      dense
                      color="grey.800"
                    />

                    <br />
                    {`Excluded: ${m.EXCLUDED.toString()}`}
                  </ApplicationTileContentRow>
                </ApplicationTileContent>
              </ApplicationTile>
            </ApplicationTileContent>
          );
        })}
      </ApplicationTile>
    </Grid>
  );
};

export default function Page({ apps, complianceData }) {
  const topBarHeight = 64;
  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <TopBar menu={false} topBarHeight={topBarHeight} logo={true} />
      <div style={{ marginTop: topBarHeight, paddingLeft: 0 }}>
        <Box sx={{ px: "5%" }}>
          <Typography variant="h1" component="h1">
            Applications
          </Typography>
          <Typography variant="body1">
            Welcome to the Cloud Applications section of our internal website,
            dedicated to providing comprehensive documentation for our IT teams.
            Here, you will find a wealth of information on our suite of
            cloud-based applications, designed to enhance efficiency,
            scalability, and collaboration across our organization. As an IT
            professional, this section serves as your go-to resource for
            understanding the ins and outs of our cloud applications, from
            deployment and configuration to ongoing management and
            troubleshooting. Explore our extensive documentation to gain
            valuable insights into the features, integrations, and best
            practices for leveraging the power of our cloud applications. Let's
            embark on a journey through the world of cloud technology and equip
            ourselves with the knowledge needed to drive innovation and success
            within our organization.{" "}
          </Typography>
          <Container maxWidth="lg" sx={{ py: "5%", height: "100vh" }}>
            <Grid
              container
              spacing={4}
              alignItems="stretch"
              justifyContent="center"
            >
              {apps
                ? apps.map((app, i) => (
                    <AppTile
                      key={i}
                      name={app.name}
                      app_id={app.app_id}
                      complianceData={complianceData}
                      tier={app.tier}
                      data_classification={app.data_classification}
                    />
                  ))
                : null}
            </Grid>
          </Container>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export async function getServerSideProps() {
  try {
    const apps = await getApplications();
    const complianceData = await getComplianceData();
    return {
      props: {
        apps,
        complianceData,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        apps: [],
      },
    };
  }
}
