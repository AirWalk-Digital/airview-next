import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import fs from "fs";


// Function to get a file content
export async function getFileContent(owner, repo, branch, path) {
  const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_FILE;
  const privateKey = fs.readFileSync(privateKeyPath, "utf-8");
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID,
      privateKey: privateKey,
      installationId: process.env.GITHUB_INSTALLATION_ID,
      expire_in: 60
    },
  });
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

      // // console.log('api:data: ', response.data);
    if (response.data.encoding === 'base64') {
      // Decode base64 content for image files
      return Buffer.from(response.data.content, 'base64');
    } else {
      // For text files, assume UTF-8 encoding
      return Buffer.from(response.data.content, 'utf-8');
    }
  } catch (error) {
    console.error('Error retrieving file content:', error, 'path:', path);
  }
}

// Function to get all files for a given path
export async function getAllFiles(owner, repo, branch, path, recursive = true, filter = null) {
  const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_FILE;
  const privateKey = fs.readFileSync(privateKeyPath, "utf-8");
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID,
      privateKey: privateKey,
      installationId: process.env.GITHUB_INSTALLATION_ID,
      expire_in: 60
    },
  });

  const branchSha = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch,
  });

  const files = await getAllFilesRecursive(octokit, owner, repo, branchSha.data.commit.sha, path, recursive, filter);

  return files;

}


async function getAllFilesRecursive(octokit, owner, repo, sha, path, recursive, filter) {
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref: sha,
  });

  const fileObjects = response.data.filter(obj => obj.type === 'file');
  let files = fileObjects.map(obj => obj.path);

  if (recursive) {
    const dirObjects = response.data.filter(obj => obj.type === 'dir');
    for (const dirObject of dirObjects) {
      const subPath = path ? `${path}/${dirObject.name}` : dirObject.name;
      const subFiles = await getAllFilesRecursive(octokit, owner, repo, sha, subPath, recursive, filter);
      files = files.concat(subFiles);
    }
  }
  if (filter) {
    const regex = createFilterRegex(filter);
    files = files.filter(file => regex.test(file));
  }

  return files;
}
function createFilterRegex(filter) {
  const escapedFilter = filter.replace(/\./g, '\\.').replace(/\*/g, '.*');
  return new RegExp(`^.*${escapedFilter}$`, 'i');
}