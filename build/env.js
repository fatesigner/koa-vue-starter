/**
 * global
 */

const Path = require('path');

module.exports = function() {
  const env = (process.env.NODE_ENV || 'development').trim();
  const isProd = env === 'production';
  const rootPath = Path.resolve(__dirname, '..');
  const buildPath = Path.join(rootPath, 'build');
  const srcPath = Path.join(rootPath, 'src');
  const outputPath = Path.join(rootPath, isProd ? 'static' : 'static');
  const outputPathForRender = Path.join(rootPath, isProd ? 'static' : 'static');
  const outputPathForServer = Path.join(rootPath, isProd ? 'bin' : 'bin');
  const publicPath = isProd ? '/static/' : '/static/';
  const nodeModulesPath = Path.resolve(rootPath, 'node_modules');
  return {
    rootPath,
    buildPath,
    srcPath,
    outputPath,
    outputPathForRender,
    outputPathForServer,
    publicPath,
    nodeModulesPath,
    templateName: 'index.njk'
  };
};
