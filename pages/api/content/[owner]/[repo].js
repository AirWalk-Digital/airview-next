import {getAllFilesForPath, getFileContent} from "@/lib/github";

export default async function handler(req, res) {
  try {
    if (typeof req.query.path !== "string") {
      res.status(400).send();
      return;
    }

    const owner = req.query.owner;
    const repo = req.query.repo;
    let path = req.query.path;
    let branch = 'main';
    if (path.endsWith("/")) {
      // Remove trailing slash
      path = path.slice(0, -1);
      // console.log(path);
      // Get the list of files for the given path and its subdirectories
      const files = await getAllFilesForPath(owner, repo, branch, path);
      res.status(200).json({ files });

    } else {
      // Get the content of a specific file
      // console.log('Getting file content');
      const data = await getFileContent(owner, repo, branch, path);
      // console.log(data);
      // const content = Buffer.from(data.content ?? "", "base64").toString("utf8");
      res.status(200).json({ data });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
}
