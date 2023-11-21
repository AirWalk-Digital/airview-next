import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

import fs from "fs";
import { cacheWrite, cacheRead } from "@/lib/redis";

let gitHubInstance;

function getGitHubConfiguration() {
  let privateKey = process.env.GITHUB_PRIVATE_KEY;
  if (!privateKey) {
    const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_FILE;
    privateKey = fs.readFileSync(privateKeyPath, "utf-8");
  }
  return {
    privateKey: privateKey,
    appId: process.env.GITHUB_APP_ID,
    installationId: process.env.GITHUB_INSTALLATION_ID,
  };
}

export function createGitHubInstance(config = getGitHubConfiguration()) {
  try {
    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: config.appId,
        privateKey: config.privateKey,
        installationId: config.installationId,
      },
    });
    return octokit;
  } catch (e) {
    throw new Error(
      `[GitHub] Could not create a GitHub instance: ${e.message}`,
    );
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
      console.info('[Github][getBranchSha][Cache][MISS]:', cacheKey)
    }
    const branchSha = await gitHubInstance.rest.repos.getBranch({
      owner,
      repo,
      branch,
    });

    try {
      // Store the content in the cache before returning it
      await cacheWrite(cacheKey, branchSha.data.commit.sha, 600);
    } catch (error) {
      console.error(`[GitHub][getBranchSha] Error writing cache: ${error}`);

    }
    return branchSha.data.commit.sha;
  } catch (error) {
    console.error(`[GitHub][getBranchSha] Error getting sha: ${error}`);
    // throw new Error(`[GitHub][getBranchSha] Could not get sha for branch`);
  }
}

// Function to get a file content
export async function getFileContent(owner, repo, branch, path, sha = null) {

  // if the SHA is passed, this is a specific revision of a file.
  // if not, pull back the generic revision of the file, stored with the branch sha instead.

  const branchSha = await getBranchSha(owner, repo, branch)

  // Generate a unique cache key for this file
  let cacheKey = '';
  if (sha) {
    cacheKey = `github:getContent:${owner}:${repo}:${sha}:${path}`;
  } else {
    cacheKey = `github:getContent:${owner}:${repo}:${branchSha}:${path}`;
  }

  // Check if the content is in the cache
  const cachedContent = await cacheRead(cacheKey);

  let ref = null;

  if (cachedContent) {
    try {
      ref = JSON.parse(cachedContent)
      // console.info('[Github][Read][Ref]:', ref.ref)

      if (ref && ref.ref) {
        const cachedRefContent = await cacheRead(`github:getContent:${owner}:${repo}:${ref.ref}:${path}`);
        if (cachedRefContent) {
          console.info('[Github][Read][HIT/Sha]:', cacheKey, ' ref:', ref.ref)
          return cachedRefContent;
        } else {
          console.info('[Github][Read][MISS/Sha]:', cacheKey, ' ref:', ref.ref)
        }
      } else {
        console.info('[Github][Read][HIT/Branch]:', cacheKey)
        return cachedContent;  
      }
    } catch (error) {
      console.info('[Github][Read][Error]:', cacheKey, 'error: ', error)
      console.info('[Github][Read][Error]:', cacheKey, 'cachedContent: ', cachedContent)

      return cachedContent;
    }
    // console.info('[Github][Cache][HIT]:',cacheKey )
    // If the content was found in the cache, return it
    return cachedContent;
  } else {
    console.info('[Github][Read][MISS/All]:', cacheKey)
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
    if (response.data.encoding === "base64") {
      // Decode base64 content for image files
      content = Buffer.from(response.data.content, "base64");
    } else {
      // For text files, assume UTF-8 encoding
      content = Buffer.from(response.data.content, "utf-8");
    }
    try {


      if (response.data.sha) {
        // Store a link from the branchSha to the file
        ref = {ref: response.data.sha}
        await cacheWrite(`github:getContent:${owner}:${repo}:${branchSha}:${path}`, JSON.stringify(ref)); // cache perpetually a reference to the file
        await cacheWrite(`github:getContent:${owner}:${repo}:${response.data.sha}:${path}`, content); // cache perpetually the file contents
        console.debug(`[GitHub][Write][CachedFileAndRef] : ${path}`);

      } else {
        // Store the content in the cache before returning it
        await cacheWrite(cacheKey, content); // cache for 24 hours 
        console.debug(`[GitHub][Write][Cache] : ${path}`);

      }

    } catch (error) {
      console.error(`[GitHub][Write] Error writing cache: ${error}`);

    }
    return content;
  } catch (error) {
    console.error(`[GitHub][getFileContent] Error retrieving file (${cacheKey}) content: ${error}`);
    // throw new Error(`[GitHub][getFileContent] Could not get file`);
    // console.error('Error retrieving file content:', error, 'path:', path);
    // return null;
  }
}

// Function to get all files for a given path
export async function getAllFiles(
  owner,
  repo,
  branch,
  path,
  recursive = true,
  filter = null,
) {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  const branchSha = await getBranchSha(owner, repo, branch);
  const files = await getAllFilesRecursive(
    gitHubInstance,
    owner,
    repo,
    branchSha,
    path,
    recursive,
    filter,
  );
  return files;
}

async function getAllFilesRecursive(
  gitHubInstance,
  owner,
  repo,
  sha,
  path,
  recursive,
  filter,
) {

  const response = await gitHubInstance.repos.getContent({
    owner,
    repo,
    path,
    ref: sha,
  });

  const fileObjects = response.data.filter((obj) => obj.type === "file");
  let files = fileObjects.map((obj) => ({ path: obj.path, sha: obj.sha}));
  // console.log('files: ', files)
  if (recursive) {
    const dirObjects = response.data.filter((obj) => obj.type === "dir");
    for (const dirObject of dirObjects) {
      const subPath = path ? `${path}/${dirObject.name}` : dirObject.name;
      const subFiles = await getAllFilesRecursive(
        gitHubInstance,
        owner,
        repo,
        sha,
        subPath,
        recursive,
        filter,
      );
      files = files.concat(subFiles);
    }
  }
  if (filter) {
    const regex = createFilterRegex(filter);
    files = files.filter((file) => regex.test(file.path));
  }

  return files;
}
function createFilterRegex(filter) {
  const escapedFilter = filter.replace(/\./g, "\\.").replace(/\*/g, ".*");
  return new RegExp(`^.*${escapedFilter}$`, "i");
}





const linkParser = (linkHeader) => {
  const re = /<.*(?=>; rel=\"next\")/g;
  let arrRes = [];
  while ((arrRes = re.exec(linkHeader)) !== null) {
    return arrRes[0].split("<").slice(-1)[0];
  }
  return null;
};

const getData = async (url) => {
  const resp = await fetch(url, {
    headers: {
      // Add any necessary headers here
    }
  });
  if (resp.status !== 200) {
    throw Error(`Bad status getting branches ${resp.status} ${await resp.text()}`);
  }
  const data = await resp.json();
  const mapped = data.map(item => ({
    name: item.name,
    sha: item.commit.sha,
    isProtected: item.protected,
  }));

  const next = linkParser(resp.headers.get("Link"));
  return { mapped, next };
};

// export const getBranches = async () => {
//   let link = `${GITHUB_REPO_URI}/branches?per_page=100`;
//   let final = [];

//   while (link) {
//     const { mapped, next } = await getData(link);
//     link = next;
//     final = final.concat(mapped);
//   }
//   return final;
// };

export async function getBranches(owner, repo) {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  try {
    // Generate a unique cache key for this file
    const cacheKey = `github:getBranches:${owner}:${repo}`;

    // Check if the content is in the cache
    const cachedContent = await cacheRead(cacheKey);
    if (cachedContent) {
      console.info('[Github][getBranches][HIT]:',cacheKey )
      // If the content was found in the cache, return it
      // return cachedContent;
    } else {
      console.info('[Github][getBranches][Cache][MISS]:', cacheKey)
    }

    // Fetch branches
    const branches = await gitHubInstance.paginate(gitHubInstance.repos.listBranches, {
      owner,
      repo,
      per_page: 100
    });

    // Filter branches with protected set to false
    const unprotectedBranches = branches.filter(branch => !branch.protected);

    try {
      // Store the content in the cache before returning it
      await cacheWrite(cacheKey, unprotectedBranches, 600);
    } catch (error) {
      console.error(`[GitHub][getBranches] Error writing cache: ${error}`);

    }
    return unprotectedBranches;
  } catch (error) {
    console.error(`[GitHub][getBranches] Error getting sha: ${error}`);
    // throw new Error(`[GitHub][getBranchSha] Could not get sha for branch`);
  }
}