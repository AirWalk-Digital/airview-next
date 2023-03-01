import React from 'react';
// import cx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@mui/material/Card';;
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
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

const HeaderCard = ({ children, color = 'secondary', sx }) => {
    const theme = useTheme();
    const classes = useStyles();
    let heading = '';
    let subheading = '';
    if (children && Object.keys(children).length === 0 && children.constructor === Object) { children = '' } else {
        if (Array.isArray(children)) { // multiple lines
            if (children[0].type.name === 'h1') {
                heading = children[0].props.children;
                children = children.filter(function(obj, index) {
                    return index !== 0; // return false for index 1
                  });
                if (children[0].type.name === 'h2') {
                    subheading = children[0].props.children;
                    children = children.filter(function(obj, index) {
                        return index !== 0; // return false for index 1
                      });
                };
            };
        } 
    };
    console.log('HeaderCard:children : ', children)
    return (
        <Grid item xs={3} sx={{ paddingLeft: '10px', paddingRight: '10px', overFlow: 'hidden', maxHeight: '100%' }}>
            <Card variant="outlined" className={classes.card} sx={{ ...sx }}>
                {heading && <CardHeader
                    title={heading}
                    titleTypographyProps={{ color: getContrastYIQ(theme.palette.background[color], theme), fontSize: '2rem' }}
                    subheader={subheading}
                    subheaderTypographyProps={{ color: getContrastYIQ(theme.palette.background[color], theme), fontSize: '1.8rem' }}
                    sx={{ backgroundColor: 'background.' + color, color: getContrastYIQ(theme.palette.background[color], theme) }} />}
                <CardContent className={classes.content}>
                    {children && children}
                </CardContent>
            </Card>
        </Grid>
    );
};

export { HeaderCard }