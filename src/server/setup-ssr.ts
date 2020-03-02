/**
 * setup-dev
 */

import Koa from 'koa';
import Router from 'koa-router';
import KoaSend from 'koa-send';
import { BehaviorSubject } from 'rxjs';

const Globby = require('globby');
const Open = require('open');
const Fs = require('fs');
const Path = require('path');
const MFS = require('memory-fs');
const { Webpack } = require('handypack');
const WebpackDevMiddleware = require('koa-webpack-dev-middleware');
const WebpackHotMiddleware = require('koa-webpack-hot-middleware');
const { createBundleRenderer } = require('vue-server-renderer');

const Utils = require('../../build/utils');

export class SetupSSR {
  private firstStartup = true;

  private $subject: BehaviorSubject<any>;

  get renderer() {
    return this.$subject.value;
  }

  constructor(app: Koa, router: Router, port: string | number) {
    this.$subject = new BehaviorSubject(null);
    const ENV = require('../../build/env')();
    console.log('env ' + process.env.NODE_ENV);
    if (process.env.NODE_HOTRELOAD) {
      const webpackConfigClient = require(Path.join(ENV.buildPath, 'webpack/webpack.client.config'))();
      const webpackConfigServer = require(Path.join(ENV.buildPath, 'webpack/webpack.server.config'))();
      this.setupDevServer(
        app,
        webpackConfigClient,
        webpackConfigServer,
        ({ clientManifest, serverBundle, template }) => {
          // console.log('_________Rebuild_________');
          const renderer = createBundleRenderer(serverBundle, {
            runInNewContext: false,
            clientManifest: clientManifest,
            template: template
          });
          // 等待 webpack 首次编译成功后，自动打开浏览器
          if (this.firstStartup) {
            // Open(`http://localhost:${port}`);
            this.firstStartup = false;
          }
          this.$subject.next(renderer);
        }
      );
    } else {
      // 获取客户端、服务器端打包生成的 manifest json
      console.log('获取客户端、服务器端打包生成的 manifest json');
      const clientManifest = require(Path.join(ENV.outputPath, 'vue-ssr-client-manifest.json'));
      const serverBundle = require(Path.join(ENV.outputPathForRender, 'vue-ssr-server-bundle.json'));
      // 构造 renderer
      const renderer = createBundleRenderer(serverBundle, {
        runInNewContext: false,
        template: Utils.ReadFile(Fs, Path.resolve(ENV.outputPath, ENV.templateName)),
        clientManifest
      });
      // 设置静态资源访问
      router.get(`${ENV.publicPath}*`, async function(ctx) {
        const path = ctx.path.replace(ENV.publicPath, '');
        await KoaSend(ctx, path, {
          root: ENV.outputPath
        });
      });
      console.log(renderer);
      this.$subject.next(renderer);
    }
  }

  // 注入与 koa 有关的 webpack 中间件
  setupDevServer(app, webpackClientConfig, webpackServerConfig, cb) {
    const ENV = require('../../build/env')();
    let clientManifest;
    let serverBundle;
    let template;
    const update = () => {
      if (clientManifest && serverBundle) {
        cb({
          clientManifest,
          serverBundle,
          template
        });
      }
    };

    // 监听 route 改变、生成import
    this.generatePageRouterImport();

    // 修改 webpack 入口以配合热替换模块使用
    webpackClientConfig.entry = ['webpack-hot-middleware/client', webpackClientConfig.entry];

    webpackClientConfig.plugins.push(new Webpack.HotModuleReplacementPlugin());

    const webpackCompiler = Webpack(webpackClientConfig);

    // 插入中间件 WebpackDevMiddleware
    const devMiddleware = WebpackDevMiddleware(webpackCompiler, {
      publicPath: webpackClientConfig.output.publicPath,
      noInfo: true
    });

    webpackCompiler.hooks.afterEmit.tap('plugin:webpack-hot-middleware', () => {
      clientManifest = JSON.parse(
        Utils.ReadFile(
          devMiddleware.fileSystem,
          Path.join(webpackClientConfig.output.path, 'vue-ssr-client-manifest.json')
        )
      );
      template = Utils.ReadFile(devMiddleware.fileSystem, Path.join(webpackClientConfig.output.path, ENV.templateName));
      update();
    });

    app.use(devMiddleware);

    // 插入中间件 WebpackHotMiddleware 模块热替换
    app.use(WebpackHotMiddleware(webpackCompiler));

    // 编译 server webpack
    const serverCompiler = Webpack(webpackServerConfig);
    serverCompiler.outputFileSystem = new MFS();
    serverCompiler.watch({}, (err, stats) => {
      if (err) {
        throw err;
      }
      if (stats) {
        stats = stats.toJson();
        if (stats.errors.length) {
          return;
        }
      }
      serverBundle = JSON.parse(
        Utils.ReadFile(
          serverCompiler.outputFileSystem,
          Path.join(webpackServerConfig.output.path, 'vue-ssr-server-bundle.json')
        )
      );
      update();
    });
  }

  // 生成页面路由导入文件
  generatePageRouterImport() {
    const ENV = require('../../build/env')();
    const array = [];
    const str =
      Globby.sync(Path.join(ENV.srcPath, 'client/pages/**/router.ts').replace(/\\/g, '/'))
        .map(function(file) {
          const dirname = Path.basename(Path.dirname(file));
          array.push(dirname);
          return `import ${dirname} from "../${Path.relative(ENV.srcPath, Path.dirname(file))
            .split(Path.sep)
            .join('/')}/router";`;
        })
        .join('\n') + `\nexport default [${array.join(', ')}];`;

    Fs.writeFileSync(Path.join(ENV.srcPath, 'client/routers.ts'), str, {
      flag: 'w'
    });
  }
}
