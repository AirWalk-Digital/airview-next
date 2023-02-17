import React from 'react';
import awLogo from '../assets/logos/airwalk-logo.png';
import customerLogo from '../assets/logos/customer-logo.png';
import { getContrastYIQ } from './utils/colors.js';

import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Image from 'next/image'


export const Banner = ({ text = false, bottom = false, children, sx = {}, ...props }) => {
    const theme = useTheme();
    const sxTheme = {
        width: '100%',
        bgcolor: 'background.secondary',
        px: '2.5%',
        py: '1%',
        margin: '0px',
        color: getContrastYIQ(theme.palette.background.secondary),
        h2: {
            margin: '0px',
            color: getContrastYIQ(theme.palette.background.secondary)
        },
    }

    if (bottom) { bottom = 'auto' } else { bottom = 'unset' };

    if (text && children) {
        return (
            <Box sx={{ color: (sx.backgroundColor === undefined) ? getContrastYIQ(theme.palette.background.secondary) : getContrastYIQ(sx.backgroundColor), ...sx, ...sxTheme }}>
                <Box>
                    {children}
                </Box>
            </Box>
        )
    } else if (!children && text) {
        return (
            <Box sx={{ color: (sx.backgroundColor === undefined) ? getContrastYIQ(theme.palette.background.secondary) : getContrastYIQ(sx.backgroundColor), ...sx, ...sxTheme }}>
                <Box>
                    {text}
                </Box>
            </Box>
        )


    } else { // banner within the main body (bottom optional)

        return (
            <Box sx={{  color: (sx.backgroundColor === undefined) ? getContrastYIQ(theme.palette.background.secondary) : getContrastYIQ(sx.backgroundColor), display: 'flex', marginTop: bottom,borderRadius: '8px', ...sx, ...sxTheme }}>
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
            // position: "absolute",
            marginTop: 'auto',
            height: "60px",
            justifyContent: "space-between",
            // position: "absolute",
            bottom: "5px",
            width: "100%",
            alignItems: "center",
            px: "1%",
            background: "white"
        }}
    >
        <Box sx={{ display: "flex", height: "80%", alignItems: "flex-end" }}>
            <Image src={awLogo} height={50} style={{ marginLeft: "5%" }} />
            <Image src={customerLogo} height={50} style={{ marginLeft: "5%" }} />
        </Box>
        <Box sx={{ variant: "styles.p" }}>technology, done right</Box>
        <Box sx={{ variant: "styles.p" }}>airwalkreply.com</Box>
    </Box>
);


// export { Header, Banner, Footer };