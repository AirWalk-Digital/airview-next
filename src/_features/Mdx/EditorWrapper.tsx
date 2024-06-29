'use client';

import { type MDXEditorMethods } from '@mdxeditor/editor';
import { Box, LinearProgress } from '@mui/material';
import Container from '@mui/material/Container';
import matter from 'gray-matter';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import { Editor, NewBranchDialog, NewContentDialog } from '@/components/Editor';
import {
  createFile,
  createNewBranch,
  raisePR,
} from '@/components/Editor/lib/functions';
import { ControlBar } from '@/components/Layouts/ControlBar';
// import { raisePR } from '@/lib/Github';
import { getLogger } from '@/lib/Logger';
import { toSnakeCase } from '@/lib/StringUtils';
import type { ContentItem } from '@/lib/Types';

const logger = getLogger().child({ namespace: 'EditorWrapper' });
logger.level = 'info';

interface EditorWrapperProps {
  defaultContext: ContentItem | undefined;
  context: ContentItem;
  branches: { name: string; commit: { sha: string }; protected: boolean }[];
}

export default function EditorWrapper({
  defaultContext = undefined,
  context,
  branches,
}: EditorWrapperProps) {
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const searchParams = `owner=${context.owner}&repo=${context.repo}&path=${context.file}&branch=${context.branch}`;
  const [mdx, setMdx] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isNewBranchOpen, setIsNewBranchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/github/content?${searchParams}`);
      const mdxResponse = await response.text();
      setMdx(mdxResponse);
    };

    fetchData();
  }, [context, searchParams]);

  const onNewBranchClicked = () => {
    setIsNewBranchOpen(true);
  };

  const handleNewBranch = async (value: { name?: string } | null) => {
    if (!value) {
      // handle the cancel button
      setIsNewBranchOpen(false);
      return;
    }
    if (value && value.name) {
      logger.debug('ControlBar:handleNewBranch: ', value);
      try {
        await createNewBranch({
          owner: context.owner,
          repo: context.repo,
          branch: value.name,
          sourceBranch: defaultContext?.branch || 'main',
        });
        setIsNewBranchOpen(false);
        const pathnameArray = pathname.split('/');
        pathnameArray[3] = encodeURIComponent(value.name);
        const newPathname = pathnameArray.join('/');
        router.push(newPathname);

        // if (typeof window !== 'undefined') {
        //   const url = new URL(window.location.href);
        //   const params = new URLSearchParams(url.search);
        //   params.set('branch', value.name);
        //   params.set('edit', 'true');
        //   url.search = params.toString();
        //   window.location.href = url.toString();
        // }
      } catch (e: any) {
        throw new Error(`Error creating branch: ${e.message}`);
      }
    }
  };
  const onAddContentClicked = () => {
    setIsAddOpen(true);
  };
  const handleAdd = async (newFile: any) => {
    if (!newFile) {
      // handle the cancel button
      setIsAddOpen(false);
      return;
    }
    const newContent: { frontmatter: any; path: string } = {
      frontmatter: undefined,
      path: '',
    };
    if (
      newFile.frontmatter &&
      newFile.frontmatter.title &&
      newFile.frontmatter.type
    ) {
      try {
        newContent.frontmatter = newFile.frontmatter;
        newContent.path = `${newFile.frontmatter.type}/${toSnakeCase(
          newFile.frontmatter.title
        )}/_index.mdx`;
        createFile({
          owner: context.owner,
          repo: context.repo,
          branch: context.branch,
          file: newContent.path,
          content: matter.stringify('\n', newContent.frontmatter),
          message: 'New file created from Airview',
        });
        logger.debug(
          'ControlBar:handleAdd: ',
          context.owner,
          context.repo,
          context.branch,
          newContent.path,
          matter.stringify('\n', newContent.frontmatter),
          'New file created from Airview'
        );
      } catch (e: any) {
        throw new Error(`Error creating file: ${e.message}`);
      }
    }

    setIsAddOpen(false);
  };

  const handlePR = async () => {
    const prName = (branch: string) => {
      const [branchType, ...titleParts] = branch.split('/');
      const title = titleParts.join(' ').replace(/([a-z])([A-Z])/g, '$1 $2');
      return `${
        (branchType ?? '').charAt(0).toUpperCase() + (branchType ?? '').slice(1)
      }: ${title
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')}`;
    };
    logger.debug(
      context.owner,
      context.repo,
      prName(context.branch),
      'PR created from Airview',
      context.branch
    );
    try {
      await raisePR({
        owner: context.owner,
        repo: context.repo,
        title: prName(context.branch),
        message: 'PR created from Airview',
        head: context.branch,
        base: defaultContext?.branch || 'main',
      });
    } catch (e: any) {
      throw new Error(`Error creating PR: ${e.message}`);
    }
  };

  const handleEdit = () => {
    const pathnameArray = pathname.split('/');
    if (pathnameArray[2] === 'edit') {
      // Replace 'edit' with 'view' in the URL path
      pathnameArray[2] = 'view';
    } else {
      // Replace 'view' with 'edit' in the URL path
      pathnameArray[2] = 'edit';
    }
    const newPathname = pathnameArray.join('/');
    router.push(newPathname);
  };

  return (
    <>
      <ControlBar
        branches={branches}
        collection={defaultContext}
        context={context}
        handleAddContent={onAddContentClicked}
        handleEdit={handleEdit}
        handleNewBranch={onNewBranchClicked}
        handlePR={handlePR}
        // handlePresentation={() => {}}
        // handlePrint={() => {}}
        // handleRefresh={() => {}}
        // onContextUpdate={handleContextUpdate}
        open
        editMode
        top={65}
      />
      <NewContentDialog dialogOpen={isAddOpen} handleDialog={handleAdd} />
      <NewBranchDialog
        dialogOpen={isNewBranchOpen}
        handleDialog={handleNewBranch}
      />
      <Box sx={{ px: '1%', pt: '65px' }}>
        <Container sx={{ maxHeight: 'calc(100vh - 130px)' }}>
          {mdx ? (
            <Editor
              context={context}
              defaultContext={defaultContext}
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
