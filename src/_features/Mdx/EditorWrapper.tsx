'use client';

import { type MDXEditorMethods } from '@mdxeditor/editor';
import { Box, LinearProgress } from '@mui/material';
import Container from '@mui/material/Container';
import matter from 'gray-matter';
import { usePathname, useRouter } from 'next/navigation';
import path from 'path';
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

  const handleRedirect = (newPage: string) => {
    const pathnameArray = pathname.split('/');
    // pop every element of the array afer [2]
    pathnameArray.splice(4);
    // join the 2 arrays
    pathnameArray.push(newPage);
    router.push(pathnameArray.join('/'));
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
        const createdFile = await createFile({
          owner: context.owner,
          repo: context.repo,
          branch: context.branch,
          file: newContent.path,
          content: matter.stringify('\n', newContent.frontmatter),
          message: 'New file created from Airview',
        });
        logger.info({
          frontmatter: matter.stringify('\n', newContent.frontmatter),
          createdFile,
        });
        if (createdFile) {
          handleRedirect(newContent.path);
        } else {
          logger.error({
            frontmatter: matter.stringify('\n', newContent.frontmatter),
            message: 'Error creating file',
          });

          throw new Error(`Error creating file`);
        }
      } catch (e: any) {
        logger.error({
          frontmatter: matter.stringify('\n', newContent.frontmatter),
          message: e.message,
        });

        throw new Error(`${e.message}`);
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

  const onSave = async (content: string | null) => {
    try {
      if (!content) {
        throw new Error('No content to save');
      }
      if (!context.file) {
        throw new Error('No file to save');
      }
      const normalizedFile = context.file.replace(/^\/+/, '');

      await createFile({
        owner: context.owner,
        repo: context.repo,
        branch: context.branch,
        file: normalizedFile,
        content,
        message: 'file updated from Airview',
      });
      setMdx(content);
      return 'success';
    } catch (error: any) {
      logger.error('ContentPage:onSave:error: ', error);
      throw new Error(`Error saving file: ${error.message}`);
    }
  };

  const imageUploadHandler = async (image: File) => {
    logger.debug('imageUploadHandler', context, image);
    const formData = new FormData();
    formData.append('image', image);
    if (!context.file) {
      throw new Error('No file to save');
    }
    const file = `${path.dirname(context.file)}/${image.name
      .replace(/[^a-zA-Z0-9.]/g, '')
      .toLowerCase()}`;
    const fileName = image.name.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = async function uploadImage() {
        const base64Image = reader.result;
        if (!base64Image) {
          throw new Error('error reading image');
        }
        let imageData: string[] = [];
        if (base64Image && typeof base64Image === 'string') {
          imageData = base64Image.split(',');
        }
        if (!imageData || !imageData[1]) {
          throw new Error('error reading image');
        }

        try {
          const url = await createFile({
            owner: context.owner,
            repo: context.repo,
            branch: context.branch,
            file,
            content: imageData[1],
            message: 'image uploaded from Airview',
          });
          if (url) {
            resolve(fileName);
          } else {
            throw new Error('Error uploading image');
          }
        } catch (error: any) {
          throw new Error(error);
        }
      };

      reader.onerror = reject;

      reader.readAsDataURL(image);
    });
  };

  const imagePreviewHandler = async (
    imageSource: string
    // context: ContentItem
  ) => {
    logger.info('imagePreviewHandler', context, imageSource);
    if (imageSource.startsWith('http')) return imageSource;
    if (!context.file) {
      throw new Error('No file context');
    }
    const file = `${path.dirname(context.file)}/${imageSource.replace(/^\/|^\.\//, '')}`;
    const filePath = file.replace(/^\/|^\.\//, ''); // strip leading slash
    logger.debug('imagePreviewHandler', filePath);

    const response = await fetch(
      `/api/github/content?owner=${context.owner}&repo=${context.repo}&branch=${context.branch}&path=${filePath}`
    );
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    // Fetch the image as Blob directly
    const blob = await response.blob();

    // Create an object URL for the Blob
    const imageObjectUrl = URL.createObjectURL(blob);
    return imageObjectUrl;
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
      <Box sx={{ pl: '0 !important', pr: '0 !important', pt: '65px' }}>
        <Container
          sx={{
            maxHeight: 'calc(100vh - 130px)',
            maxWidth: '100% !important',
            px: '0 !important',
          }}
        >
          {mdx ? (
            <Editor
              context={context}
              defaultContext={defaultContext}
              editorRef={editorRef}
              editorSaveHandler={onSave}
              enabled
              imagePreviewHandler={imagePreviewHandler}
              imageUploadHandler={imageUploadHandler}
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
