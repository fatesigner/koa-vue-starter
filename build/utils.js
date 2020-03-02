/**
 * utils
 */

exports.NODE_ENV_ENUM = {
  DEV: 'development',
  PROD: 'production'
};

/**
 * 获取开发模式
 * @returns {string}
 * @constructor
 */
exports.GetNODE_ENV = function() {
  const env = (process.env.NODE_ENV || exports.NODE_ENV_ENUM.DEV).trim();
  for (const v in exports.NODE_ENV_ENUM) {
    if (Object.prototype.hasOwnProperty.call(exports.NODE_ENV_ENUM, v) && env === exports.NODE_ENV_ENUM[v]) {
      return env;
    }
  }
  return exports.NODE_ENV_ENUM.DEV;
};

/**
 * 判断当前是否处于生产模式
 * @param env
 * @returns {boolean}
 * @constructor
 */
exports.IsProd = function(env = null) {
  if (!env) {
    env = exports.GetNODE_ENV();
  }
  return env === exports.NODE_ENV_ENUM.PROD;
};

/**
 * 读取指定路径的文件
 * @param fs
 * @param path
 * @returns string
 */
exports.ReadFile = (fs, path) => {
  try {
    return fs.readFileSync(path, 'utf-8');
  } catch (e) {
    console.log('文件读取失败', e);
  }
};
