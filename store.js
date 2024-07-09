const { RedisPersistence } = require('y-redis');

// const Y = require('yjs');

function getRedisConfiguration() {
  return {
    host: process.env.REDIS_HOST || '172.17.0.1',
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
  };
}

const config = {
  redisOptions: {
    host: getRedisConfiguration().host,
    lazyConnect: true,
    showFriendlyErrorStack: true,
    enableAutoPipelining: true,
    maxRetriesPerRequest: 0,
    retryStrategy: (times) => {
      if (times > 3) {
        throw new Error(`[Redis] Could not connect after ${times} attempts`);
      }
      return Math.min(times * 200, 1000);
    },
  },
};

const persistence = new RedisPersistence({ redisOpts: config.redisOptions });

persistence.writeState = async (name) => {
  persistence.docs.delete(name);
};

module.exports.persistence = persistence;
