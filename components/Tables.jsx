import React from 'react';
import { useTheme } from '@mui/material/styles';
import { getContrastYIQ } from './utils/colors.js';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


const ProgressTable = ({ children, headercolumn = false, width = '100%', sx = {}, ...props }) => {
  const theme = useTheme();
  if (!children.props) {return( <TableRow></TableRow>)}
  const topLeft = (children) => { // by default, hide the top left header
    if (Array.isArray(children.props.children)) { //multiple rows in the table
      children = children.props.children[0]
    } else if (typeof children.props.children === 'object') { // single row in the table
      children = children.props.children
    }
    if (children.props.children.props.children[0].props.children) {return (true)} else {return (false)} // there is content in the top left corner. show the full header.     
  };
  
  const HeadingRow = ({ children }) => {
    let row = '';
    if (Array.isArray(children)) { //multiple rows in the table
      row = children[0]
    } else if (typeof children === 'object') { // single row in the table
      row = children
    }
    return (
      <TableRow>
        {row.props.children.props.children.map((cell) => (
          <TableCell sx={{whiteSpace: 'nowrap', ...thsx}}>{cell.props.children}</TableCell>
        ))}
      </TableRow>
    )
  }

  const Rows = ({ children }) => {
    if (Array.isArray(children)) { // there are some rows in the table (not just a header)
      children = children[1].props.children
      if (Array.isArray(children)) { //multiple rows in the table
        return (
        children.map((row) => (
          <TableRow>
            {row.props.children.map((cell) => (
              <TableCell>{cell.props.children}</TableCell>
            ))}
          </TableRow>
        ))
        )
      } else if (typeof children === 'object') { // single row in the table
        return (
            <TableRow>
              {children.props.children.map((cell) => (
                <TableCell>{cell.props.children}</TableCell>
              ))}
            </TableRow>
          )

      } else {
        return (
          <TableRow></TableRow>
        )
      }
   
    } else {
      return (
        <TableRow></TableRow>
      )
    }
  }
  const thsx_1st_header ={
      height: "80px",
      background: theme.palette.text.main,
      textAlign: "center",
      padding: "10px 40px 10px 40px",
      position: "relative",
      margin: "0 10px 0 0",
      fontSize: "20px",
      textDecoration: "none",
      borderColor: theme.palette.background.paper,
      color: getContrastYIQ(theme.palette.background.primary, theme),
    '&:after': {
      content: '""',
      borderTop: "40px solid transparent",
      borderBottom: "40px solid transparent",
      borderLeft: "40px solid",
      borderLeftColor: theme.palette.text.main,
      position: "absolute",
      right: "-40px",
      top: "0",
      zIndex: 1
    },
    '&:not(:last-child)': { borderRight: "10px solid", borderRightColor: theme.palette.background.paper },
    '&:before': {
      content: '""',
      borderTop: "40px solid transparent",
      borderBottom: "40px solid transparent",
      borderLeft: "40px solid",
      borderLeftColor: theme.palette.background.paper,
      position: "absolute",
      left: "0",
      top: "0"
    },
    '&:first-of-type': {
      borderTopLeftRadius: "10px",
      borderBottomLeftRadius: "10px"
    },
    '&:first-of-type:before': { display: "none" },
    '&:last-child:after': {
      borderTop: "40px solid",
      borderTopColor: theme.palette.background.paper,
      borderBottom: "40px solid",
      borderBottomColor: theme.palette.background.paper,
      borderLeft: "40px solid",
      borderLeftColor: theme.palette.text.main,
      position: "absolute",
      right: "0px",
      top: "0",
      zIndex: 1
    },
    '&:nth-of-type(2):after': {
      borderLeftColor: theme.palette.background.secondary,
    },
    '&:nth-of-type(2)': {
      background: theme.palette.background.secondary,
      color: getContrastYIQ(theme.palette.background.secondary, theme)
    },
    '&:nth-of-type(3):after': {
      borderLeftColor: theme.palette.background.tertiary,
    },
    '&:nth-of-type(3)': {
      background: theme.palette.background.tertiary,
      color: getContrastYIQ(theme.palette.background.tertiary, theme)
    },
    '&:nth-of-type(4):after': {
      borderLeftColor: theme.palette.background.quaternary,
    },
    '&:nth-of-type(4)': {
      background: theme.palette.background.quaternary,
      color: getContrastYIQ(theme.palette.background.quaternary, theme)
    },
    '&:nth-of-type(5):after': {
      borderLeftColor: theme.palette.background.highlight,
    },
    '&:nth-of-type(5)': {
      background: theme.palette.background.highlight,
      color: getContrastYIQ(theme.palette.background.highlight, theme)
    },
  }

  const thsx_no_1st_header ={
    height: "80px",
    background: theme.palette.text.main,
    textAlign: "center",
    padding: "10px 40px 10px 40px",
    position: "relative",
    margin: "0 10px 0 0",
    fontSize: "20px",
    textDecoration: "none",
    borderColor: theme.palette.background.paper,
    color: getContrastYIQ(theme.palette.background.primary, theme),
  '&:after': {
    content: '""',
    borderTop: "40px solid transparent",
    borderBottom: "40px solid transparent",
    borderLeft: "40px solid",
    borderLeftColor: theme.palette.text.main,
    position: "absolute",
    right: "-40px",
    top: "0",
    zIndex: 1
  },
  '&:not(:last-child)': { borderRight: "10px solid", borderRightColor: theme.palette.background.paper },
  '&:not(:nth-of-type(2)):before': {
    content: '""',
    borderTop: "40px solid transparent",
    borderBottom: "40px solid transparent",
    borderLeft: "40px solid",
    borderLeftColor: theme.palette.background.paper,
    position: "absolute",
    left: "0",
    top: "0"
  },
  '&:first-of-type': {
    background: theme.palette.background.paper,
    color: theme.palette.background.paper,
  },
  '&:first-of-type:before': { display: "none" },
  '&:first-of-type:after': { display: "none" },
  '&:last-child:after': {
    borderTop: "40px solid",
    borderTopColor: theme.palette.background.paper,
    borderBottom: "40px solid",
    borderBottomColor: theme.palette.background.paper,
    borderLeft: "40px solid",
    borderLeftColor: theme.palette.text.main,
    position: "absolute",
    right: "0px",
    top: "0",
    zIndex: 1
  },
  '&:nth-of-type(2):after': {
    borderLeftColor: theme.palette.background.secondary,
  },
  '&:nth-of-type(2)': {
    background: theme.palette.background.secondary,
    color: getContrastYIQ(theme.palette.background.secondary, theme),
    borderTopLeftRadius: "10px",
    borderBottomLeftRadius: "10px"
  },
  '&:nth-of-type(3):after': {
    borderLeftColor: theme.palette.background.tertiary,
  },
  '&:nth-of-type(3)': {
    background: theme.palette.background.tertiary,
    color: getContrastYIQ(theme.palette.background.tertiary, theme)
  },
  '&:nth-of-type(4):after': {
    borderLeftColor: theme.palette.background.quaternary,
  },
  '&:nth-of-type(4)': {
    background: theme.palette.background.quaternary,
    color: getContrastYIQ(theme.palette.background.quaternary, theme)
  },
  '&:nth-of-type(5):after': {
    borderLeftColor: theme.palette.background.highlight,
  },
  '&:nth-of-type(5)': {
    background: theme.palette.background.highlight,
    color: getContrastYIQ(theme.palette.background.highlight, theme)
  },
}

  let thsx = thsx_no_1st_header;
  if (topLeft(children)) {thsx = thsx_1st_header} // there is content in the top left header.. show the 1st header


  return (
    <TableContainer sx={{ display: 'flex', color: theme.palette.text.main, width: width }}>
      <Table sx={{ borderCollapse: "unset", border: "unset", width: props.width, tableLayout: 'fixed', minWidth: 650 }}>
        <TableHead sx={{ background: "unset", border: "unset" }}>
          <HeadingRow>{children.props.children}</HeadingRow>
        </TableHead>
        <TableBody>
          <Rows sx={{p: '5px',verticalAlign: 'top', color: theme.palette.text.main}}>{children.props.children}</Rows>
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export { ProgressTable };


