import Redis, { type RedisOptions } from 'ioredis';

import { siteConfig } from '@/config';
import { getLogger } from '@/lib/Logger';
import type { ContentItem, FrontMatter } from '@/lib/Types';

const logger = getLogger().child({ namespace: '/lib/Storage' });

logger.level = 'error';

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
// Type Definitions
type File = {
  name: string;
  frontmatter: FrontMatter | undefined;
  hash: string | undefined;
  type: FileType;
};
type FileType = 'published' | 'draft' | 'note';

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
    `file:${fileName}:related`
  );

  for (const relatedId of relatedfileNames) {
    sremAsync(`storage:${relatedId}:related`, fileName);
  }

  await delAsync(`storage:${fileName}:related`);
}
// Method to delete a file
export async function removeFile(name: string, type: FileType) {
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
  fileName2: string
): Promise<void> {
  await saddAsync(`storage:${fileName1}:related`, fileName2);
  await saddAsync(`storage:${fileName2}:related`, fileName1);
}

// Method to get a file's details
export async function getFile(fileName: string): Promise<File | null> {
  const fileData = await hgetallAsync(`file:${fileName}`);

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
  const relatedfileNames: string[] = await smembersAsync(
    `storage:${fileName}:related`
  );
  const relatedFiles = await Promise.all(
    relatedfileNames.map((id) => getFile(id))
  );
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

// Method to store a new file
export async function storeFile(
  name: string,
  frontmatter: FrontMatter,
  hash: string,
  type: FileType
) {
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
    await hsetAsync(`storage:${name}`, 'frontmatter', frontmatter.toString());
    await hsetAsync(`storage:${name}`, 'hash', hash);
    await hsetAsync(`storage:${name}`, 'type', type);
  }
}
