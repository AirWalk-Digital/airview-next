import path from 'path';

import type { ContentItem } from '@/lib/Types';

export async function createFile(
  owner: string,
  repo: string,
  branch: string,
  file: string,
  fileName: string,
  content: string,
  message: string
) {
  // use in pages

  // const file = path.basename(path);

  // console.debug(
  //   'Editor:createFile: ',
  //   owner,
  //   repo,
  //   branch,
  //   file,
  //   fileName,
  //   content,
  //   message,
  // );
  const filePath = file.replace(/^\/|^\.\//, '');

  // return fileName;

  try {
    const response = await fetch(
      `/api/content/github/${owner}/${repo}?branch=${branch}&path=${filePath}`,
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
    await response.json();
    // console.log('Editor:createFile:Commit successful:', data);
    return fileName;
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
    `/api/content/github/${context.owner}/${context.repo}?branch=${context.branch}&path=${filePath}`
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
  const fileName = image.name.replace(/[^a-zA-Z0-9.]/g, '').toLowerCase();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // eslint-disable-next-line func-names
    reader.onloadend = async function () {
      const base64Image = reader.result;
      const imageData =
        typeof base64Image === 'string' ? base64Image.split(',')[1] : '';
      try {
        const url = await createFile(
          context.owner,
          context.repo,
          context.branch,
          file,
          fileName,
          imageData ?? '',
          'Image uploaded from Airview'
        );
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
