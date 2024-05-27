'use client';

import { type MDXEditorMethods } from '@mdxeditor/editor';
import { Box, LinearProgress } from '@mui/material';
import Container from '@mui/material/Container';
import React, { useEffect, useRef, useState } from 'react';

import { Editor } from '@/components/Editor';
import { getLogger } from '@/lib/Logger';
import type { ContentItem } from '@/lib/Types';

const logger = getLogger().child({ namespace: 'EditorWrapper' });
logger.level = 'debug';

interface EditorWrapperProps {
  context: ContentItem;
}

export default function EditorWrapper({ context }: EditorWrapperProps) {
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const searchParams = `owner=${context.owner}&repo=${context.repo}&path=${context.file}&branch=${context.branch}`;
  const [mdx, setMdx] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/content/github?${searchParams}`);
      const mdxResponse = await response.text();
      setMdx(mdxResponse);
    };

    fetchData();
  }, [context, searchParams]);
  return (
    <Box sx={{ px: '1%' }}>
      <Container sx={{ maxHeight: 'calc(100vh - 65px)' }}>
        {mdx ? (
          <Editor
            context={context}
            editorRef={editorRef}
            editorSaveHandler={() => Promise.resolve('')}
            enabled
            imagePreviewHandler={() => Promise.resolve('')}
            imageUploadHandler={() => Promise.resolve('')}
            markdown={mdx}
            top={165}
          />
        ) : (
          <LinearProgress />
        )}
      </Container>
    </Box>
  );
}
