import React from 'react';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid'; 
import Paper from '@mui/material/Paper';

import { useTheme } from '@mui/material/styles';


const Layout = ({ children, spill = 0, centre = false, sx = {} }) => {
    const theme = useTheme();
    let alignment = 'normal'
    if (centre) {alignment='center'}

    if (spill) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", px: "1%", py: "0%", height: '100%', justifyContent: alignment}} >
            <div style={{ columnCount: spill, height:'100%' }}>
              {children}
            </div>
          </Box>
        )
    }
    else {
    return (
        <Grid container justifyContent="center" spacing={2} sx={{px:'1%', height:'100%', h1: {backgroundColor: 'unset'}, overflow:'hidden', ...sx}}>
            {children}
        </Grid>
    )}
};

const Column = ({ children, width=6, sx = {} }) => {
    const theme = useTheme();

    return (

        <Grid item xs={width} sx={{height: '100%', overflow:'hidden', ...sx}}>
            <Paper elevation={0} sx={{px:'2%', py:'2%', height:'100%', objectFit:'contain'}}>
            {children}
            </Paper>
        </Grid>
    )
};

const Item = ({ children, width=6, sx = {} }) => {
    const theme = useTheme();

    return (

        <Grid item xs={width} sx={{ overflow:'hidden', ...sx}}>
            <Paper elevation={0} sx={{px:'2%', py:'2%', height:'100%', img: { width: '100%', height: '100%'}}}>
            {children}
            </Paper>
        </Grid>
    )
};


export { Layout, Column, Item };
