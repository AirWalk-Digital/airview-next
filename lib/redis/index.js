const Redis = require('ioredis');

let redisInstance;

// // storing data
// await redis.set(key, data);

// // getting data (using the same key as above)
// const value = await redis.get(key);

// // we can also increment a value by <N>
// await redis.incrby(key, 1);

// await redis.set("foo", "bar");
//   await redis.expire("foo", 10); // 10 seconds
//   // console.log(await redis.ttl("foo")); // a number smaller or equal to 10

//   await redis.set("foo", "bar", "EX", 20);
//   // console.log(await redis.ttl("foo")); // a number smaller or equal to 20

//   // expireat accepts unix time in seconds.
//   await redis.expireat("foo", Math.round(Date.now() / 1000) + 30);
//   // console.log(await redis.ttl("foo")); // a number smaller or equal to 30

//   // "XX" and other options are available since Redis 7.0.
//   await redis.expireat("foo", Math.round(Date.now() / 1000) + 40, "XX");
//   // console.log(await redis.ttl("foo")); // a number smaller or equal to 40

//   // expiretime is available since Redis 7.0.
//   // console.log(new Date((await redis.expiretime("foo")) * 1000));

//   await redis.pexpire("foo", 10 * 1000); // unit is millisecond for pexpire.
//   // console.log(await redis.ttl("foo")); // a number smaller or equal to 10

//   await redis.persist("foo"); // Remove the existing timeout on key "foo"
//   // console.log(await redis.ttl("foo")); // -1

function getRedisConfiguration() {
    return {
        host: process.env.REDIS_HOST || '172.17.0.1',
        password: process.env.REDIS_PASSWORD,
        port: process.env.REDIS_PORT,
    }
}

export async function createRedisInstance(config = getRedisConfiguration()) {
    try {
        const options = {
            enableReadyCheck: true,
            scaleReads: "all",
            redisOptions: {
                host: config.host,
                lazyConnect: true,
                showFriendlyErrorStack: true,
                enableAutoPipelining: true,
                maxRetriesPerRequest: 0,
                retryStrategy: times => {
                    if (times > 3) {
                        throw new Error(`[Redis] Could not connect after ${times} attempts`);
                    }

                    return Math.min(times * 200, 1000);
                }
            },
        }

        if (config.port) {
            options.redisOptions.port = config.port;
        }

        if (config.password) {
            options.redisOptions.password = config.password;
        }

        let redis;
        
        if (process.env.REDIS_CLUSTER_MODE) {
            redis = new Redis.Cluster([
                {
                    host: config.host,
                    port: config.port
                }],
                options
            );
        } else {
            // For local development or non-clustered environment
            redis = new Redis(options.redisOptions);
        }

        // Wrap the Redis instance creation in a promise to handle any connection errors.
        return new Promise((resolve, reject) => {
            redis.on('error', error => {
                // console.warn('[Redis] Error connecting', error);
                // If an error occurs during the Redis connection, we'll reject the promise.
                reject(error);
            });

            // Now we'll try to connect the Redis instance.
            redis.connect(err => {
                if (err) {
                    // console.warn('[Redis] Error connecting', err);
                    // If an error occurs during the Redis connection, we'll reject the promise.
                    reject(err);
                } else {
                    // If the connection is successful, resolve the promise with the Redis instance.
                    resolve(redis);
                }
            });
        });
    } catch (e) {
        // throw new Error(`[Redis] Could not create a Redis instance`);
    }
}


// Function to read data from the cache
export async function cacheRead(key) {
    try {
        if (!redisInstance) {
            redisInstance = await createRedisInstance();
        }
        const value = await redisInstance.get(key);
        if (!value) return null;
        const parsedValue = JSON.parse(value);
        return parsedValue.buffer ? Buffer.from(parsedValue.buffer) : parsedValue;
    } catch (error) {
        // Handle the error here if Redis is unavailable or there was a connection error.
        // For example, you may use a fallback cache mechanism or default values.
        console.error('Error during Redis setup:', error);
        return null;
    }
}


// Function to write data to the cache
export async function cacheWrite(key, value, ttl = null) {
    try {
        if (!redisInstance) {
            redisInstance = await createRedisInstance();
        }
        const isBuffer = Buffer.isBuffer(value);
        const stringifiedValue = isBuffer ? JSON.stringify({ buffer: [...value] }) : JSON.stringify(value);

        if (ttl) {
            try {
                await redisInstance.set(key, stringifiedValue, "EX", ttl);
                return true; // or return 'Data set successfully';
            } catch (error) {
                console.error(`Error setting data: ${error}`);
                throw error;
            }
        } else {
            try {
                await redisInstance.set(key, stringifiedValue);
                return true; // or return 'Data set successfully';
            } catch (error) {
                console.error(`Error setting data: ${error}`);
                throw error;
            }
        }
    } catch (error) {
        // Handle the error here if Redis is unavailable or there was a connection error.
        // For example, you may use a fallback cache mechanism or default values.
        console.error('Error during Redis setup:', error);
        return null;
    }
}

// Function to read data from the cache
export async function cacheSearch(key) {
    try {

        if (!redisInstance) {
            redisInstance = await createRedisInstance();
        }
        const value = await redisInstance.keys(key, (err, result) => {
            if (err) {
                console.error('Error fetching keys:', err);
            } else {
                return result;
            }
        });

        if (!value) return null;
        return value;
    } catch (error) {
        // Handle the error here if Redis is unavailable or there was a connection error.
        // For example, you may use a fallback cache mechanism or default values.
        console.error('Error during Redis setup:', error);
        return [];
    }
}

export async function hset(key, obj, ttl = null) {

    try {
        if (!redisInstance) {
            redisInstance = await createRedisInstance();
        }
        if (ttl) {
            try {
                await redisInstance.hset(key, obj, "EX", ttl);
                return true; // or return 'Data set successfully';
            } catch (error) {
                console.error(`Error setting data: ${error}`);
                throw error;
            }
        } else {
            try {
                await redisInstance.hset(key, obj);
                return true; // or return 'Data set successfully';
            } catch (error) {
                console.error(`Error setting data: ${error}`);
                throw error;
            }
        }
    } catch (error) {
        // Handle the error here if Redis is unavailable or there was a connection error.
        // For example, you may use a fallback cache mechanism or default values.
        console.error('Error during Redis setup:', error);
        return false;
    }

}