import { getFileContent } from '../../../backend/filesystem';

export default async function handler(req, res) {
  const { filePath } = req.query
  if (!filePath) {
    res.status(500).json({ error: 'File not specified.' })
    return
  }

  try {
    const fileContent = await getFileContent(filePath)
    res.status(200).json({ content: fileContent })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to read the file.' })
  }
}
