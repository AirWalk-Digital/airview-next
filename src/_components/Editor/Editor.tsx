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
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { ContentItem } from '@/lib/Types';
import { baseTheme } from '@/styles/baseTheme';

const toKebabCase = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

const convertStyleObjectToCSS = (
  styleObject: Theme['typography'],
  indent: string = ''
): string => {
  let cssString = '';

  for (const [key, value] of Object.entries(styleObject)) {
    if (typeof value === 'object') {
      cssString += `${indent}${toKebabCase(key)} {\n`;
      cssString += convertStyleObjectToCSS(value, `${indent}  `);
      cssString += `${indent}}\n`;
    } else {
      cssString += `${indent}${toKebabCase(key)}: ${value};\n`;
    }
  }

  return cssString;
};

interface EditorProps {
  markdown: string;
  context: ContentItem;
  defaultContext: ContentItem | undefined;
  editorSaveHandler: (arg: string) => Promise<string>;
  imageUploadHandler: (image: File) => Promise<any>;
  imagePreviewHandler: (imageSource: string) => Promise<string>;
  enabled?: boolean;
  top: number;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

const Editor = React.memo(function EditorC({
  markdown: initialMarkdown,
  context,
  defaultContext,
  editorSaveHandler,
  imageUploadHandler,
  imagePreviewHandler,
  enabled = true,
  top,
  editorRef,
}: EditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const changedRef = useRef(false);
  const typographyCopy = { ...baseTheme.typography } as Theme['typography'];
  const importedCss = convertStyleObjectToCSS(typographyCopy);

  const StyledMDXEditor = styled(MDXEditor)`
    font-family: 'Heebo';
    font-weight: 200;
    font-size: 14;
    [role='toolbar'] {
    }
    [class*='_contentEditable_'] {
      height: calc(100vh - ${top}px);
      padding-left: 2% !important;
      padding-right: 2% !important;
      overflow-y: auto;
      overflow-x: hidden;
    }
    [role='textbox'] {
    }
    [class^='_rootContentEditableWrapper'] {
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
      max-width: 70%;
      height: auto;
    }
  `;

  const editorCallback = useCallback(
    (callback: string) => {
      if (
        !initialMarkdown &&
        defaultContext &&
        context.branch !== defaultContext.branch
      ) {
        changedRef.current = true;
      } else if (
        initialMarkdown &&
        callback.trim() !== initialMarkdown.trim() &&
        defaultContext &&
        context.branch !== defaultContext.branch
      ) {
        changedRef.current = true;
      } else {
        changedRef.current = false;
      }
    },
    [initialMarkdown, defaultContext, context.branch]
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
          Promise.resolve(imageUploadHandler(image)),
        imagePreviewHandler: (imageSource) =>
          Promise.resolve(imagePreviewHandler(imageSource)),
      }),
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
    [initialMarkdown, imageUploadHandler, imagePreviewHandler]
  );

  const SaveButton = React.memo(function SaveButton() {
    const [changed, setChanged] = useState(
      defaultContext && context.branch !== defaultContext.branch
    );

    useEffect(() => {
      const interval = setInterval(() => {
        setChanged(changedRef.current);
      }, 100);
      return () => clearInterval(interval);
    }, []);

    return (
      <Fab
        color='primary'
        aria-label='save'
        disabled={!enabled || isLoading || !changed}
        style={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={async () => {
          setIsLoading(true);
          setError('');
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
    );
  });

  return (
    <Paper
      sx={{
        px: 0,
        maxHeight: 'calc(100vh - 65px)',
        pt: 0,
        pb: 0,
        overflow: 'auto',
      }}
      elevation={0}
    >
      {defaultContext && context.branch === defaultContext.branch && (
        <Alert severity='info'>
          The editor is in read-only mode until you change branch
        </Alert>
      )}
      <StyledMDXEditor
        ref={editorRef}
        onChange={editorCallback}
        onError={(msg) => setError(`Error in markdown: ${msg}`)}
        markdown={initialMarkdown || ''}
        plugins={editorPlugins}
        readOnly={defaultContext && context.branch === defaultContext.branch}
        autoFocus
      />
      <SaveButton />
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError('')}
      >
        <Alert
          onClose={() => setError('')}
          severity='error'
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        autoHideDuration={5000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity='info'
          sx={{ width: '100%' }}
        >
          Saved file
        </Alert>
      </Snackbar>
    </Paper>
  );
});

export { Editor };
