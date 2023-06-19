import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import fs from "fs";
import { cacheWrite, cacheRead } from '@/lib/redis';

let gitHubInstance;


function getGitHubConfiguration() {
  const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_FILE;
  const privateKey = fs.readFileSync(privateKeyPath, "utf-8");
  return {
    privateKey: privateKey,
    appId: process.env.GITHUB_APP_ID,
    installationId: process.env.GITHUB_INSTALLATION_ID,
  }
}

export function createGitHubInstance(config = getGitHubConfiguration()) {
  try {
    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: config.appId,
        privateKey: config.privateKey,
        installationId: config.installationId,
        expire_in: 60
      },
    });
    return octokit
  } catch (e) {
    throw new Error(`[GitHub] Could not create a GitHub instance`);
  }

}



// Function to get a file content
export async function getBranchSha(owner, repo, branch) {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  try {
    // Generate a unique cache key for this file
    const cacheKey = `github:getBranch:${owner}:${repo}:${branch}`;

    // Check if the content is in the cache
    const cachedContent = await cacheRead(cacheKey);
    if (cachedContent) {
      // console.info('[Github][Cache][HIT]:',cacheKey )
      // If the content was found in the cache, return it
      return cachedContent;
    } else {
      console.info('[Github][Cache][MISS]:',cacheKey )
    }
    const branchSha = await gitHubInstance.rest.repos.getBranch({
      owner,
      repo,
      branch,
    });
    // Store the content in the cache before returning it
    await cacheWrite(cacheKey, branchSha.data.commit.sha, 600);
    return branchSha.data.commit.sha;
  } catch (error) {
    console.error(`[GitHub][getBranchSha] Error getting sha: ${error}`);
    // throw new Error(`[GitHub][getBranchSha] Could not get sha for branch`);
    
  }

}



// Function to get a file content
export async function getFileContent(owner, repo, branch, path) {
  
  const branchSha = await getBranchSha(owner, repo, branch,)

  // Generate a unique cache key for this file
  const cacheKey = `github:getContent:${owner}:${repo}:${branchSha}:${path}`;

  // Check if the content is in the cache
  const cachedContent = await cacheRead(cacheKey);
  if (cachedContent) {
    // console.info('[Github][Cache][HIT]:',cacheKey )
    // If the content was found in the cache, return it
    return cachedContent;
  } else {
    console.info('[Github][Cache][MISS]:',cacheKey )
  }

  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }

  try {
    const response = await gitHubInstance.repos.getContent({
      owner,
      repo,
      path,
      ref: branchSha,
    });

    let content;
    if (response.data.encoding === 'base64') {
      // Decode base64 content for image files
      content = Buffer.from(response.data.content, 'base64');
    } else {
      // For text files, assume UTF-8 encoding
      content = Buffer.from(response.data.content, 'utf-8');
    }
    // Store the content in the cache before returning it
    await cacheWrite(cacheKey, content, 60*60*24); // cache for 24 hours
    return content;

  } catch (error) {
    console.error(`[GitHub][getFileContent] Error retrieving file content: ${error}`);
    // throw new Error(`[GitHub][getFileContent] Could not get file`);
    // console.error('Error retrieving file content:', error, 'path:', path);
    // return null;
  }
}

// Function to get all files for a given path
export async function getAllFiles(owner, repo, branch, path, recursive = true, filter = null) {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  const branchSha = await getBranchSha(owner, repo, branch,);
  const files = await getAllFilesRecursive(gitHubInstance, owner, repo, branchSha, path, recursive, filter);
  return files;

}


async function getAllFilesRecursive(gitHubInstance, owner, repo, sha, path, recursive, filter) {
  const response = await gitHubInstance.repos.getContent({
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
      const subFiles = await getAllFilesRecursive(gitHubInstance, owner, repo, sha, subPath, recursive, filter);
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