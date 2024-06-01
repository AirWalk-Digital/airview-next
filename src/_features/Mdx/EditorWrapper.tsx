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
logger.level = 'warn';

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
    <>
      <ControlBar
        branches={[
          {
            commit: {
              sha: '53bfd8457509778140caa47b01c6476d661f1b34',
              url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/53bfd8457509778140caa47b01c6476d661f1b34',
            },
            name: 'main',
            protected: true,
          },
          {
            commit: {
              sha: '53bfd8457509778140caa47b01c6476d661f1b34',
              url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/53bfd8457509778140caa47b01c6476d661f1b34',
            },
            name: 'branch-1',
            protected: false,
          },
          {
            commit: {
              sha: '09a01dc4e148c35412d3a6a00a384930a41b813b',
              url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/09a01dc4e148c35412d3a6a00a384930a41b813b',
            },
            name: 'branch-2',
            protected: false,
          },
          {
            commit: {
              sha: '7080423b89568b0427cb781f8b753f52fbc394e0',
              url: 'https://api.github.com/repos/AirWalk-Digital/airwalk_patterns/commits/7080423b89568b0427cb781f8b753f52fbc394e0',
            },
            name: 'branch-3',
            protected: false,
          },
        ]}
        collection={{
          base_branch: 'main',
          branch: 'main',
          collections: ['services'],
          owner: 'airwalk-digital',
          path: 'providers',
          reference: 'provider',
          repo: 'airwalk_patterns',
          source: 'github',
        }}
        context={{
          base_branch: 'main',
          branch: 'main',
          collections: ['services'],
          owner: 'airwalk-digital',
          path: 'providers',
          reference: 'provider',
          repo: 'airwalk_patterns',
          source: 'github',
        }}
        fetchBranches={() => {}}
        handleAdd={() => {}}
        handleEdit={() => {}}
        handleNewBranch={() => {}}
        handlePR={() => {}}
        handlePresentation={() => {}}
        handlePrint={() => {}}
        // handleRefresh={() => {}}
        onContextUpdate={() => {}}
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
