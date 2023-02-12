import React from 'react';
import awLogo from '../assets/logos/airwalk-logo.png';
import customerLogo from '../assets/logos/customer-logo.png';
import { getContrastYIQ } from './utils/colors.js';

import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';

export const Banner = ({ text = false, bottom = false, children, sx = {}, ...props }) => {
    const theme = useTheme();

    const sxTheme = {
        width: '100%',
        bgcolor: 'background.secondary',
        fontFamily: "Heebo",
        px: '2.5%',
        py: '1%',
        margin: '0px',
        fontSize: 'small',
        fontWeight: 'default',
        lineHeight: 'default',
        h2: {
            fontSize: 'small',
            fontWeight: 'default',
            lineHeight: 'default',
            margin: '0px',
        },
    }

    if (bottom) { bottom = 'auto' } else { bottom = 'unset' };

    if (text && children) {
        return (
            <Box sx={{ color: (sx.backgroundColor === undefined) ? getContrastYIQ(getColor(theme, 'secondary')) : getContrastYIQ(getColor(theme, sx.backgroundColor)), ...sx, ...sxTheme }}>
                <Box>
                    {children}
                </Box>
            </Box>
        )
    } else if (!children && text) {
        return (
            <Box sx={{ color: (sx.backgroundColor === undefined) ? getContrastYIQ(getColor(theme, 'secondary')) : getContrastYIQ(getColor(theme, sx.backgroundColor)), ...sx, ...sxTheme }}>
                <Box>
                    {text}
                </Box>
            </Box>
        )


    } else { // banner within the main body (bottom optional)

        return (
            <Box sx={{  color: (sx.backgroundColor === undefined) ? getContrastYIQ('background.secondary') : getContrastYIQ(sx.backgroundColor), display: 'flex', marginTop: bottom,borderRadius: '8px', ...sx, ...sxTheme }}>
                <Box>
                    {children}
                </Box>
            </Box>
        )
    }
}
export const Header = ({ heading, sx = {}, ...props }) => {
    return (
        <Box sx={{ px: "2.5%", pt: "15px", h1: { pt: '0.1%', mt: '0%', mb: '0.5%', pt: "0" } }}>
            {heading && heading}
        </Box>
    )
}


export const Footer = ({ children, sx = {}, ...props }) => (
    <Box
        sx={{
            display: "flex",
            position: "absolute",
            height: "60px",
            justifyContent: "space-between",
            // position: "absolute",
            bottom: "0px",
            width: "100%",
            alignItems: "center",
            px: "1%",
            background: "white"
        }}
    >
        <Box sx={{ display: "flex", height: "80%", alignItems: "flex-end" }}>
            <img src={awLogo} height="100%" style={{ marginLeft: "5%" }} />
            <img src={customerLogo} height="100%" style={{ marginLeft: "5%" }} />
        </Box>
        <Box sx={{ variant: "styles.p" }}>technology, done right</Box>
        <Box sx={{ variant: "styles.p" }}>airwalkreply.com</Box>
    </Box>
);


// export { Header, Banner, Footer };