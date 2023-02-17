import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import okaidia from "react-syntax-highlighter/dist/cjs/styles/prism/okaidia";
import SlidePage from "../layouts/SlidePage";
import PrintSlide from "../layouts/PrintSlide";
import MDXViewer from "../layouts/MDXViewer";

import Cover from "./Cover";
import SpeakerNotes from "./SpeakerNotes";
import Step from "./Step";
import Steps from "./Steps";
import { motion } from "framer-motion";

import { Typography } from '@mui/material';

// Custom components

import { Header, Banner, Footer } from './HeaderFooter';
import { InsightTable, Insight, ChevronProcess, ChevronProcessTable, StatementBanner } from './Playback';
import {FaIcon, Icon} from './Images.jsx';


export const mdComponents = {
  h1: (props) => <Typography variant="h1">{props.children}</Typography>,
  h2: (props) => <Typography variant="h2">{props.children}</Typography>,
  h3: (props) => <Typography variant="h3">{props.children}</Typography>,
  h4: (props) => <Typography variant="h4">{props.children}</Typography>,
  h5: (props) => <Typography variant="h5">{props.children}</Typography>,
  pre: (props) => props.children,
  code: (props) => {
    const { className } = props;
    const language = className?.replace("language-", "");
    return (
      <SyntaxHighlighter
        className={className}
        language={language}
        style={okaidia}
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
  // custom component
  Header,
  Banner,
  Footer,
  InsightTable, Insight, ChevronProcess, ChevronProcessTable, StatementBanner,
  FaIcon, Icon
};

export default ({ children }) => (
  <MDXProvider components={mdComponents}>{children}</MDXProvider>
);
