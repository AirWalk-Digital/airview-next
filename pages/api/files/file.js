import { getFileContent } from '../../../backend/filesystem';
import mime from 'mime-types';
import {fileTypeFromFile} from 'file-type';

export default async function handler(req, res) {
  const { filePath } = req.query;
  if (!filePath) {
    res.status(500).json({ error: 'File not specified.' });
    return;
  }

  try {
    const fileContent = await getFileContent(filePath);
    let contentType;

    try {
      const { mime } = await fileTypeFromFile(fileContent);
      // console.log(fileTypeFromFile(fileContent))
      contentType = mime;
    } catch (error) {
      // console.log(error)
      const extension = filePath.split('.').pop();
      contentType = mime.lookup(extension);
    }

    res.setHeader('Content-Type', contentType || 'application/octet-stream');
    res.status(200).send(fileContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read the file. \n Error: ' + error });
  }
}
