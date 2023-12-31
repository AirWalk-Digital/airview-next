import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import axios from 'axios';
import fs from "fs";
import { cacheWrite, cacheRead, cacheDelete } from "@/lib/redis";

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
      `[GitHub] Could not create a GitHub instance: ${e.message}`
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
      console.info("[Github][getBranchSha][Cache][MISS]:", cacheKey);
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

  const branchSha = await getBranchSha(owner, repo, branch);

  // Generate a unique cache key for this file
  let cacheKey = "";
  if (sha) {
    cacheKey = `github:getContent:${owner}:${repo}:${sha}:${path}`;
  } else {
    cacheKey = `github:getContent:${owner}:${repo}:${branchSha}:${path}`;
  }

  // Check if the content is in the cache
  const cachedContent = await cacheRead(cacheKey);

  if (sha) {  // if the SHA is passed, this is a specific revision of a file.
    if (cachedContent) {
      console.info('[Github][Read][HIT/Sha]:', cacheKey, ' sha:', sha)
      if (cachedContent && cachedContent.encoding) {
        console.info('[Github][Cached/Sha][HIT/cachedRefContent]:', cachedContent)
        // console.info('[Github][Cached/Sha][HIT/Sha]:', cacheKey, ' ref:', ref.ref)
        if (!cachedContent.encoding === 'none')  {
          return cachedContent.content.data.toString(cachedContent.encoding);
        } else {
          if (cachedContent.content.type === 'Buffer') {
            return Buffer.from(cachedContent.content.data, 'binary');
          }
        }
      } else if (cachedContent ) {

      } else {
        console.info("[Github][Cached/Sha][MISS]:", cacheKey);
      }



      return cachedContent.content.data;
    } else {
      console.info("[Github][Read][MISS/Sha]:", cacheKey, " sha:", sha);
    }
  }

  let ref = null;

  if (cachedContent) {
    try {
      ref = JSON.parse(cachedContent);
      console.info('[Github][Read][initialCacheKey]:', cacheKey)

      if (ref && ref.ref) {
        console.info('[Github][Read][Ref]:', `github:getContent:${owner}:${repo}:${ref.ref}:${path}`)
        const cachedRefContent = await cacheRead(
          `github:getContent:${owner}:${repo}:${ref.ref}:${path}`
        );
        console.info('[Github][Read][HIT/cachedRefContent]:', cachedRefContent)
        if (cachedRefContent && cachedRefContent.encoding) {
          console.info('[Github][Read][HIT/cachedRefContent]:', cachedRefContent)
          console.info('[Github][Read][HIT/Sha]:', cacheKey, ' ref:', ref.ref)
          if (!cachedRefContent.encoding === 'none')  {
            return cachedRefContent.content.data.toString(cachedRefContent.encoding);
          } else {
            if (cachedRefContent.content.type === 'Buffer') {
              return Buffer.from(cachedRefContent.content.data, 'binary');
            }
          }
        } else if (cachedRefContent ) {

        } else {
          console.info("[Github][Read][MISS/Sha]:", cacheKey, " ref:", ref.ref);
        }
      } else {
        // console.info('[Github][Read][HIT/Branch]:', cacheKey)
        return cachedContent.content.data;
      }
    } catch (error) {

      
      console.info("[Github][Read/Ref][Error]:", cacheKey, "error: ", error);
      // console.info(
      //   "[Github][Read][Error]:",
      //   cacheKey,
      //   "cachedContent: ",
      //   cachedContent
      // );

      return cachedContent;
    }
    // console.info('[Github][Cache][HIT]:',cacheKey )
    // If the content was found in the cache, return it
    // return cachedContent;
  } else {
    console.info("[Github][Read][MISS/All]:", cacheKey);
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

    const { data: commits } = await gitHubInstance.repos.listCommits({
      owner,
      repo,
      path,
    });

    const contributors = commits.reduce((acc, commit) => {
      const authorName = commit.commit.author.name;
      const authorDate = new Date(commit.commit.author.date).toDateString();

      const pair = {authorName, authorDate};

      const index = acc.findIndex(item => item.authorName === pair.authorName && item.authorDate === pair.authorDate);

      if (index === -1) {
        acc.push(pair);
      }

      return acc;
    }, []);
  
    console.log('github:getContent:commits ', contributors)

    let encoding = response.data.encoding;
    console.log('github:getContent:encoding ', encoding)

    let content;
    if (response.data.encoding === "base64") {
      // Decode base64 content for image files
      content = Buffer.from(response.data.content, "base64");
    } else if (response.data.encoding === "utf-8") {
      // For text files, assume UTF-8 encoding
      content = Buffer.from(response.data.content, "utf-8");
    } else if (response.data.encoding === "none") {
      // large URL. get direct
      console.log('github:getContent:download_url ', response.data.download_url)
      const downloadResponse = await axios.get(response.data.download_url, { responseType: 'arraybuffer' });
      content = Buffer.from(downloadResponse.data, 'binary');
      // console.log('github:getContent:downloadResponse ', downloadResponse.data.split('\n').slice(0, 10).join('\n'));
    }
    try {
      if (response.data.sha) {
        // Store a link from the branchSha to the file
        ref = { ref: response.data.sha };
        await cacheWrite(
          `github:getContent:${owner}:${repo}:${branchSha}:${path}`,
          JSON.stringify(ref)
        ); // cache perpetually a reference to the file
        await cacheWrite(
          `github:getContent:${owner}:${repo}:${response.data.sha}:${path}`,
          { content, encoding, contributors },
        ); // cache perpetually the file contents
        console.debug(`[GitHub][Write][CachedFileAndRef] : ${path} : encoding: ${response.data.encoding}`);
        console.debug(`[GitHub][Write][CachedFileAndRef][Ref] : github:getContent:${owner}:${repo}:${branchSha}:${path}`);
        console.debug(`[GitHub][Write][CachedFileAndRef][Content] : github:getContent:${owner}:${repo}:${response.data.sha}:${path}`);
      } else {
        // Store the content in the cache before returning it
        await cacheWrite(cacheKey, { content, encoding, contributors }); // cache for 24 hours
        console.debug(`[GitHub][Write][Cache] : ${path}`);
      }
    } catch (error) {
      console.error(`[GitHub][Write] Error writing cache: ${error}`);
    }
    return content;
  } catch (error) {
    console.error(
      `[GitHub][getFileContent] Error retrieving file (${cacheKey}) content: ${error}`
    );
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
  filter = null
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
    filter
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
  filter
) {
  const response = await gitHubInstance.repos.getContent({
    owner,
    repo,
    path,
    ref: sha,
  });

  const fileObjects = response.data.filter((obj) => obj.type === "file");
  let files = fileObjects.map((obj) => ({ path: obj.path, sha: obj.sha }));
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
        filter
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
    },
  });
  if (resp.status !== 200) {
    throw Error(
      `Bad status getting branches ${resp.status} ${await resp.text()}`
    );
  }
  const data = await resp.json();
  const mapped = data.map((item) => ({
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
      console.info("[Github][getBranches][HIT]:", cacheKey);
      // If the content was found in the cache, return it
      // return cachedContent;
    } else {
      console.info("[Github][getBranches][Cache][MISS]:", cacheKey);
    }

    // Fetch branches
    const branches = await gitHubInstance.paginate(
      gitHubInstance.repos.listBranches,
      {
        owner,
        repo,
        per_page: 100,
      }
    );

    // Filter branches with protected set to false
    // const unprotectedBranches = branches.filter((branch) => !branch.protected);
    const unprotectedBranches = branches;

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

// Function to create a new branch
export async function createBranch(owner, repo, branch, sourceBranch) {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }

  try {
    const sourceBranchSha = await getBranchSha(owner, repo, sourceBranch);

    const response = await gitHubInstance.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: sourceBranchSha,
    });

    return response.data;
  } catch (error) {
    console.error(`[GitHub][createBranch] Error creating branch: ${error}`);
    throw new Error(`Could not create branch: ${error}`);
  }
}

// Function to commit a file to a branch
export async function commitFileToBranch(
  owner,
  repo,
  branch,
  path,
  content,
  message
) {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }

  try {
    const branchSha = await getBranchSha(owner, repo, branch);
    const encoding = isBase64(content) ? 'base64' : 'utf-8';

    const blob = await gitHubInstance.rest.git.createBlob({
      owner,
      repo,
      content,
      encoding: encoding,
    });

    const tree = await gitHubInstance.rest.git.createTree({
      owner,
      repo,
      base_tree: branchSha,
      tree: [
        {
          path: path,
          mode: "100644",
          type: "blob",
          sha: blob.data.sha,
        },
      ],
    });

    const newCommit = await gitHubInstance.rest.git.createCommit({
      owner,
      repo,
      message,
      tree: tree.data.sha,
      parents: [branchSha],
    });

    await gitHubInstance.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.data.sha,
    });

    
    // refresh branch cache
    try {
      // Store the content in the cache before returning it
      const cacheKey = `github:getBranch:${owner}:${repo}:${branch}`;
      await cacheWrite(cacheKey, newCommit.data.sha, 600);
    } catch (error) {
      console.error(`[GitHub][getBranchSha] Error writing cache: ${error}`);
    }

    return newCommit.data;
  } catch (error) {
    console.error(
      `[GitHub][commitFileToBranch] Error committing file: ${error}`
    );
    throw new Error(`${error}`);
  }
}

function isBase64(str) {
  try {
      return btoa(atob(str)) == str;
  } catch (err) {
      return false;
  }
}

export async function commitFileChanges(owner, repo, branch, path, content, message) { // use in pages
  try {
    const response = await fetch(`/api/content/github/${owner}/${repo}?branch=${branch}&path=${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, message }),
    });

    if (!response.ok) {
      const data = await response.json();

      console.log('/lib/github/commitFileChanges:response: ', data)
      if (data.error) {
        throw new Error(`Error committing file: ${data.error}`);
      } else {
        throw new Error(`Error committing file: ${response.status}`);
      }

    }

    const data = await response.json();
    console.log('Commit successful:', data);
    // // refresh branch cache
    // const newBranchSha = await gitHubInstance.rest.repos.getBranch({
    //   owner,
    //   repo,
    //   branch,
    // });

    // try {
    //   // Store the content in the cache before returning it
    //   const cacheKey = `github:getBranch:${owner}:${repo}:${branch}`;
    //   await cacheWrite(cacheKey, newBranchSha.data.commit.sha, 600);
    // } catch (error) {
    //   console.error(`[GitHub][getBranchSha] Error writing cache: ${error}`);
    // }
  } catch (e) {
    console.error('Error committing file:', e.message);
    throw new Error(`${e.message}`);
  }
}


export const createPR = async (owner, repo, title, body, head, base) => {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  try {
    const response = await gitHubInstance.rest.pulls.create({
      owner,
      repo,
      title,
      body,
      head,
      base,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const raisePR = async (owner, repo, title, body, head, base) => {
  try {
    const response = await fetch('/api/repo/pr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner, repo, title, body, head, base }),
    });

    const data = await response.json();
    // console.log('lib/github/raisePR:response: ', data)
    if (!response.ok) {
      throw Error(data.error || 'Network response was not ok');
    }

    return data;
  } catch (error) {
    // console.error('There has been a problem with your fetch operation:', error);
    throw Error(error.message);
  }
};