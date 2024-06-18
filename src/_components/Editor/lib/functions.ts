import path from 'path';

import { getLogger } from '@/lib/Logger';
import type { ContentItem } from '@/lib/Types';

const logger = getLogger().child({ namespace: 'Editor/functions' });
logger.level = 'info';

export async function createNewBranch({
  owner,
  repo,
  branch,
  sourceBranch,
}: {
  owner: string;
  repo: string;
  branch: string;
  sourceBranch: string;
}) {
  const response = await fetch('/api/github/branch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      owner,
      repo,
      branch,
      sourceBranch,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    logger.info('ControlBar:createNewBranch:response: ', data);
    throw new Error(`${data.error}`);
  }

  const data = await response.json();
  return data;
}

export async function createFile({
  owner,
  repo,
  branch,
  file,
  content,
  message,
}: {
  owner: string;
  repo: string;
  branch: string;
  file: string;
  content: string;
  message: string;
}) {
  const filePath = file.replace(/^\/|^\.\//, '');

  try {
    const response = await fetch(
      `/api/github/content/${owner}/${repo}?branch=${branch}&path=${filePath}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, message }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    // console.log('Editor:createFile:Commit successful:', data);
    return result;
  } catch (e: any) {
    // console.error('Editor:createFile:Error committing file:', e.message);
    return null;
  }
}

export async function editorSaveHandler(): Promise<string> {
  return 'success';
}

export async function imagePreviewHandler(
  imageSource: string,
  context: ContentItem
): Promise<string> {
  // console.log('Editor:imagePreviewHandler: ', context, imageSource);
  if (imageSource.startsWith('http')) return imageSource;

  const file = `${path.dirname(context.file ?? '')}/${imageSource.replace(/^\/|^\.\//, '')}`;
  const filePath = file.replace(/^\/|^\.\//, ''); // strip leading slash
  // console.log('Editor:imagePreviewHandler:filePath: ', filePath);

  const response = await fetch(
    `/api/github/content/${context.owner}/${context.repo}?branch=${context.branch}&path=${filePath}`
  );
  // console.log('Editor:imagePreviewHandler:response: ', response);
  if (!response.ok) {
    throw new Error(
      `Editor:imagePreviewHandler:HTTP error! status: ${response.status}`
    );
  }
  // Fetch the image as Blob directly
  const blob = await response.blob();

  // Create an object URL for the Blob
  const imageObjectUrl = URL.createObjectURL(blob);
  // console.log('Editor:imagePreviewHandler:imageObjectUrl: ', imageObjectUrl);
  return imageObjectUrl;
}

export async function imageUploadHandler(
  image: File,
  context: ContentItem
): Promise<string> {
  const formData = new FormData();
  formData.append('image', image);
  const file = `${path.dirname(context.file || '')}/${image.name
    .replace(/[^a-zA-Z0-9.]/g, '')
    .toLowerCase()}`;
  // const fileName = image.name.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // eslint-disable-next-line func-names
    reader.onloadend = async function () {
      const base64Image = reader.result;
      const imageData =
        typeof base64Image === 'string' ? base64Image.split(',')[1] : '';
      try {
        const url = await createFile({
          owner: context.owner,
          repo: context.repo,
          branch: context.branch,
          file,
          content: imageData ?? '',
          message: 'Image uploaded from Airview',
        });
        if (url) {
          resolve(url);
        } else {
          reject(new Error('Error uploading image'));
        }
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = reject;

    reader.readAsDataURL(image);
  });
}

export const raisePR = async ({
  owner,
  repo,
  title,
  message,
  head,
  base,
}: {
  owner: string;
  repo: string;
  title: string;
  message: string;
  head: string;
  base: string;
}) => {
  try {
    const response = await fetch('/api/repo/pr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner, repo, title, message, head, base }),
    });

    const data = await response.json();
    // console.log('lib/github/raisePR:response: ', data)
    if (!response.ok) {
      throw Error(data.error || 'Network response was not ok');
    }

    return data;
  } catch (error: any) {
    // console.error('There has been a problem with your fetch operation:', error);
    throw Error(error.message);
  }
};
