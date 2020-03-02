/**
 * webpack.client.config
 */

const Path = require('path');
const { Webpack, CreateWebpackConfig } = require('handypack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const { GetNODE_ENV, IsProd } = require('../utils');

module.exports = function() {
  const ENV = require('../env')();
  const NODE_ENV = GetNODE_ENV();
  const isProd = IsProd();
  const Exec = require('child_process').exec;
  return CreateWebpackConfig({
    mode: NODE_ENV,
    context: ENV.srcPath,
    devtool: isProd ? null : 'cheap-module-eval-source-map',
    entry: Path.join(ENV.srcPath, 'entry-client.ts'),
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    output: {
      path: ENV.outputPath,
      publicPath: ENV.publicPath
    },
    optimization: {
      runtimeChunk: {
        name: 'runtime'
      }
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      }
    },
    plugins: [
      new VueSSRClientPlugin(),
      new FaviconsWebpackPlugin({
        logo: Path.resolve(ENV.srcPath, 'assets/img/favicon.ico'),
        prefix: 'icons/[hash]/',
        emitStats: false,
        statsFilename: 'icons/[hash]/stats.json',
        persistentCache: false,
        inject: true,
        title: 'Company Editor',
        background: '#00b8ff',
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          opengraph: false,
          twitter: false,
          yandex: false,
          windows: true
        }
      }),
      new Webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
      }),
      new Webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.BROWSER': JSON.stringify(true),
        'process.env.VUE_ENV': '"client"'
      })
    ],
    _: {
      packages: {
        vue: Path.resolve(ENV.nodeModulesPath, 'vue'),
        vuex: Path.resolve(ENV.nodeModulesPath, 'vuex')
      },
      plugin: {
        HtmlWebpackPlugin: {
          template: Path.resolve(ENV.srcPath, 'server', ENV.templateName),
          filename: ENV.templateName,
          inject: 'body',
          minify: {
            removeComments: false,
            collapseWhitespace: false
          }
        },
        ManifestPlugin: {
          fileName: 'assets.json'
        },
        SplitChunksPlugin: {
          fileName: 'split-chunks.json'
        }
      },
      onAfterEmit: () => {
        console.log('process.env.NODE_WATCH ' + process.env.NODE_WATCH);
        if (process.env.NODE_WATCH === 'true') {
          Exec('npm run server:start', (err, stdout, stderr) => {
            if (stdout) {
              process.stdout.write(stdout);
            }
            if (stderr) {
              process.stderr.write(stderr);
            }
          });
        }
      }
    }
  });
};
