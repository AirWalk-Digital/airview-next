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
    },
  });

  const response = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref: branch,
  });
  // console.log(response);
  const content = Buffer.from(
    response.data.content,
    response.data.encoding
  ).toString("utf-8");

  return content;
}

// Function to get all files for a given path
export async function getAllFilesForPath(owner, repo, branch, path, recursive = true) {
  const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_FILE;
  const privateKey = fs.readFileSync(privateKeyPath, "utf-8");
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID,
      privateKey: privateKey,
      installationId: process.env.GITHUB_INSTALLATION_ID,
    },
  });

  const branchSha = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch,
  });
  const response = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive={recursive}', {
    owner: owner,
    repo: repo,
    tree_sha: await branchSha.data.commit.sha,
    recursive: recursive,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  // const files = response.data.tree.map((file) => file.path);

  const files = response.data.tree
  .filter((obj) => obj.type === 'blob')
  .map((obj) => obj.path);

  return files;

}

