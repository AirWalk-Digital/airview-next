'use client';

import { type MDXEditorMethods } from '@mdxeditor/editor';
import { Box, LinearProgress } from '@mui/material';
import Container from '@mui/material/Container';
import React, { useEffect, useRef, useState } from 'react';

import { Editor } from '@/components/Editor';
import { ControlBar } from '@/components/Layouts/ControlBar';
import { getLogger } from '@/lib/Logger';
import type { ContentItem } from '@/lib/Types';

const logger = getLogger().child({ namespace: 'EditorWrapper' });
logger.level = 'info';

interface EditorWrapperProps {
  defaultContext: ContentItem | undefined;
  context: ContentItem;
  branches: { name: string; commit: { sha: string }; protected: boolean }[];
}

export default function EditorWrapper({
  defaultContext,
  context,
  branches,
}: EditorWrapperProps) {
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

  // const router = useRouter();
  // const pathname = usePathname();
  // const handleContextUpdate = (newContext: any) => {
  //   logger.info('handleContextUpdate', newContext);
  //   const pathnameArray = pathname.split('/');
  //   pathnameArray[2] = newContext.branch;
  //   const newPathname = pathnameArray.join('/');
  //   router.push(newPathname);
  // };

  return (
    <>
      <ControlBar
        branches={branches}
        collection={defaultContext}
        context={context}
        fetchBranches={() => {}}
        handleAdd={() => {}}
        handleEdit={() => {}}
        handleNewBranch={() => {}}
        handlePR={() => {}}
        handlePresentation={() => {}}
        handlePrint={() => {}}
        // handleRefresh={() => {}}
        // onContextUpdate={handleContextUpdate}
        open
        editMode
        top={65}
      />
      <Box sx={{ px: '1%', pt: '65px' }}>
        <Container sx={{ maxHeight: 'calc(100vh - 130px)' }}>
          {mdx ? (
            <Editor
              context={context}
              editorRef={editorRef}
              editorSaveHandler={() => Promise.resolve('')}
              enabled
              imagePreviewHandler={() => Promise.resolve('')}
              imageUploadHandler={() => Promise.resolve('')}
              markdown={mdx}
              top={220}
            />
          ) : (
            <LinearProgress />
          )}
        </Container>
      </Box>
    </>
  );
}
