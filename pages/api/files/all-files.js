import { getAllFiles } from '../../../backend/filesystem'

export default async function handler(req, res) {
  try {
    const { filePath } = req.query
    const files = await getAllFiles(filePath)
    res.status(200).json({ files })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
