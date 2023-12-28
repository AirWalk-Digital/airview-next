import React from 'react'

import Grid from '@mui/material/Grid';

import { Stack } from '@mui/material'
import { Chip } from '@mui/material'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Box } from '@mui/material';
import { Container as MuiContainer } from "@mui/material";


export function ServicesHeader({ frontmatter, extraData }) {


  if (!frontmatter) { return <></> }

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

      </Grid>
      {/* </Container> */}
      </MuiContainer>
  )
}



