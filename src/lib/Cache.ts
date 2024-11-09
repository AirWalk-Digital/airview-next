import type { Octokit } from '@octokit/rest';
import matter from 'gray-matter';

import { getLogger } from '@/lib/Logger';
import type { GitHubFile } from '@/lib/Types';

import { createGitHubInstance, getBranchSha } from './Github';
import { deleteFile, storeFile } from './Storage';

let gitHubInstance: Octokit | undefined;
const logger = getLogger().child({ namespace: 'lib/Cache' });

logger.level = 'debug';

type FileType = 'published' | 'draft' | 'note';

interface GitHubFileContentOptions {
  backend: 'github';
  owner: string;
  repo: string;
  path: string;
  branchShaParam?: string;
  branch?: string;
  type?: FileType;
}

async function fetchCommitsAndContributors(
  owner: string,
  repo: string,
  path: string
): Promise<{ authorName: string; authorDate: string }[]> {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  let commits: any[] = [];
  try {
    const { data } = await gitHubInstance.repos.listCommits({
      owner,
      repo,
      path,
    });
    commits = data;
  } catch (error: any) {
    logger.error({
      function: 'fetchCommitsAndContributors',
      api: 'repos.listCommits',
      msg: 'Error retrieving commits',
      path,
      error: (error?.response?.data?.message ||
        error?.name ||
        error ||
        '') as string,
    });
  }

  const contributors = commits.reduce(
    (acc: { authorName: string; authorDate: string }[], commit) => {
      const authorName = commit.commit.author?.name ?? '';
      const authorDate = new Date(
        commit.commit.author?.date ?? ''
      ).toDateString();

      const pair: { authorName: string; authorDate: string } = {
        authorName,
        authorDate,
      };

      const index = acc.findIndex(
        (item: { authorName: string; authorDate: string }) =>
          item.authorName === pair.authorName &&
          item.authorDate === pair.authorDate
      );

      if (index === -1) {
        acc.push(pair);
      }

      return acc;
    },
    []
  );

  return contributors;
}

export async function getFileContent({
  backend = 'github',
  owner,
  repo,
  path,
  branchShaParam,
  branch,
  type = 'published',
}: GitHubFileContentOptions): Promise<{
  content: Buffer | undefined;
  encoding: string;
  contributors: { authorName: string; authorDate: string }[];
  sha: string;
} | null> {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  // logger.debug({
  //   msg: 'Parameters',
  //   backend,
  //   owner,
  //   repo,
  //   branch,
  //   path,
  //   branchShaParam,
  // });

  if (backend !== 'github') {
    // Only GitHub is supported at the moment
    return null;
  }

  let branchSha = null;
  if (!branchShaParam && branch) {
    branchSha = await getBranchSha(owner, repo, branch);
  } else if (branchShaParam) {
    branchSha = branchShaParam;
  }
  let response;

  // get content from GitHub
  try {
    if (branchSha) {
      response = (await gitHubInstance.repos.getContent({
        owner,
        repo,
        path,
        ref: branchSha,
      })) as {
        data: {
          encoding: string;
          sha: string;
          content?: string;
          download_url?: string;
        };
      };
    } else {
      response = (await gitHubInstance.repos.getContent({
        owner,
        repo,
        path,
      })) as {
        data: {
          encoding: string;
          sha: string;
          content?: string;
          download_url?: string;
        };
      };
    }
  } catch (error: any) {
    logger.error({
      api: 'repos.getContent',
      msg: 'Error retrieving file',
      path,
      full_error: error,
      error: ((error && 'response' in error && error.response?.data?.message) ||
        error?.name ||
        error ||
        '') as string,
    });
  }
  // fetch any related commits (to build the history)
  const contributors = await fetchCommitsAndContributors(owner, repo, path);

  let fileContent: Buffer | undefined;
  try {
    const { encoding, sha } = response?.data ?? {};
    // logger.info(`github:getContent:response ${util.inspect(response)}`);
    if (encoding === 'base64') {
      // Decode base64 content for image files
      fileContent = Buffer.from(response?.data?.content || '', 'base64');
    } else if (encoding === 'utf-8') {
      // For text files, assume UTF-8 encoding
      fileContent = Buffer.from(response?.data?.content || '', 'utf-8');
    } else if (encoding === 'none') {
      // large URL. get direct
      try {
        const downloadResponse = await fetch(
          response?.data?.download_url || ''
        );
        const downloadBuffer = await downloadResponse.arrayBuffer();
        fileContent = Buffer.from(downloadBuffer);
      } catch (error: any) {
        logger.error({
          function: 'getFileContent',
          msg: 'Error downloading file',
          path,
          error: ((error &&
            'response' in error &&
            error.response?.data?.message) ||
            error?.name ||
            error ||
            '') as string,
        });
        // logger.info('github:getContent:downloadResponse ', downloadResponse.data.split('\n').slice(0, 10).join('\n'));
      }
    }
    try {
      if (!fileContent || !sha) {
        throw new Error('File content is undefined');
      }
      const metadata = {
        backend: 'github' as const,
        owner,
        repo,
        path,
        branch,
        encoding,
      };
      if (path.endsWith('.md') || path.endsWith('.mdx')) {
        const { data: frontmatter } = matter(fileContent.toString());

        await storeFile(
          path,
          frontmatter,
          contributors,
          fileContent,
          metadata,
          sha,
          type,
          'github'
        );
      } else {
        await storeFile(
          path,
          {},
          [],
          fileContent,
          metadata,
          sha,
          type,
          'github'
        );
      }
    } catch (e: any) {
      logger.error({
        function: 'getFileContent',
        msg: 'Error writing cache',
        error: (e as Error).message,
      });
    }
    return {
      content: fileContent,
      encoding: encoding || 'none',
      contributors,
      sha: sha || '',
    };
  } catch (error: any) {
    logger.error({
      function: 'getFileContent',
      msg: 'Error retrieving file',
      path,
      error: (error?.response?.data?.message ||
        error?.name ||
        error ||
        '') as string,
    });
    // );
    // throw new Error(`[GitHub][getFileContent] Could not get file`);
    // logger.error('Error retrieving file content:', error, 'path:', path);
    return null;
  }
}

export async function reprocessFile({
  backend = 'github',
  owner,
  repo,
  path,
  branch,
  type = 'published',
}: GitHubFileContentOptions): Promise<{
  succcess: boolean;
} | null> {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  if (backend !== 'github') {
    // Only GitHub is supported at the moment
    return null;
  }
  let response;

  // get content from GitHub
  try {
    response = (await gitHubInstance.repos.getContent({
      owner,
      repo,
      path,
    })) as {
      data: {
        encoding: string;
        sha: string;
        content?: string;
        download_url?: string;
      };
    };
  } catch (error: any) {
    logger.error({
      function: 'reprocessFile',
      api: 'repos.getContent',
      msg: 'Error retrieving file',
      path,
      full_error: error,
      error: ((error && 'response' in error && error.response?.data?.message) ||
        error?.name ||
        error ||
        '') as string,
    });
  }
  // fetch any related commits (to build the history)
  const contributors = await fetchCommitsAndContributors(owner, repo, path);

  let fileContent: Buffer | undefined;
  try {
    const { encoding, sha } = response?.data ?? {};
    // logger.info(`github:getContent:response ${util.inspect(response)}`);
    if (encoding === 'base64') {
      // Decode base64 content for image files
      fileContent = Buffer.from(response?.data?.content || '', 'base64');
    } else if (encoding === 'utf-8') {
      // For text files, assume UTF-8 encoding
      fileContent = Buffer.from(response?.data?.content || '', 'utf-8');
    } else if (encoding === 'none') {
      // large URL. get direct
      try {
        const downloadResponse = await fetch(
          response?.data?.download_url || ''
        );
        const downloadBuffer = await downloadResponse.arrayBuffer();
        fileContent = Buffer.from(downloadBuffer);
      } catch (error: any) {
        logger.error({
          function: 'getFileContent',
          msg: 'Error downloading file',
          path,
          error: ((error &&
            'response' in error &&
            error.response?.data?.message) ||
            error?.name ||
            error ||
            '') as string,
        });
        // logger.info('github:getContent:downloadResponse ', downloadResponse.data.split('\n').slice(0, 10).join('\n'));
      }
    }
    try {
      if (!fileContent || !sha) {
        throw new Error('File content is undefined');
      }
      const metadata = {
        backend: 'github' as const,
        owner,
        repo,
        path,
        branch,
        encoding,
      };
      if (path.endsWith('.md') || path.endsWith('.mdx')) {
        const { data: frontmatter } = matter(fileContent.toString());

        await storeFile(
          path,
          frontmatter,
          contributors,
          fileContent,
          metadata,
          sha,
          type,
          'github'
        );
      } else {
        await storeFile(
          path,
          {},
          [],
          fileContent,
          metadata,
          sha,
          type,
          'github'
        );
      }
    } catch (error) {
      logger.error({
        function: 'getFileContent',
        msg: 'Error writing cache',
        error,
      });
    }
    return {
      succcess: true,
    };
  } catch (error: any) {
    logger.error({
      function: 'getFileContent',
      msg: 'Error retrieving file',
      path,
      error: (error?.response?.data?.message ||
        error?.name ||
        error ||
        '') as string,
    });
    // );
    // throw new Error(`[GitHub][getFileContent] Could not get file`);
    // logger.error('Error retrieving file content:', error, 'path:', path);
    return { succcess: false };
  }
}

export async function removeFile({
  backend = 'github',
  owner,
  repo,
  path,
  type = 'published',
}: GitHubFileContentOptions): Promise<{
  succcess: boolean;
} | null> {
  try {
    await deleteFile({ backend, owner, repo, path, type });
    return { succcess: true };
  } catch (error: any) {
    return { succcess: false };
  }
}

function createFilterRegex(filter: string) {
  const escapedFilter = filter.replace(/\./g, '\\.').replace(/\*/g, '.*');
  return new RegExp(`^.*${escapedFilter}$`, 'i');
}

export async function getAllFiles({
  owner,
  repo,
  path = '',
  filter,
}: {
  owner: string;
  repo: string;
  path?: string;
  filter?: string | undefined;
}): Promise<GitHubFile[]> {
  if (!gitHubInstance) {
    gitHubInstance = await createGitHubInstance();
  }
  logger.level = 'debug';
  logger.debug({ function: 'getAllFiles', msg: 'params', path, repo, owner });
  const response = await gitHubInstance.repos
    .getContent({
      owner,
      repo,
      path,
    })
    .catch((error) => {
      logger.error({
        function: 'getAllFiles',
        msg: 'Error retrieving file or directory',
        path,
        error,
      });
      return null;
    });
  let files: GitHubFile[] = [];
  if (response && response.data) {
    const fileObjects = (
      response.data as {
        type: 'file' | 'dir';
        path: string;
        sha: string;
        download_url: string;
      }[]
    ).filter((obj) => obj.type === 'file');
    files = fileObjects.map((obj) => ({
      path: obj.path,
      sha: obj.sha,
      download_url: obj.download_url,
    }));
  }
  // logger.info('files: ', files)
  if (response && response.data) {
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
    let subFiles: GitHubFile[][] = [];

    if (dirObjects.length > 0) {
      // logger.debug({
      //   function: 'getDirStructure',
      //   msg: 'dirObjects',
      //   dirObjects,
      // });
      const subPromises: Promise<GitHubFile[]>[] = dirObjects.map(
        async (dirObject) => {
          const subPath = path ? `${path}/${dirObject.name}` : dirObject.name;
          return getAllFiles({ owner, repo, path: subPath, filter });
        }
      );
      subFiles = await Promise.all(subPromises);
    }
    if (files && subFiles) {
      files = files.concat(...(subFiles || []));
    }
  }
  if (filter) {
    const regex = createFilterRegex(filter);
    files = files.filter((file) => regex.test(file.path));
  }

  return files;
}
