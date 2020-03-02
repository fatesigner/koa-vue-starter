/**
 *
 */

const LRU = require('lru-cache');

let CacheConfig;
if ((process as any).__CACHE__) {
  CacheConfig = (process as any).__CACHE__;
} else {
  CacheConfig = (process as any).__CACHE__ = {
    // 配置缓存
    cached: new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    cachedItem: {}
  };
}

export { CacheConfig };
