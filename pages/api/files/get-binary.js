import path from 'path';
import fs from 'fs';
import mime from 'mime-types';

export default function handler(req, res) {
  const { filePath } = req.query;
  if (!filePath) {
    res.status(500).json({ error: 'File not specified.' });
    return;
  }

  try {
    const absolutePath = path.join(process.cwd(), 'content', filePath);
    const extension = path.extname(filePath);
    const contentType = mime.lookup(extension) || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);

    const stream = fs.createReadStream(absolutePath);
    stream.on('open', () => {
      stream.pipe(res);
    });
    stream.on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to read the file.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read the file.' });
  }
}
