import { getAllFiles, getFileContent, commitFileToBranch } from "@/lib/github";
import path from 'path';
import mime from 'mime-types';
export const config = {
  api: {
    responseLimit: '8mb',
  },
}
export default async function handler(req, res) {
  try {
    const { owner, repo, branch = 'main', path: filepath } = req.query;

    if (!owner || !repo || typeof filepath !== "string") {
      res.status(400).json({ error: 'Missing required parameters: owner, repo, or path' });
      return;
    }

    if (req.method === "GET") {
      if (filepath.endsWith("/")) {
        // Remove trailing slash
        const trimmedPath = filepath.slice(0, -1);
        const files = await getAllFiles(owner, repo, branch, trimmedPath);
        res.status(200).json({ files });
      } else {
        const data = await getFileContent(owner, repo, branch, filepath);
        const extension = path.extname(filepath);
        const contentType = mime.lookup(extension) || 'application/octet-stream';
        res.setHeader("Content-Type", contentType);
        console.log("content-type: ", contentType);
        res.send(data);
      }
    } else if (req.method === "POST") {
      const { content, message } = req.body;
      if (!content || !message) {
        res.status(400).json({ error: 'Missing required parameters: content or message' });
        return;
      }
      const commitResponse = await commitFileToBranch(owner, repo, branch, filepath, content, message);
      res.status(201).json(commitResponse);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
