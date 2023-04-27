import { Header, Banner, Footer } from 'airview-mdx'
// import React from 'react';
// import { siteConfig } from "../site.config.js";
// import { getContrastYIQ } from './utils/colors.js';

// import { useTheme } from '@mui/material/styles';

// import Box from '@mui/material/Box';
// import Image from 'next/image';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';

// export const Banner = ({ text = false, bottom = false, children, sx = {}, ...props }) => {
//     const theme = useTheme();
//     const sxTheme = {
//         width: '100%',
//         bgcolor: 'background.secondary',
//         px: '2.5%',
//         py: '1%',
//         margin: '0px',
//         color: getContrastYIQ(theme.palette.background.secondary, theme),
//         h2: {
//             margin: '0px',
//             color: getContrastYIQ(theme.palette.background.secondary, theme)
//         },
//         code: {
//             bgcolor: 'unset',

//         }
//     }

//     if (bottom) { bottom = 'auto' } else { bottom = 'unset' };

//     if (text && children) {
//         return (
//             <Box sx={{ color: (sx.backgroundColor === undefined) ? getContrastYIQ(theme.palette.background.secondary, theme) : getContrastYIQ(sx.backgroundColor, theme), ...sx, ...sxTheme }}>
//                 <Box>
//                     {children}
//                 </Box>
//             </Box>
//         )
//     } else if (!children && text) { // default header
//         return (
//             <Box sx={{ color: (sx.backgroundColor === undefined) ? getContrastYIQ(theme.palette.background.secondary, theme) : getContrastYIQ(sx.backgroundColor, theme), ...sx, ...sxTheme }}>
//                 <Box>
//                     {text}
//                 </Box>
//             </Box>
//         )


//     } else { // banner within the main body (bottom optional)

//         return (
//             <Box sx={{ color: (sx.backgroundColor === undefined) ? getContrastYIQ(theme.palette.background.secondary, theme) : getContrastYIQ(sx.backgroundColor, theme), display: 'flex', marginTop: bottom, borderRadius: '8px', ...sx, ...sxTheme }}>
//                 <Box>
//                     {children}
//                 </Box>
//             </Box>
//         )
//     }
// }
// export const Header = ({ heading, sx = {}, ...props }) => {
//     return (
//         <Box sx={{ height: '80px', px: "0px", mt: "15px", h1: { ml: '0', pt: '0.1%', mt: '0%', mb: '0.5%', pt: "0", ...sx } }}>
//             {heading && heading}
//         </Box>
//     )
// }

// export const Footer = ({ children, theme = useTheme(), sx = {}, ...props }) => (
//     <TableContainer sx={{ display: 'flex', color: theme.palette.text.main, width: '100%', height: '60px', bottom: '5px' }}>
//         <Table sx={{ borderCollapse: "unset", border: "unset", width: '100%', tableLayout: 'fixed' }}>
//             <TableBody>
//                 <TableCell sx={{p: '0'}}>
//                     <Image alt='airwalk logo' src={'/logos/airwalk-logo.png'} height={60} width={200} style={{ objectFit: 'contain', marginLeft: "5%" }} />
//                     <Image alt='customer logo' src={'/logos/customer-logo.png'} height={60} width={200} style={{ objectFit: 'contain', marginLeft: "5%" }} />
//                 </TableCell>
//                 <TableCell sx={{ textAlign: 'center', color: theme.palette.text.main, p: '0'}}>{siteConfig.tagline}</TableCell>
//                 <TableCell sx={{ textAlign: 'right', color: theme.palette.text.highlight, pr: '2.5%' }}>{siteConfig.company}</TableCell>
//             </TableBody>
//         </Table>
//     </TableContainer>
// );


export { Header, Banner, Footer }