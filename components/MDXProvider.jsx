import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import okaidia from "react-syntax-highlighter/dist/cjs/styles/prism/okaidia";
import SlidePage from "../layouts/SlidePage";
import PrintSlide from "../layouts/PrintSlide";
import MDXViewer from "../layouts/MDXViewer";
import Image from "next/image";

// fix for Roadmap, Nest
import { TitleSlide, Header, Banner, Footer, Insights, Chevrons, Layout, Column, Item } from 'airview-mdx'

import Cover from "./Cover";
import SpeakerNotes from "./SpeakerNotes";
import Step from "./Step";
import Steps from "./Steps";
import { motion } from "framer-motion";

// MUI Components

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';

// Custom components

import { Insight, InsightTable, ChevronProcessTable, StatementBanner, Roadmap } from './Playback';
// import {FaIcon, Icon} from './Images.jsx';
import {FaIcon, Icon} from 'airview-mdx';
import { ProgressTable } from './Tables.jsx';
import { HeaderCard, Nest } from './Cards';
// import { HeaderCard } from './Cards';
import { Font } from './Styling';
// Layouts 
// import {Layout, Column, Item } from './Layouts';

export const mdComponents = {
  h1: (props) => <Typography variant="h1">{props.children}</Typography>,
  h2: (props) => <Typography variant="h2">{props.children}</Typography>,
  h3: (props) => <Typography variant="h3">{props.children}</Typography>,
  h4: (props) => <Typography variant="h4">{props.children}</Typography>,
  h5: (props) => <Typography variant="h5">{props.children}</Typography>,
  p: (props) => <Typography variant="p">{props.children}</Typography>,
  img: (props) => (<div style={{position: "relative", objectFit: 'contain', height: '100%'}}><Image {...props} fill loading="lazy" /></div>),
  strong: (props) => <Typography variant="strong">{props.children}</Typography>,
  ul: (props) => <Typography variant="ul">{props.children}</Typography>,
  table: (props) => <Typography variant="table">{props.children}</Typography>,
  pre: (props) => props.children,
  code: (props) => {
    const { className } = props;
    const language = className?.replace("language-", "");
    return (
      <SyntaxHighlighter
        className={className}
        language={language}
        style={okaidia}
        customStyle={{overflow:'clip', fontSize: '0.75rem'}}
        {...props}
      />
    );
  },
  // layouts
  SlidePage,
  PrintSlide,
  MDXViewer,
  SpeakerNotes,
  Step,
  Steps,
  Cover,
  motion,
  // MUI Components
  CardHeader,
  CardContent,
  Card,
  Alert,
  // custom component
  Header,
  Banner,
  Footer,
  InsightTable, Insight, Chevrons, ChevronProcessTable, StatementBanner, Roadmap,
  FaIcon, Icon,
  ProgressTable,
  HeaderCard, Nest,
  Font,
  // layouts
  TitleSlide,
  Layout, Column, Item
};

export default ({ children }) => (
  <MDXProvider components={mdComponents}>{children}</MDXProvider>
);
