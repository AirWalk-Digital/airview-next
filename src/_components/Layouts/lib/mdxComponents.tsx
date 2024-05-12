import { styled } from '@mui/material/styles';
import React from 'react';

import { palette } from '@/styles/baseTheme';
import { getContrastYIQ } from '@/styles/lib/colors';

// const StatRoot = styled('table', {
//   name: 'MuiStat', // The component name
//   slot: 'root', // The slot name
// })(({ theme }) => ({
const Table = styled('table')(({ theme }) => ({
  display: 'inline-table',
  width: '100%',
  border: '1px solid',
  borderRadius: '5px',
  borderSpacing: '0',
  borderCollapse: 'separate',
  borderColor: theme.palette.primary.main,
  overflow: 'hidden',
  marginBottom: '2%',
  marginTop: '2%',
  thead: {
    backgroundColor: theme.palette.primary.main, // palette.palette.primary,
    fontWeight: '200',
    textAlign: 'left',
    // color: palette.palette.primary,
    color: getContrastYIQ(theme.palette.primary.main, palette),
    tr: {
      borderRight: '10px solid',
      th: {
        ':not(:last-child)': {
          borderRight: '1px solid',
        },
        paddingLeft: '1%',
        paddingRight: '1%',
        paddingTop: '0.5%',
        paddingBottom: '0.5%',
      },
    },
  },
  td: {
    paddingLeft: '1%',
    paddingRight: '1%',
    ':not(:last-child)': {
      borderRight: '1px solid',
    },
    borderBottom: '0.5px solid lightgray',
    color: 'text.main',
  },
}));

const components = {
  table: (props: any) => <Table>{props.children}</Table>,
  // <Typography variant="table">{props.children}</Typography>
  // ),
};

export default components;
