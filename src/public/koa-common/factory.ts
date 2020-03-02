/**
 * factory
 */

import Router from 'koa-router';
import KoaBody from 'koa-body';

import { controllerList, GlobalRoutes, paramList, parseList, routerList } from './decorators';

export function GetRoutes() {
  const routes = [];
  GlobalRoutes.targets.forEach(target => {
    const route = new Router({
      prefix: target.path
    });
    GlobalRoutes.methods = GlobalRoutes.methods.filter(method => {
      if (method.target === target.target.prototype) {
        route[method.type](
          method.path || `/${method.name}`,
          KoaBody(),
          (function() {
            const args = [];
            // 获取当前函数对应的参数获取
            GlobalRoutes.params = GlobalRoutes.params.filter(param => {
              if (param.target === target.target.prototype && param.name === method.name) {
                const { index, key } = param;
                if (param.pos === 'ctx') {
                  args[index] = ctx => {
                    return ctx;
                  };
                } else if (param.pos === 'body') {
                  args[index] = ctx => {
                    if (key && key.length) {
                      return ctx.request.body[key];
                    }
                    return ctx.request.body;
                  };
                } else if (param.pos === 'query') {
                  args[index] = ctx => {
                    if (key && key.length) {
                      return ctx.query[key];
                    }
                    return ctx.query;
                  };
                }
                return false;
              }
              return true;
            });
            return async (ctx, next) => {
              const res = await method.ctrl(...args.map(x => x(ctx)));
              if (res) {
                ctx.body = res;
              }
            };
          })()
        );
        return false;
      }
      return true;
    });
    routes.push(route);
  });
  return routes;
}

export function GetRoutes2() {
  const routers = [];
  // 遍历所有添加了装饰器的Class，并创建对应的Router对象
  routerList.forEach(item => {
    const { basename, constrcutor } = item;
    const router = new Router({
      prefix: basename
    });

    controllerList
      .filter(i => i.target === constrcutor.prototype)
      .forEach(controller => {
        router[controller.type](controller.path, async (ctx, next) => {
          const args = [];
          // 获取当前函数对应的参数获取
          paramList
            .filter(param => param.target === constrcutor.prototype && param.method === controller.method)
            .map(param => {
              const { index, key } = param;
              switch (param.position) {
                case 'body':
                  args[index] = ctx.request.body[key];
                  break;
                case 'header':
                  args[index] = ctx.headers[key];
                  break;
                case 'cookie':
                  args[index] = ctx.cookies.get(key);
                  break;
                case 'query':
                  args[index] = ctx.query[key];
                  break;
              }
            });

          // 获取当前函数对应的参数格式化
          parseList
            .filter(parse => parse.target === constrcutor.prototype && parse.method === controller.method)
            .map(parse => {
              const { index } = parse;
              switch (parse.type) {
                case 'number':
                  args[index] = Number(args[index]);
                  break;
                case 'string':
                  args[index] = String(args[index]);
                  break;
                case 'boolean':
                  args[index] = String(args[index]) === 'true';
                  break;
              }
            });

          // 调用实际的函数，处理业务逻辑
          ctx.body = controller.controller(...args);
        });
      });

    routers.push(router.routes());
  });

  return routers;
}

/* export function Service(name: string) {
  return function(constructor) {};
}

export function Get(path: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value;
  };
} */
