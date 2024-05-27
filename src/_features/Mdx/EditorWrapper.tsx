'use client';

import { type MDXEditorMethods } from '@mdxeditor/editor';
import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import React, { useRef } from 'react';

import { Editor } from '@/components/Editor';
import type { ContentItem } from '@/lib/Types';

interface EditorWrapperProps {
  context: ContentItem;
}

export default function EditorWrapper({ context }: EditorWrapperProps) {
  const editorRef = useRef<MDXEditorMethods | null>(null);

  return (
    <Box sx={{ px: '2%' }}>
      <Container sx={{ maxHeight: '100vh', pt: '2%' }}>
        <Editor
          context={context}
          editorRef={editorRef}
          editorSaveHandler={() => Promise.resolve('')}
          enabled
          imagePreviewHandler={() => Promise.resolve('')}
          imageUploadHandler={() => Promise.resolve('')}
          markdown="# test"
          top={0}
        />
      </Container>
    </Box>
  );
}
