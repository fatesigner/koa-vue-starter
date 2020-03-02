/**
 * config
 */

const Pkg = require('../../package.json');

export const ServerConfig = {
  name: Pkg.name,
  port: process.env.PORT || 3001,
  // 密钥
  secret: 'fqjwjqpweo1k2o3k1po2k4pok'
};
