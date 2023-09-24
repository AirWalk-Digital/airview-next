import React from 'react'

import Grid from '@mui/material/Grid';

import { Stack } from '@mui/material'
import { Chip } from '@mui/material'
import { MiniStatisticsCard } from "@/components/dashboard";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box } from '@mui/material';
import { Container as MuiContainer } from "@mui/material";


export function ServicesHeader({ frontmatter, extraData }) {

  const controlCoverage = createControlCoverage(extraData);

  if (!frontmatter) { return <></> }
  // frontmatter = frontmatter.frontmatter
  // console.log('ServicesHeader:controlCoverage: ', controlCoverage)
  // // console.log('ServicesHeader:frontmatter: ', frontmatter)

  let icon = { color: 'success', icon: 'check' }

  if (controlCoverage && controlCoverage.controlCoverage < 50) {
    icon = { color: 'error', icon: 'circle-exclamation' }
  } else if (controlCoverage && controlCoverage.controlCoverage < 100) {
    icon = { color: 'warning', icon: 'triangle-exclamation' }
  } else if (!controlCoverage.controlCoverage) {
    icon = { color: 'info', icon: 'circle-exclamation' }
  }

  return (
    <MuiContainer maxWidth={false} disableGutters sx={{ paddingTop: 0, paddingBottom: 0 }}>
    {/* <Box sx={{ display: "flex" }}>{children}</Box> */}
  
      {/* <Container sx={{ px: '0px', mb: '2%' }}> */}
      <Grid container spacing={0} alignItems="center" sx={{ mb: '1%' }}>
        <Grid item xs={8}>
          <Typography variant="h1" component="h1">{frontmatter.title}</Typography>
          <Stack direction="row" spacing={1}>
            {frontmatter.status === 'approved' ? <Chip label="Approved for use" color="success" /> : <Chip label="Unapproved" color="error" />}
            {(frontmatter?.resilience?.redundancy) ? <Chip label={`Redundancy: ${frontmatter.resilience.redundancy}`} color="success" /> : <Chip label="No Redundancy info" color="error" />}
            {frontmatter?.resilience?.find(item => item.name === "availability") ? (
              <Chip
                label={`Availability: ${frontmatter.resilience.find(item => item.name === "availability").availability}`}
                color="success"
              />
            ) : (
              <Chip label="No SLA Defined" color="error" />
            )}

          </Stack>
        </Grid>
        <Grid item xs={4}>
          <MiniStatisticsCard
            color="text.highlight"
            title="Controls"
            count={controlCoverage.controlCount}
            percentage={{ value: controlCoverage.controlCoverage ? controlCoverage.controlCoverage : '0', text: "% coverage" }}
            icon={icon}
          />
        </Grid>
      </Grid>
      {/* </Container> */}
      </MuiContainer>
  )
}





function createControlCoverage(controls) {
  // // console.log('createControlCoverage:controls: ', controls)

  let controlCountCovered = 0
  let controlCountUnCovered = 0
  let controlMethods = 0
  let controlCoverage = 0


  for (const control of controls) {
    if (control.data && control.data.methods && control.data.methods.length > 0) {
      controlMethods += control.data.methods.length
      controlCountCovered++
    } else {
      controlCountUnCovered++
    }
  }
  // calculate the percentage of covered controls vs controls
  controlCoverage = Math.round((controlCountCovered / controls.length) * 100)
  // // console.log('createControlCoverage:controlCoverage: ', controlCoverage)
  return ({ controlCountCovered, controlCountUnCovered, controlMethods, controlCoverage, controlCount: controls.length })
};

