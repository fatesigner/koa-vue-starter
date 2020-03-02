/**
 * webpack.server.config
 */

const Path = require('path');
const { Webpack, CreateWebpackConfig } = require('handypack');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const { GetNODE_ENV } = require('../utils');

module.exports = function() {
  const ENV = require('../env')();
  const NODE_ENV = GetNODE_ENV();
  return CreateWebpackConfig({
    mode: NODE_ENV,
    context: ENV.srcPath,
    target: 'node',
    entry: Path.join(ENV.srcPath, 'entry-server.ts'),
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    output: {
      filename: 'server-bundle.js',
      path: ENV.outputPathForRender,
      publicPath: ENV.publicPath,
      libraryTarget: 'commonjs2'
    },
    optimization: {
      splitChunks: false
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      }
    },
    plugins: [
      new VueSSRServerPlugin(),
      new Webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
      }),
      new Webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.BROWSER': JSON.stringify(false),
        'process.env.VUE_ENV': '"server"'
      }),
      new Webpack.NormalModuleReplacementPlugin(/axios\\lib\\adapters\\xhr.js$/, function(result) {
        result.resource = result.resource.replace('xhr', 'http');
      })
    ],
    _: {
      ssr: true,
      packages: {
        vue: Path.resolve(ENV.nodeModulesPath, 'vue'),
        vuex: Path.resolve(ENV.nodeModulesPath, 'vuex')
      }
    }
  });
};
