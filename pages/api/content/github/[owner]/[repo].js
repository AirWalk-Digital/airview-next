import {getAllFiles, getFileContent} from "@/lib/github";
import path from 'path';
import mime from 'mime-types';
// example: http://localhost:3000/api/content/github/owner/repo?path=docs/

export default async function handler(req, res) {
  try {
    if (typeof req.query.path !== "string") {
      res.status(400).send();
      return;
    }

    const owner = req.query.owner;
    const repo = req.query.repo;
    let filepath = req.query.path;
    let branch = req.query.branch || 'main';
    if (filepath.endsWith("/")) {
      // Remove trailing slash
      filepath = filepath.slice(0, -1);
      // // // console.log(path);
      // Get the list of files for the given path and its subdirectories
      const files = await getAllFiles(owner, repo, branch, filepath);

      res.status(200).json({ files });

    } else {
      // Get the content of a specific file
      // // // console.log('Getting file content');
      const data = await getFileContent(owner, repo, branch, filepath);
      const extension = path.extname(filepath);
      const contentType = mime.lookup(extension) || 'application/octet-stream';
      // console.log('api:data: ', contentType, data);
      res.setHeader("Content-Type", contentType);
      res.send(data);
      // res.end(Buffer.from(data, "base64"));
      // const content = Buffer.from(data.content ?? "", "base64").toString("utf8");
      // res.status(200).json({ data });
    }
  } catch (err) {
    // console.log(err);
    res.status(500).send();
  }
}
