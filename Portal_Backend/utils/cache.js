const redis = require('redis');

let client = null;
let redisAvailable = false;

async function initRedis() {
  try {
    client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
      },
      password: process.env.REDIS_PASSWORD || undefined
    });

    client.on('error', (err) => {
      console.warn('Redis error:', err.message);
      redisAvailable = false;
    });

    client.on('connect', () => {
      console.log('Redis connected');
      redisAvailable = true;
    });

    await client.connect();
    redisAvailable = true;
  } catch (err) {
    console.warn('Redis not available, using in-memory cache:', err.message);
    redisAvailable = false;
  }
}

const memoryCache = new Map();

async function getCache(key) {
  if (redisAvailable && client) {
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      console.warn('Redis get error:', err.message);
    }
  }
  
  const cached = memoryCache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.value;
  }
  memoryCache.delete(key);
  return null;
}

async function setCache(key, value, ttlSeconds = 300) {
  try {
    if (redisAvailable && client) {
      await client.setEx(key, ttlSeconds, JSON.stringify(value));
    } else {
      memoryCache.set(key, {
        value,
        expiry: Date.now() + (ttlSeconds * 1000)
      });
    }
  } catch (err) {
    console.warn('Cache set error:', err.message);
  }
}

async function deleteCache(key) {
  try {
    if (redisAvailable && client) {
      await client.del(key);
    } else {
      memoryCache.delete(key);
    }
  } catch (err) {
    console.warn('Cache delete error:', err.message);
  }
}

async function deletePatternCache(pattern) {
  try {
    if (redisAvailable && client) {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } else {
      for (const key of memoryCache.keys()) {
        if (key.match(pattern.replace('*', '.*'))) {
          memoryCache.delete(key);
        }
      }
    }
  } catch (err) {
    console.warn('Cache pattern delete error:', err.message);
  }
}

async function clearAllCache() {
  try {
    if (redisAvailable && client) {
      await client.flushDb();
    } else {
      memoryCache.clear();
    }
  } catch (err) {
    console.warn('Cache clear error:', err.message);
  }
}

module.exports = {
  initRedis,
  getCache,
  setCache,
  deleteCache,
  deletePatternCache,
  clearAllCache
};
