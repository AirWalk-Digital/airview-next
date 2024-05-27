/* eslint-disable react/no-unstable-nested-components */
import '@mdxeditor/editor/style.css';

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  CodeMirrorEditor,
  CreateLink,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import SaveIcon from '@mui/icons-material/Save';
import { Alert, css, Fab } from '@mui/material';
// const { MDXEditor, codeBlockPlugin, diffSourcePlugin, headingsPlugin, frontmatterPlugin, listsPlugin, linkPlugin, linkDialogPlugin, quotePlugin, tablePlugin, thematicBreakPlugin, markdownShortcutPlugin, useCodeBlockEditorContext, toolbarPlugin, BlockTypeSelect, BoldItalicUnderlineToggles, UndoRedo, InsertTable, InsertCodeBlock, InsertFrontmatter, CreateLink, InsertThematicBreak, DiffSourceToggleWrapper } = await import('@mdxeditor/editor')
// import { useState, useRef, createContext } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
// import { $createParagraphNode, $createTextNode } from 'lexical';
// import type { ForwardedRef } from 'react';
import React, { useCallback, useMemo, useState } from 'react';

import type { ContentItem } from '@/lib/Types';
// import { css } from 'styled-components';
// import store from '@/lib/redux/store';
import { baseTheme } from '@/styles/baseTheme';

const toKebabCase = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

const convertStyleObjectToCSS = (
  styleObject: Theme['typography'],
  indent: string = '',
): string => {
  let cssString = '';

  for (const [key, value] of Object.entries(styleObject)) {
    if (typeof value === 'object') {
      // Handle nested objects
      cssString += `${indent}${toKebabCase(key)} {\n`;
      cssString += convertStyleObjectToCSS(value, `${indent}  `);
      cssString += `${indent}}\n`;
    } else {
      // Convert style properties to CSS
      cssString += `${indent}${toKebabCase(key)}: ${value};\n`;
    }
  }

  return cssString;
};

// function convertMdastToLexical(mdastNode) {
//   switch (mdastNode.type) {
//     case 'mdxJsxTextElement':
//       return convertJsxElement(mdastNode);
//     case 'text':
//       return mdastNode.value;
//     // Handle other MDAST node types if needed
//     default:
//       return '';
//   }
// }

// function convertJsxElement(jsxNode) {
//   const tagName = jsxNode.name;
//   const attributes = jsxNode.attributes
//     .map((attr) => `${attr.name}="${attr.value}"`)
//     .join(' ');
//   const children = jsxNode.children.map(convertMdastToLexical).join('');

//   return `<${tagName} ${attributes}>${children}</${tagName}>`;
// }

interface EditorProps {
  markdown: string;
  context: ContentItem;
  editorSaveHandler: (arg: string) => Promise<string>;
  imageUploadHandler: (image: File, context: ContentItem) => Promise<string>;
  imagePreviewHandler: (
    imageSource: string,
    context: ContentItem,
  ) => Promise<string>;
  enabled?: boolean;
  top: number;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

export function Editor({
  markdown: initialMarkdown,
  context,
  editorSaveHandler,
  imageUploadHandler,
  imagePreviewHandler,
  enabled = true,
  top,
  editorRef,
}: EditorProps) {
  // const [markdown, setMarkdown] = useState(initialMarkdown);
  const [changed, setChanged] = useState(false); // enable/disable the save button
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  // const ref = useRef();
  // const collection = context?.path || 'null';
  // const currentState = store.getState();
  // const reduxCollection = currentState.branch[collection];
  // console.log('Editor:context: ', context);
  // console.log('Editor:reduxCollection: ', reduxCollection);
  // console.log('Editor:initialMarkdown: ', initialMarkdown.substring(0, 100));
  const typographyCopy = { ...baseTheme.typography } as Theme['typography'];
  // delete typographyCopy.table;
  const importedCss = convertStyleObjectToCSS(typographyCopy);
  // console.log("Editor:importedCss: ", importedCss);
  const StyledMDXEditor = styled(MDXEditor)`
    font-family: 'Heebo';
    font-weight: 200;
    font-size: 14;
    [role='toolbar'] {
      // border: 1px solid #d1d5db;
      // border-radius: 0.15rem;
      // border-bottom-right-radius: 0;
      // border-bottom-left-radius: 0;
    }
    [class*='_contentEditable_'] {
      height: calc(100vh - ${top}px);
      overflow-y: auto;
      overflow-x: hidden;
    }
    [role='textbox'] {
      // background-color: white;
      // border: 1px solid #d1d5db;
      // border-top: none;
      // border-radius: 0.15rem;
      // border-top-right-radius: 0;
      // border-top-left-radius: 0;
    }
    [class^='_rootContentEditableWrapper'] {
      /* Your CSS styles for elements with the matching class name here */
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: 200;
        line-height: 1.2l;
      }
      h1 {
        font-size: '3rem';
      }
      h2 {
        font-size: '2rem';
      }
      h3 {
        font-size: '1rem';
      }
      ${css`
        ${importedCss}
      `}
      .cm-gutters {
        margin-right: 1%;
        margin-left: 1%;
      }
      .cm-scroller {
        display: flex;
      }
    }
    img {
      max-width: 50%;
      height: auto;
    }
  `;

  // const ref = React.useRef<MDXEditorMethods>(null);

  const editorCallback = useCallback(
    (callback: string) => {
      if (!initialMarkdown) {
        setChanged(true);
      } else if (
        initialMarkdown &&
        callback.trim() !== initialMarkdown.trim()
      ) {
        setChanged(true);
      } else {
        setChanged(false);
      }
    },
    [initialMarkdown],
  );

  const editorPlugins = useMemo(
    () => [
      diffSourcePlugin({
        diffMarkdown: initialMarkdown || '',
        viewMode: 'rich-text',
      }),
      codeBlockPlugin({
        codeBlockEditorDescriptors: [
          {
            priority: 100,
            match: () => true,
            Editor: CodeMirrorEditor,
          },
        ],
      }),
      headingsPlugin(),
      frontmatterPlugin(),
      listsPlugin(),
      linkPlugin(),
      imagePlugin(),
      linkDialogPlugin(),
      quotePlugin(),
      tablePlugin(),
      thematicBreakPlugin(),
      markdownShortcutPlugin(),
      imagePlugin({
        disableImageResize: true,
        imageUploadHandler: (image) =>
          Promise.resolve(imageUploadHandler(image, context)),
        imagePreviewHandler: (imageSource) =>
          Promise.resolve(imagePreviewHandler(imageSource, context)),
      }),
      // catchAllPlugin(),

      toolbarPlugin({
        toolbarContents: () => (
          <>
            {' '}
            <UndoRedo />
            <BlockTypeSelect />
            <BoldItalicUnderlineToggles />
            <CreateLink />
            <InsertTable />
            <InsertImage />
            <InsertCodeBlock />
            <InsertThematicBreak />
            <InsertFrontmatter />
            <DiffSourceToggleWrapper>
              <UndoRedo />
            </DiffSourceToggleWrapper>
          </>
        ),
      }),
    ],
    [initialMarkdown, imageUploadHandler, context, imagePreviewHandler],
  );

  return (
    <Paper
      sx={{
        px: '1%',
        maxHeight: 'calc(100vh - 65px)',
        pt: '2%',
        pb: '2%',
        overflow: 'auto',
      }}
      elevation={0}
    >
      <StyledMDXEditor
        ref={editorRef}
        onChange={editorCallback}
        // eslint-disable-next-line no-console
        onError={(msg) => console.warn('Error in markdown: ', msg)}
        markdown={initialMarkdown || ''}
        plugins={editorPlugins}
      />
      <Fab
        color="primary"
        aria-label="save"
        disabled={!enabled || isLoading || !changed}
        style={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={async () => {
          setIsLoading(true);
          setError(''); // clear any previous errors
          try {
            const text = editorRef?.current?.getMarkdown() ?? 'error';
            await editorSaveHandler(text ?? '');
            setSuccess(true);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {isLoading ? <CircularProgress size={24} /> : <SaveIcon />}
      </Fab>
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError('')}
      >
        <Alert
          onClose={() => setError('')}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!success}
        autoHideDuration={5000}
        onClose={() => setSuccess(true)}
      >
        <Alert
          onClose={() => setSuccess(true)}
          severity="info"
          sx={{ width: '100%' }}
        >
          Saved file
        </Alert>
      </Snackbar>
    </Paper>
  );
}
