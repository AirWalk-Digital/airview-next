import React from 'react';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid'; // Grid version 2
import Paper from '@mui/material/Paper';

import { useTheme } from '@mui/material/styles';


const ColumnLayout = ({ children, sx = {} }) => {
    const theme = useTheme();

    return (

        <Grid container spacing={2} sx={{px:'2%', height:'100%', h1: {backgroundColor: 'unset'}, ...sx}}>
            {children}
        </Grid>
    )
};

const Column = ({ children, width=6, sx = {} }) => {
    const theme = useTheme();

    return (

        <Grid item xs={width} sx={{height: '100%', ...sx}}>
            <Paper elevation={0} sx={{px:'2%', py:'2%', height:'100%', img: { width: '100%', height: '100%'}}}>
            {children}
            </Paper>
        </Grid>
    )
};


export { ColumnLayout, Column };
