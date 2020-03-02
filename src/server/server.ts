/**
 * server
 */

import Koa, { Context } from 'koa';
import KoaRouter from 'koa-router';
import { GetRoutes } from '../public/koa-common';

import { ServerConfig } from './config';
import { SetupSSR } from './setup-ssr';
import { SetupKoaApp } from './setup-koa';

// 导入 route
import './routers';

const Http = require('http');
const Chalk = require('chalk');

const app = new Koa();
const router = new KoaRouter();

// 注入通用中间件
SetupKoaApp(app, {
  keys: [ServerConfig.secret],
  session: {
    // cookie的名称
    key: ServerConfig.name,
    // 有效时间
    maxAge: 7 * 3600 * 1000,
    // 是否只能http获取
    httpOnly: true
  }
});

// 获取 ssr renderer
const setupSSR = new SetupSSR(app, router, ServerConfig.port);

// 注册 api router
GetRoutes().forEach(router => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});

// 接管全局路由 指定返回 index.html
router.get('*', async (ctx: Context, next) => {
  try {
    if (setupSSR.renderer) {
      console.log('____________________ctx.url：' + ctx.url);
      const context: any = {
        url: ctx.url,
        session: ctx.session
      };
      ctx.set('Content-Type', 'text/html');
      await setupSSR.renderer
        .renderToString(context)
        .then(function(html) {
          ctx.body = html;
        })
        .catch(err => {
          // 判断 err 类型 若是认证失败 则重定向到指定的地址
          if (err && err.redirect) {
            ctx.redirect(err.redirect);
          }
        });
    }
  } catch (err) {
    if (err.code === 404) {
      ctx.status = 404;
      ctx.body = '404 Page Not Found';
    } else {
      ctx.status = 500;
      ctx.body = '500 Internal Server Error';
      console.error(`error during render : ${ctx.url}`);
      console.error(err.stack);
    }
  }
});

// 挂载 router
app.use(router.routes());

// 往 response header 加 Allow 标签，禁止不符合指定 http 方法的请求，即当请求数据的方法与设置的方法不一致，会抛出错误。
app.use(router.allowedMethods());

(async () => {
  await require('kill-port-process')
    .killPortProcess(ServerConfig.port)
    .catch(x => {});
  Http.createServer(app.callback()).listen(ServerConfig.port, () => {
    console.log(Chalk.green(`server started at localhost:${ServerConfig.port}`));
  });
})();
