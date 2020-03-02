/**
 * setup-koa
 * 安装 koa 通用中间件
 */

import Koa from 'koa';
import KoaBody from 'koa-body';
import KoaCompress from 'koa-compress';
// import KoaConvert from 'koa-convert';
// import KoaRedis from 'koa-redis';
import KoaHelmet from 'koa-helmet';
import KoaLogger from 'koa-logger';
import KoaSession from 'koa-session';
import KoaStatic from 'koa-static';
import KoaNunjucks from 'koa-nunjucks-2';
import KoaJwt from 'koa-jwt';
import Moment from 'moment';
import * as _ from 'lodash';
import { Genid } from './redis-store';
import { ISessionInfo } from '../public/models/session';

export function SetupKoaApp(app: Koa, config: IKoaSetupConfig) {
  app.keys = config.keys;

  // 开启 gzip 压缩
  app.use(KoaCompress({ threshold: 2048 }));

  // 使用 koa-logger 作为日志输出工具
  app.use(
    KoaLogger(str => {
      // 使用日志中间件
      //console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str);
    })
  );

  // 设置响应时间
  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  });

  // 模板
  app.use(
    KoaNunjucks({
      ext: 'njk',
      path: __dirname,
      nunjucksConfig: {
        trimBlocks: true
      }
    })
  );

  // 静态资源
  if (config.static) {
    app.use(KoaStatic(config.static));
  }

  // 添加安全标签, 有效的防御 XSS 等攻击
  app.use(KoaHelmet());

  // session
  if (config.session) {
    app.use(
      KoaSession(
        _.merge(
          true,
          {},
          {
            // cookie的名称
            key: 'session',
            // 有效时间
            maxAge: 3600 * 1000,
            // 是否自动提交头信息
            autoCommit: true,
            // 是否允许重写
            overwrite: true,
            // 是否只能http获取
            httpOnly: true,
            // 是否签名加密
            signe: true,
            // 调用外部存储
            // store: new KoaRedis(),
            // key 的生成函数
            genid: Genid
          },
          config.session
        ),
        app
      )
    );
  }

  // 对于比较老的使用Generate函数的koa中间件(< koa2)
  // 官方提供了 koa-convert 将他们转为基于Promise的中间件供Koa2使用，
  // 同样也可以将新的基于Promise的中间件转为旧式的Generate中间件。
  // app.use(KoaConvert());
  if (config.body) {
    app.use(KoaBody(_.merge(true, {}, config.body)));
  }

  // 错误处理
  app.on('error', function(err, ctx) {
    console.log(err);
    if (config.onError) {
      config.onError(err, ctx);
    }
  });

  // 使用 JWT 进行鉴权
  if (config.jwt) {
    app.use(
      KoaJwt(
        _.merge(
          true,
          {},
          {
            secret: 'my_token'
          },
          config.jwt.options
        )
      ).unless(
        _.merge(
          true,
          {},
          {
            path: [/\/user\/login/]
          },
          config.jwt.unless
        )
      )
    );
    // 当token验证异常时候的处理，如token过期、token错误
    app.use((ctx, next) => {
      return next().catch(err => {
        if (err.status === 401) {
          ctx.status = 401;
          ctx.body = {
            ok: false,
            msg: err.originalError ? err.originalError.message : err.message
          };
        } else {
          throw err;
        }
      });
    });
  }
}

export interface IKoaSetupConfig {
  body?: KoaBody.IKoaBodyOptions;
  keys: string[];
  session?: {
    // cookie的名称
    key: string;
    // 有效时间
    maxAge?: number;
    // 是否自动提交头信息
    autoCommit?: boolean;
    // 是否允许重写
    overwrite?: boolean;
    // 是否只能http获取
    httpOnly?: boolean;
    // 是否签名加密
    signed?: boolean;
  };
  static?: string;
  jwt?: {
    options: KoaJwt.Options;
    unless?: { path: RegExp[] };
  };
  onError?: (err, ctx) => void;
}

/**
 * 获取 当前 session
 * @param ctx
 * @constructor
 */
export function GetSession(ctx): ISessionInfo {
  return ctx.session as ISessionInfo;
}

/**
 * 设置 session
 * @param ctx
 * @param session
 * @constructor
 */
export function SetSession(ctx, session: ISessionInfo) {
  ctx.session = session;
  return ctx;
}
