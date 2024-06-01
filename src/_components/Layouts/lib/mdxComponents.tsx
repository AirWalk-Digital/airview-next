import { styled } from '@mui/material/styles';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia, prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { palette } from '@/styles/baseTheme';
import { getContrastYIQ } from '@/styles/lib/colors';

// const StatRoot = styled('table', {
//   name: 'MuiStat', // The component name
//   slot: 'root', // The slot name
// })(({ theme }) => ({
const Table = styled('table')(({ theme }) => ({
  display: 'inline-table',
  tableLayout: 'fixed',
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
  pre: (props: any) => props.children,
  code: (props: any) => {
    const { className } = props;
    const language = className?.replace('language-', '');
    return (
      <SyntaxHighlighter
        className={className}
        language={language}
        style={language ? okaidia : prism}
        wrapLongLines={!!language}
        showLineNumbers={!!language}
        // customStyle={{ overflow: 'clip', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}
        customStyle={{
          display: language ? 'block' : 'inline',
          ...(language
            ? { fontSize: '0.75rem' }
            : { background: 'unset', padding: 'unset', fontSize: '0.85rem' }),
        }}
        {...props}
      />
    );
  },
  // <Typography variant="table">{props.children}</Typography>
  // ),
};

export default components;
