/**
 * redis-store
 */

const _ = require('lodash');
const shortid = require('shortid');

/**
 * 生成短 id
 * @constructor
 */
export function Genid() {
  return shortid.generate();
}

export interface IRedisConfig {
  port: number;
  host: string;
  family: number;
  password: string;
  db: number;
}

export class RedisStore {
  redis = null;

  constructor(config?: IRedisConfig) {
    const c = _.merge(
      {},
      {
        port: 6379,
        host: 'localhost',
        family: 4,
        password: '123456',
        db: 0
      },
      config
    );
    // this.redis = new Redis(c);
  }

  async get(key) {
    const data = await this.redis.get(`SESSION:${key}`);
    return JSON.parse(data);
  }

  async set(key, sess, maxAge) {
    await this.redis.set(
      `SESSION:${key}`,
      JSON.stringify(sess),
      'EX',
      maxAge / 1000
    );
  }

  async destroy(key) {
    return this.redis.del(`SESSION:${key}`);
  }
}
