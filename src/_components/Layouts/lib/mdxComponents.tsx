import { styled } from '@mui/material/styles';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia, prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import MdxImage from '@/components/Cards/Image';
import type { ContentItem } from '@/lib/Types';
import { palette } from '@/styles/baseTheme';
import { getContrastYIQ } from '@/styles/lib/colors';

import { topBarHeight } from '../constants';
import { CopyButton } from './CopyButton';

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

const components = (baseContext: ContentItem) => ({
  table: (props: any) => <Table>{props.children}</Table>,
  pre: (props: any) => props.children,
  img: (props: any) => <MdxImage props={props} baseContext={baseContext} />,
  h2: (props: any) => (
    <h2
      id={props.id}
      style={{ scrollBehavior: 'smooth', scrollMarginTop: topBarHeight }}
    >
      {props.children}
    </h2>
  ),
  h3: (props: any) => (
    <h3
      id={props.id}
      style={{ scrollBehavior: 'smooth', scrollMarginTop: topBarHeight }}
    >
      {props.children}
    </h3>
  ),
  h4: (props: any) => (
    <h4
      id={props.id}
      style={{ scrollBehavior: 'smooth', scrollMarginTop: topBarHeight }}
    >
      {props.children}
    </h4>
  ),
  code: (props: any) => {
    const { className } = props;
    const language = className?.replace('language-', '');
    return (
      <div
        style={{
          display: language && 'flex',
          flexDirection: language && 'row',
          gap: language && '10px',
        }}
      >
        <SyntaxHighlighter
          className={className}
          language={language}
          style={language ? okaidia : prism}
          wrapLongLines={!!language}
          showLineNumbers={!!language}
          // customStyle={{ overflow: 'clip', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}
          customStyle={{
            // display: language ? 'block' : 'inline',
            display: 'block',
            overflow: 'clip',
            whiteSpace: 'pre-wrap',
            flexGrow: '2',
            ...(language
              ? { fontSize: '0.75rem' }
              : { background: 'unset', padding: 'unset', fontSize: '0.85rem' }),
          }}
          {...props}
        />
        {!!language && <CopyButton code={props.children} />}
      </div>
    );
  },
  // <Typography variant="table">{props.children}</Typography>
  // ),
});

export default components;
