import React from 'react';
import Box from '@mui/material/Box';

import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@mui/material/styles';
import { getContrastYIQ } from './utils/colors.js';

const useStyles = makeStyles(() => ({
    
    card: {
        borderRadius: '10px',
        transition: '0.3s',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#ffffff',
    },
    cardheader: {
    },
    content: {
        paddingTop: 0,
        textAlign: 'left',
        overflowX: 'auto',
        '& table': {
            marginBottom: 0,
        }
    },
}));

const Font = ({ children, size='medium', color = 'text.main', sx }) => {
    const theme = useTheme();
    let fontsize = '1.5rem' // p
    let margin = '0.5%'
    switch (size) {
        case 'xxlarge':
          fontsize = '2.5rem';
          break;
        case 'xlarge':
            fontsize = '2.2rem';
            break;
        case 'large':
            fontsize = '2rem';
            margin = '1%';
            break;
    }

    return (
        <Box sx={{"& > *": {fontSize: fontsize, marginTop: margin, marginBottom: margin }, ...sx }}>
        {children && children}
        </Box>
    );
};

export { Font }