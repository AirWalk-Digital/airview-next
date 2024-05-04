import crypto from 'node:crypto';

import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
// import axios from 'axios';
import fs from 'fs';
import * as util from 'util';

import { getLogger } from '@/lib/Logger';
import { cacheRead, cacheWrite } from '@/lib/Redis';

let gitHubInstance: Octokit | undefined;
const logger = getLogger();

interface GitHubConfig {
  privateKey: string;
  appId: string;
  installationId: string;
}
const getGitHubConfiguration = (): GitHubConfig => {
  let privateKey = process.env.GITHUB_PRIVATE_KEY!;
  if (!privateKey) {
    const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_FILE!;
    privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
    privateKey = crypto
      .createPrivateKey(privateKey)
      .export({
        type: 'pkcs8',
        format: 'pem',
      })
      .toString();
  }
  return {
    privateKey,
    appId: process.env.GITHUB_APP_ID!,
    installationId: process.env.GITHUB_INSTALLATION_ID!,
  };
};

// function getGitHubConfiguration() {
//   let privateKey = process.env.GITHUB_PRIVATE_KEY;
//   if (!privateKey) {
//     const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_FILE;
//     if (!privateKeyPath) {
//       throw new Error('Private key file path is not defined.');
//     }
//     privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
//     privateKey = crypto
//       .createPrivateKey(privateKey)
//       .export({
//         type: 'pkcs8',
//         format: 'pem',
//       })
//       .toString();
//   }
//   return {
//     privateKey,
//     appId: process.env.GITHUB_APP_ID,
//     installationId: process.env.GITHUB_INSTALLATION_ID,
//   };
// }
export const createGitHubInstance = (
  config = getGitHubConfiguration(),
): Octokit => {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: config.appId,
      privateKey: config.privateKey,
      installationId: config.installationId,
    },
  });
  return octokit;
};

// export function createGitHubInstance(config = getGitHubConfiguration()) {
//   try {
//     const octokit = new Octokit({
//       authStrategy: createAppAuth,
//       auth: {
//         appId: config.appId,
//         privateKey: config.privateKey,
//         installationId: config.installationId,
//       },
//     });
//     return octokit;
//   } catch (e) {
//     throw new Error(
//       `[GitHub] Could not create a GitHub instance: ${(e as Error).message}`,
//     );
//   }
// }

// // Function to get a file content
// export async function getBranchSha(
//   owner: string,
//   repo: string,
//   branch: string,
// ): Promise<string> {
//   if (!gitHubInstance) {
//     gitHubInstance = await createGitHubInstance();
//   }
//   try {
//     // Generate a unique cache key for this file
//     const cacheKey = `github:getBranch:${owner}:${repo}:${branch}`;

//     // Check if the content is in the cache
//     const cachedContent = await cacheRead(cacheKey);
//     if (cachedContent) {
//       // logger.info('[Github][Cache][HIT]:',cacheKey )
//       // If the content was found in the cache, return it
//       return cachedContent;
//     }
//     logger.info('[Github][getBranchSha][Cache][MISS]:', cacheKey);

//     const branchSha = await gitHubInstance.rest.repos.getBranch({
//       owner,
//       repo,
//       branch,
//     });

//     try {
//       // Store the content in the cache before returning it
//       await cacheWrite(cacheKey, branchSha.data.commit.sha, 600);
//     } catch (error) {
//       logger.error(`[GitHub][getBranchSha] Error writing cache: ${error}`);
//     }
//     return branchSha.data.commit.sha;
//   } catch (error) {
//     logger.error(`[GitHub][getBranchSha] Error getting sha: ${error}`);
//     // throw new Error(`[GitHub][getBranchSha] Could not get sha for branch`);
//   }
//   return '';
// }

export const getBranchSha = async (
  owner: string,
  repo: string,
  branch: string,
): Promise<string> => {
  if (!gitHubInstance) {
    gitHubInstance = createGitHubInstance();
  }

  const cacheKey = `github:getBranch:${owner}:${repo}:${branch}`;
  const cachedContent = await cacheRead(cacheKey);
  if (cachedContent) return cachedContent;

  const { data } = await gitHubInstance.rest.repos.getBranch({
    owner,
    repo,
    branch,
  });

  await cacheWrite(cacheKey, data.commit.sha, 600);
  return data.commit.sha;
};

type CachedContent = {
  ref: string | undefined;
  contributors: { authorName: string; authorDate: string }[];
  encoding: string | undefined;
  content: {
    data: Buffer | string;
    type: string;
  };
};

async function getCachedFileContent(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  sha: string | undefined = undefined,
): Promise<{
  content: Buffer | undefined;
  encoding: string;
  contributors: { authorName: string; authorDate: string }[];
} | null> {
  // Generate a unique cache key for this file
  const branchSha = await getBranchSha(owner, repo, branch);
  let cacheKey = '';
  if (sha) {
    cacheKey = `github:content:${owner}:${repo}:${sha}:${path}`;
    const cachedContent: CachedContent = await cacheRead(cacheKey);
    if (cachedContent) {
      logger.info(`[Github][getCachedFileContent][HIT]: ${cacheKey}`);
      if (cachedContent && cachedContent.encoding) {
        if (cachedContent.encoding !== 'none') {
          return {
            content: Buffer.from(
              cachedContent.content.data as string,
              cachedContent.encoding as BufferEncoding,
            ),
            encoding: cachedContent.encoding as string,
            contributors: cachedContent.contributors,
          };
          // return cachedContent.content.data.toString(
          //   cachedContent.encoding as BufferEncoding,
          // );
        }
        // if (cachedContent.content.type === 'Buffer') {
        //   return Buffer.from(cachedContent.content.data.toString(), 'binary');
        // }
      }
      // return cachedContent.content.data;
    }
    return null;
  }
  cacheKey = `github:ref:${owner}:${repo}:${branchSha}:${path}`;
  const cachedContent: CachedContent = await cacheRead(cacheKey);

  if (cachedContent) {
    try {
      const ref = JSON.parse(cachedContent.toString());
      logger.info(`[Github][getCachedFileContent][CacheKey]: ${cacheKey}`);
      if (ref && ref.ref) {
        logger.info(
          `[Github][getCachedFileContent][Ref]: github:getContent:${owner}:${repo}:${ref.ref}:${path}`,
        );
        const cachedRefContent = await cacheRead(
          `github:content:${owner}:${repo}:${ref.ref}:${path}`,
        );
        if (cachedRefContent && cachedRefContent.encoding) {
          logger.info(
            `[Github][getCachedFileContent][HIT/cachedRefContent]: ${util.inspect(cachedRefContent)}`,
          );
          logger.info(`[Github][Read][HIT/Sha]: ${cacheKey} ref: ${ref.ref}`);
          // if (cachedRefContent.content.type === 'Buffer') {
          //   return Buffer.from(cachedRefContent.content.data, 'utf-8');
          // }
          if (cachedRefContent.encoding !== 'none') {
            return cachedRefContent.content.data.toString(
              cachedRefContent.encoding,
            );
          }
          // return cachedRefContent.content;
        }
        logger.info('[Github][Read][MISS/Sha]:', cacheKey, ' ref:', ref.ref);
      } else {
        // logger.info('[Github][Read][HIT/Branch]:', cacheKey)
        // return cachedContent.content.data;
      }
    } catch (error) {
      logger.info(`[Github][Read/Ref][Error]: ${cacheKey} error: ${error}`);
      return null;
    }
  } else {
    logger.info(`[Github][Read][MISS/All]: ${cacheKey}`);
    return null;
  }

  logger.info(`[Github][Read][MISS]: ${cacheKey}`);
  return null;
}

async function getGitHubFileContent(
  owner: string,
  repo: string,
  branch: string,
  path: string,
): Promise<{
  content: Buffer | undefined;
  encoding: string;
  contributors: { authorName: string; authorDate: string }[];
} | null> {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  const branchSha = await getBranchSha(owner, repo, branch);

  try {
    const response = (await gitHubInstance.repos.getContent({
      owner,
      repo,
      path,
      ref: branchSha,
    })) as {
      data: {
        encoding: string;
        sha: string;
        content: string;
        download_url: string;
      };
    };

    const { data: commits } = await gitHubInstance.repos.listCommits({
      owner,
      repo,
      path,
    });

    const contributors = commits.reduce(
      (acc: { authorName: string; authorDate: string }[], commit) => {
        const authorName = commit.commit.author?.name ?? '';
        const authorDate = new Date(
          commit.commit.author?.date ?? '',
        ).toDateString();

        const pair: { authorName: string; authorDate: string } = {
          authorName,
          authorDate,
        };

        const index = acc.findIndex(
          (item: { authorName: string; authorDate: string }) =>
            item.authorName === pair.authorName &&
            item.authorDate === pair.authorDate,
        );

        if (index === -1) {
          acc.push(pair);
        }

        return acc;
      },
      [],
    );

    const { encoding, sha } = response.data;
    logger.info(`github:getContent:response ${util.inspect(response)}`);

    let content;
    if (encoding === 'base64') {
      // Decode base64 content for image files
      content = Buffer.from(response.data.content, 'base64');
    } else if (encoding === 'utf-8') {
      // For text files, assume UTF-8 encoding
      content = Buffer.from(response.data.content, 'utf-8');
    } else if (encoding === 'none') {
      // large URL. get direct
      logger.info(
        `github:getContent:download_url ${response.data.download_url}`,
      );
      const downloadResponse = await fetch(response.data.download_url);
      const downloadBuffer = await downloadResponse.arrayBuffer();

      content = Buffer.from(downloadBuffer);
      // logger.info('github:getContent:downloadResponse ', downloadResponse.data.split('\n').slice(0, 10).join('\n'));
    }
    try {
      if (sha) {
        // Store a link from the branchSha to the file
        const ref = { ref: sha };
        await cacheWrite(
          `github:ref:${owner}:${repo}:${branchSha}:${path}`,
          JSON.stringify(ref),
        ); // cache perpetually a reference to the file
        const isBuffer = Buffer.isBuffer(content);
        const stringifiedValue = isBuffer
          ? JSON.stringify({ buffer: Array.from(content || []) })
          : JSON.stringify(content);

        await cacheWrite(
          `github:content:${owner}:${repo}:${sha}:${path}`,
          JSON.stringify({
            content: stringifiedValue,
            encoding,
            contributors,
          }),
        ); // cache perpetually the file contents
        // logger.debug(
        //   `[GitHub][Write][CachedFileAndRef] : ${path} : encoding: ${response.data.encoding}`,
        // );
        logger.info(
          `[GitHub][getGitHubFileContent][CachedFileAndRef][Ref] : github:getContent:${owner}:${repo}:${branchSha}:${path}`,
        );
        // logger.debug(
        //   `[GitHub][Write][CachedFileAndRef][Content] : github:getContent:${owner}:${repo}:${response.data.sha}:${path}`,
        // );
      } else {
        // Store the content in the cache before returning it
        // await cacheWrite(cacheKey, { content, encoding, contributors }); // cache for 24 hours
        // logger.debug(`[GitHub][Write][Cache] : ${path}`);
      }
    } catch (error) {
      logger.error(`[GitHub][Write] Error writing cache: ${error}`);
    }
    return { content, encoding, contributors };
  } catch (error) {
    logger.error(
      `[GitHub][getFileContent] Error retrieving file (${path}) content: ${error}`,
    );
    // throw new Error(`[GitHub][getFileContent] Could not get file`);
    // logger.error('Error retrieving file content:', error, 'path:', path);
    return null;
  }
}
// Function to get a file content
export async function getFileContent(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  sha: string | undefined = undefined,
): Promise<{
  content: Buffer | undefined;
  encoding: string;
  contributors: {
    authorName: string;
    authorDate: string;
  }[];
} | null> {
  // if the SHA is passed, this is a specific revision of a file.
  // if not, pull back the generic revision of the file, stored with the branch sha instead.

  const cachedContent = await getCachedFileContent(
    owner,
    repo,
    branch,
    path,
    sha,
  );
  logger.info(`github:getFileContent:getCachedFileContent ${cachedContent}`);
  if (cachedContent) {
    logger.info(`[GitHub][getGitHubFileContent][Cache/Hit]: ${path}`);
    return cachedContent;
  }
  const file = await getGitHubFileContent(owner, repo, branch, path);

  const unencodedContent = Buffer.from(
    file?.content?.toString() || '',
    'binary',
  );

  logger.info(`[GitHub][getGitHubFileContent][content]: ${util.inspect(file)}`);
  logger.info(
    `[GitHub][getGitHubFileContent][unencodedContent]: ${unencodedContent}`,
  );

  return file;
}

function createFilterRegex(filter: string) {
  const escapedFilter = filter.replace(/\./g, '\\.').replace(/\*/g, '.*');
  return new RegExp(`^.*${escapedFilter}$`, 'i');
}

async function getAllFilesRecursive(
  owner: string,
  repo: string,
  sha: string,
  path: string,
  recursive: boolean = true,
  filter: string | undefined = undefined,
) {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  const response = await gitHubInstance.repos.getContent({
    owner,
    repo,
    path,
    ref: sha,
  });
  const fileObjects = (
    response.data as { type: 'file' | 'dir'; path: string; sha: string }[]
  ).filter((obj) => obj.type === 'file');
  let files = fileObjects.map((obj) => ({ path: obj.path, sha: obj.sha }));
  // logger.info('files: ', files)
  if (recursive) {
    const dirObjects = (
      response.data as {
        type: 'dir' | 'file' | 'submodule' | 'symlink';
        size: number;
        name: string;
        path: string;
        content?: string | undefined;
        sha: string;
        url: string;
        git_url: string | null;
        html_url: string | null;
        download_url: string | null;
      }[]
    ).filter((obj) => obj.type === 'dir');
    const subPromises = dirObjects.map(async (dirObject) => {
      const subPath = path ? `${path}/${dirObject.name}` : dirObject.name;
      return getAllFilesRecursive(owner, repo, sha, subPath, recursive, filter);
    });
    const subFiles = await Promise.all(subPromises);
    files = files.concat(...subFiles);
  }
  if (filter) {
    const regex = createFilterRegex(filter);
    files = files.filter((file) => regex.test(file.path));
  }

  return files;
}

// Function to get all files for a given path
export async function getAllFiles(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  recursive: boolean = true,
  filter: string | undefined = undefined,
) {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  const branchSha = await getBranchSha(owner, repo, branch);
  const files = await getAllFilesRecursive(
    owner,
    repo,
    branchSha,
    path,
    recursive,
    filter,
  );
  return files;
}

// const linkParser = (linkHeader: string): string | null => {
//   const re = /<.*(?=>; rel=\"next\")/g;
//   let arrRes: RegExpExecArray | null = [];
//   while ((arrRes = re.exec(linkHeader)) !== null) {
//     return arrRes[0].split('<').slice(-1)[0];
//   }
//   return null;
// };

// const getData = async (url) => {
//   const resp = await fetch(url, {
//     headers: {
//       // Add any necessary headers here
//     },
//   });
//   if (resp.status !== 200) {
//     throw Error(
//       `Bad status getting branches ${resp.status} ${await resp.text()}`,
//     );
//   }
//   const data = await resp.json();
//   const mapped = data.map((item) => ({
//     name: item.name,
//     sha: item.commit.sha,
//     isProtected: item.protected,
//   }));

//   const next = linkParser(resp.headers.get('Link'));
//   return { mapped, next };
// };

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

export async function getBranches(
  owner: string,
  repo: string,
): Promise<{ name: string; commit: { sha: string }; protected: boolean }[]> {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  try {
    // Generate a unique cache key for this file
    const cacheKey = `github:getBranches:${owner}:${repo}`;

    // Check if the content is in the cache
    const cachedContent = await cacheRead(cacheKey);
    if (cachedContent) {
      logger.info('[Github][getBranches][HIT]:', cacheKey);
      // If the content was found in the cache, return it
      // return cachedContent;
    } else {
      logger.info('[Github][getBranches][Cache][MISS]:', cacheKey);
    }

    // Fetch branches
    const branches = await gitHubInstance.paginate(
      gitHubInstance.repos.listBranches,
      {
        owner,
        repo,
        per_page: 100,
      },
    );

    // Filter branches with protected set to false
    // const unprotectedBranches = branches.filter((branch) => !branch.protected);
    const unprotectedBranches = branches;

    try {
      // Store the content in the cache before returning it
      await cacheWrite(cacheKey, JSON.stringify(unprotectedBranches), 600);
    } catch (error) {
      logger.error(`[GitHub][getBranches] Error writing cache: ${error}`);
    }
    return unprotectedBranches;
  } catch (error) {
    logger.error(`[GitHub][getBranches] Error getting sha: ${error}`);
    // throw new Error(`[GitHub][getBranchSha] Could not get sha for branch`);
  }
  return [];
}

// Function to create a new branch
export async function createBranch(
  owner: string,
  repo: string,
  branch: string,
  sourceBranch: string,
) {
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
    logger.error(`[GitHub][createBranch] Error creating branch: ${error}`);
    throw new Error(`Could not create branch: ${error}`);
  }
}

function isBase64(str: string) {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

// Function to commit a file to a branch
export async function commitFileToBranch(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  content: string,
  message: string,
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
      encoding,
    });

    const tree = await gitHubInstance.rest.git.createTree({
      owner,
      repo,
      base_tree: branchSha,
      tree: [
        {
          path,
          mode: '100644',
          type: 'blob',
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
      logger.error(`[GitHub][getBranchSha] Error writing cache: ${error}`);
    }

    return newCommit.data;
  } catch (error) {
    logger.error(
      `[GitHub][commitFileToBranch] Error committing file: ${error}`,
    );
    throw new Error(`${error}`);
  }
}

export async function commitFileChanges(
  owner: string,
  repo: string,
  branch: string,
  path: string,
  content: string,
  message: string,
) {
  // use in pages
  try {
    const response = await fetch(
      `/api/content/github/${owner}/${repo}?branch=${branch}&path=${path}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, message }),
      },
    );

    if (!response.ok) {
      const data = await response.json();

      logger.info('/lib/github/commitFileChanges:response: ', data);
      if (data.error) {
        throw new Error(`Error committing file: ${data.error}`);
      } else {
        throw new Error(`Error committing file: ${response.status}`);
      }
    }

    const data = await response.json();
    logger.info('Commit successful:', data);
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
    //   logger.error(`[GitHub][getBranchSha] Error writing cache: ${error}`);
    // }
  } catch (e) {
    logger.error(`Error committing file: ${e}`);
    throw new Error(`${e}`);
  }
}

export const createPR = async (
  owner: string,
  repo: string,
  title: string,
  body: string,
  head: string,
  base: string,
) => {
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
    throw new Error(String(error));
  }
};
// export const raisePR = async (owner, repo, title, body, head, base) => {
//   try {
//     const response = await fetch('/api/repo/pr', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ owner, repo, title, body, head, base }),
//     });

//     const data = await response.json();
//     // logger.info('lib/github/raisePR:response: ', data)
//     if (!response.ok) {
//       throw Error(data.error || 'Network response was not ok');
//     }

//     return data;
//   } catch (error) {
//     // logger.error('There has been a problem with your fetch operation:', error);
//     throw Error(error.message);
//   }
// };
