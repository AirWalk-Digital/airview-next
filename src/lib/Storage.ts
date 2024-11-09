import Redis, { type RedisOptions } from 'ioredis';

import { siteConfig } from '@/config';
import { getLogger } from '@/lib/Logger';
import type {
  ContentItem,
  File,
  FileType,
  FrontMatter,
  Metadata,
} from '@/lib/Types';

const logger = getLogger().child({ namespace: '/lib/Storage' });

logger.level = 'debug';

type RedisInstance = Redis; // Alias for Redis instance type

function getRedisConfiguration() {
  return {
    host: process.env.REDIS_HOST || '172.17.0.1',
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT || 6379,
  };
}
// Function to create a Redis instance
// Function to create a Redis instance
export async function createRedisInstance(
  config = getRedisConfiguration()
): Promise<RedisInstance> {
  try {
    const options: RedisOptions = {
      enableReadyCheck: true,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: null, // Custom retry strategy will handle retries
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 200, 2000); // Exponential backoff, max 2 seconds

        if (times > 10) {
          // After 10 attempts, stop retrying
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }

        logger.info(
          `[Redis] Retry attempt ${times}, retrying in ${delay}ms...`
        );
        return delay;
      },
    };

    if (config.port) {
      options.port = Number(config.port);
    }
    if (config.host) {
      options.host = config.host;
    }

    if (config.password) {
      options.password = config.password;
    }

    const redis = new Redis(options);

    redis.on('error', (err) => {
      logger.error(`[Redis] Error: ${err.message}`);
    });

    await redis.connect();

    return redis;
  } catch (e: any) {
    logger.error(`[Redis] Could not create a Redis instance: ${e.message}`);
    throw e;
  }
}

// Create a Redis client instance (single instance for the app)
let redisClient: RedisInstance;

(async () => {
  redisClient = await createRedisInstance();
})();

// Redis Promisified Methods (using the shared Redis instance)
export const hsetAsync = async (key: string, field: string, value: string) =>
  redisClient.hset(key, field, value);
export const hgetallAsync = async (key: string) => redisClient.hgetall(key);
export const hgetAsync = async (key: string, field: string) =>
  redisClient.hget(key, field);

export const saddAsync = async (key: string, value: string) =>
  redisClient.sadd(key, value);
export const smembersAsync = async (key: string) => redisClient.smembers(key);
export const sremAsync = async (key: string, value: string) =>
  redisClient.srem(key, value);
export const delAsync = async (key: string) => redisClient.del(key);

// Method to unlink a file from all related files
export async function unlinkFile(fileName: string): Promise<void> {
  const relatedfileNames: string[] = await smembersAsync(
    `storage:${fileName}:related`
  );

  for (const relatedId of relatedfileNames) {
    if (relatedId.endsWith('/')) {
      sremAsync(`storage:${relatedId}/index.md:related`, fileName);
      sremAsync(`storage:${relatedId}/index.mdx:related`, fileName);
    } else {
      sremAsync(`storage:${relatedId}:related`, fileName);
    }
  }

  await delAsync(`storage:${fileName}:related`);
}
// Method to delete a file
async function removeFile({ name, type }: { name: string; type: FileType }) {
  if (type !== 'published') {
    // if it's not a published file, check there isn't a published file before removing.
    const existingType = await hgetAsync(`storage:${name}`, 'type');
    if (existingType === 'published') {
      return;
    }
  }

  await unlinkFile(name);
  await delAsync(`storage:${name}`);
}

// Method to establish a relationship between two files
export async function relateFiles(
  fileName1: string,
  fileName2: string // primary (the linked file). usually an index file
): Promise<void> {
  await saddAsync(`storage:${fileName1}:related`, fileName2);
  await saddAsync(`storage:${fileName2}:related`, fileName1);
}

// Function to write data to the cache
export async function cacheWrite(
  key: string,
  value: string,
  ttl: number | undefined = undefined
) {
  try {
    if (!redisClient) {
      redisClient = await createRedisInstance();
    }
    const isBuffer = Buffer.isBuffer(value);
    const stringifiedValue = isBuffer
      ? JSON.stringify({ buffer: Array.from(value) })
      : JSON.stringify(value);

    if (ttl) {
      try {
        await redisClient.set(key, stringifiedValue, 'EX', ttl);
        return true; // or return 'Data set successfully';
      } catch (error) {
        logger.error(`Error setting data: ${error}`);
        throw error;
      }
    } else {
      try {
        await redisClient.set(key, stringifiedValue);
        return true; // or return 'Data set successfully';
      } catch (error) {
        logger.error(`Error setting data: ${error}`);
        throw error;
      }
    }
  } catch (error) {
    // Handle the error here if Redis is unavailable or there was a connection error.
    // For example, you may use a fallback cache mechanism or default values.
    logger.error('Error during Redis setup:', error);
    throw error;
  }
}

// Function to delete data from the cache
export async function cacheDelete(key: string) {
  try {
    if (!redisClient) {
      redisClient = await createRedisInstance();
    }
    const result = await redisClient.del(key);
    return result === 1; // Returns true if the key was deleted
  } catch (error) {
    // Handle the error here if Redis is unavailable or there was a connection error.
    logger.error('Error during Redis deletion:', error);
    throw error;
  }
}
// Method to get a file's details
export async function getFileMeta(fileName: string): Promise<File | null> {
  // `${backend}:content:${metadata.owner}:${metadata.repo}:${hash}:${name}`,
  if (!redisClient) {
    redisClient = await createRedisInstance();
  }
  const fileData = await hgetallAsync(`storage:${fileName}`);

  if (!fileData || Object.keys(fileData).length === 0) {
    return null;
  }
  return {
    name: fileName,
    frontmatter: JSON.parse(fileData.frontmatter || '') as FrontMatter,
    hash: fileData.hash,
    type: fileData.type as FileType,
  };
}
// Method to get related files of a file
export async function getRelatedFiles(fileName: string): Promise<File[]> {
  if (!redisClient) {
    redisClient = await createRedisInstance();
  }
  let primaryFileName = fileName;
  const relatedfileNames: string[] = await smembersAsync(
    `storage:${fileName}:related`
  );
  const relatedFiles = await Promise.all(
    relatedfileNames.map((id) => getFileMeta(id))
  );
  // if the filename is just a directory (it was an index file), append the index files .md and .mdx to cover both cases
  if (fileName.endsWith('index.md') || fileName.endsWith('index.mdx')) {
    // strip the filename off
    primaryFileName = fileName.replace(/\/?_?index\.mdx?$/, '');
    const relatedIndexFileNames: string[] = await smembersAsync(
      `storage:${primaryFileName}:related`
    );
    const relatedIndexFiles = await Promise.all(
      relatedIndexFileNames.map((id) => getFileMeta(id))
    );
    // logger.info({
    //   function: 'getRelatedFiles',
    //   name: 'relatedIndexFiles',
    //   relatedIndexFiles,
    //   primaryFileName,
    // });
    // merge the two arrays
    relatedFiles.push(...relatedIndexFiles);
  }
  return relatedFiles.filter((file) => file !== null) as File[];
}

function processFrontmatter({ frontmatter }: { frontmatter: FrontMatter }) {
  const relatedFiles = [];
  const siteContent = siteConfig.content;
  for (const key of Object.keys(siteContent)) {
    const contentDetails: ContentItem = siteContent[
      key as keyof typeof siteContent
    ] as ContentItem;
    if (
      frontmatter[contentDetails.reference] &&
      typeof frontmatter[contentDetails.reference] === 'string'
    ) {
      const parentDirectory = frontmatter[contentDetails.reference] as string;
      relatedFiles.push(parentDirectory);
    }
  }
  return relatedFiles;
}

type Contributors = {
  authorName: string;
  authorDate: string;
}[];

// Method to store a new file
export async function storeFile(
  name: string,
  frontmatter: FrontMatter,
  contributors: Contributors,
  content: Buffer,
  metadata: Metadata,
  hash: string,
  type: FileType,
  backend?: 'github'
) {
  if (!redisClient) {
    redisClient = await createRedisInstance();
  }
  // compare the hash with the existing hash
  const existingHash = await hgetAsync(`storage:${name}`, 'hash');
  const existingType = await hgetAsync(`storage:${name}`, 'type');

  if (existingHash !== hash && existingType !== 'published') {
    // the file is different, we need to re-process it.
    // remove the existing relationships
    await unlinkFile(name);
    // process the frontmatter to find related files
    const relatedFiles = processFrontmatter({ frontmatter });
    // establish the relationships
    for (const relatedFile of relatedFiles) {
      relateFiles(name, relatedFile);
    }
    // store the file
    await hsetAsync(
      `storage:${name}`,
      'frontmatter',
      JSON.stringify(frontmatter)
    );
    await hsetAsync(`storage:${name}`, 'hash', hash);
    await hsetAsync(`storage:${name}`, 'type', type);
    await hsetAsync(`storage:${name}`, 'name', name);
    const collection = name.split('/')[0];
    await hsetAsync(`storage:${name}`, 'collection', collection || '');
    await saddAsync(`collection:${collection}`, `storage:${name}`);
    const stringifiedValue = JSON.stringify({ buffer: Array.from(content) });
    await cacheWrite(
      `${backend}:content:${metadata.owner}:${metadata.repo}:${hash}:${name}`,
      JSON.stringify({
        content: stringifiedValue,
        encoding: metadata.encoding,
        contributors,
        sha: hash,
      })
    );
  }
}

export async function getCollectionFiles(collection: string): Promise<File[]> {
  // Get all keys for the specified collection
  if (!redisClient) {
    redisClient = await createRedisInstance();
  }
  let keys: string[];
  try {
    keys = await smembersAsync(`collection:${collection}`);
  } catch (e: any) {
    logger.error({
      function: 'getCollectionFiles',
      error: (e as Error).message,
      collection,
      redisClient,
    });
    return [];
  }
  logger.debug({ function: 'getCollectionFiles', keys, collection });
  if (!Array.isArray(keys) || keys.length === 0) return [];

  // Define the regular expression to match the desired file names
  const regex = /\/?_?index\.mdx?$/;

  // Fetch all elements by keys concurrently and map them to the File type
  const elements = await Promise.all(
    keys.map(async (key) => {
      const element = await hgetallAsync(key);

      // Filter elements based on the regular expression
      if (element.name && regex.test(element.name)) {
        return {
          name: element.name,
          frontmatter: element.frontmatter
            ? (JSON.parse(element.frontmatter) as FrontMatter)
            : undefined,
          hash: element.hash,
          type: element.type as FileType,
          metadata: element.metadata
            ? (JSON.parse(element.metadata) as Metadata)
            : undefined,
        } as File;
      }
      return null;
    })
  );

  // Filter out null values from the elements array
  return elements.filter((element) => element !== null) as File[];
}

// Method to store a new file
export async function deleteFile({
  backend = 'github',
  owner,
  repo,
  path,
  type = 'published',
}: {
  backend?: string;
  owner: string;
  repo: string;
  path: string;
  type?: FileType;
}) {
  if (!redisClient) {
    redisClient = await createRedisInstance();
  }
  const name = `${owner}/${repo}/${path}`;
  await removeFile({ name, type });
  await cacheDelete(`${backend}:content:${owner}:${repo}:${name}:*`);
}
