import React from 'react';
// import awLogo from '../assets/logos/airwalk-logo.png';
// import customerLogo from '../assets/logos/customer-logo.png';
import { getContrastYIQ } from './utils/colors.js';

import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Image from 'next/image';


export const Banner = ({ text = false, bottom = false, children, sx = {}, ...props }) => {
    const theme = useTheme();
    const sxTheme = {
        width: '100%',
        bgcolor: 'background.secondary',
        px: '2.5%',
        py: '1%',
        margin: '0px',
        color: getContrastYIQ(theme.palette.background.secondary, theme),
        h2: {
            margin: '0px',
            color: getContrastYIQ(theme.palette.background.secondary, theme)
        },
        code: {
            bgcolor: 'unset',

        }
    }

    if (bottom) { bottom = 'auto' } else { bottom = 'unset' };

    if (text && children) {
        return (
            <Box sx={{ color: (sx.backgroundColor === undefined) ? getContrastYIQ(theme.palette.background.secondary, theme) : getContrastYIQ(sx.backgroundColor, theme), ...sx, ...sxTheme }}>
                <Box>
                   {children}
                </Box>
            </Box>
        )
    } else if (!children && text) { // default header
        return (
            <Box sx={{ color: (sx.backgroundColor === undefined) ? getContrastYIQ(theme.palette.background.secondary, theme) : getContrastYIQ(sx.backgroundColor, theme), ...sx, ...sxTheme }}>
                <Box>
                {text}
                </Box>
            </Box>
        )


    } else { // banner within the main body (bottom optional)

        return (
            <Box sx={{  color: (sx.backgroundColor === undefined) ? getContrastYIQ(theme.palette.background.secondary, theme) : getContrastYIQ(sx.backgroundColor, theme), display: 'flex', marginTop: bottom,borderRadius: '8px', ...sx, ...sxTheme }}>
                <Box>
                    {children}
                </Box>
            </Box>
        )
    }
}
export const Header = ({ heading, sx = {}, ...props }) => {
    return (
        <Box sx={{ height: '80px', px: "2.5%", mt: "15px", h1: { pt: '0.1%', mt: '0%', mb: '0.5%', pt: "0", ...sx } }}>
            {heading && heading}
        </Box>
    )
}


export const Footer = ({ children, sx = {}, ...props }) => (
    <Box  height="60px"
        sx={{
            display: "flex",
            // position: "absolute",
            marginTop: 'auto',
           
            justifyContent: "space-between",
            // position: "absolute",
            bottom: "5px",
            width: "100%",
            alignItems: "center",
            px: "1%",
            background: "white"
        }}
    >
        <Box height='60px' sx={{ display: "flex",  alignItems: "flex-end" }}>
            <Image alt='airwalk logo' src={'/logos/airwalk-logo.png'}  height={60} width={200} style={{objectFit: 'contain', marginLeft: "5%"}} />
            <Image alt='customer logo' src={'/logos/customer-logo.png'} height={60} width={200} style={{objectFit: 'contain', marginLeft: "5%"}} />
        </Box>
        <Box sx={{  }}>technology, done right</Box>
        <Box sx={{  }}>airwalkreply.com</Box>
    </Box>
);


// export { Header, Banner, Footer };