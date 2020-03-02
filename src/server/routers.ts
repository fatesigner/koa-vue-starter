/**
 * routers
 */

import { Ctx, FromBody, FromQuery, Get, Post, Route } from '../public/koa-common';
import { Auth } from '../public/auth';

import { ApiService } from './api';
import { GetSession, SetSession } from './setup-koa';

@Route('/api')
export class NewsControllerStatic {
  @Post()
  login(@FromBody('username') username: string, @FromBody('password') password: string, @Ctx ctx: any) {
    // 模拟构造一个 axios 请求 登录
    return ApiService.login(username, password).then(res => {
      // 设置 sssion
      ctx.session = res;
      return res;
    });
  }

  @Get()
  logout(@Ctx ctx: any) {
    console.log('ctx.redirect()');
    SetSession(ctx, null);
    // 注销后 重定向到主页
    //ctx.redirect('/');
    //ctx.status = 301;
    ctx.session = null;
    ctx.redirect(Auth.entryPath);
    //ctx.response.redirect(Auth.entryPath);
  }

  @Get()
  getDownloadlinks(@FromQuery('id') id, @Ctx ctx: any) {
    return ApiService.getDownloadlinks(id);
  }

  @Get()
  getMgstage(@FromQuery('id') id, @Ctx ctx: any) {
    return ApiService.getMgstage(id);
  }

  @Get()
  getTsuyoshii(@FromQuery('id') id, @Ctx ctx: any) {
    return ApiService.getTsuyoshii(id);
  }
}

export const NewsController = new NewsControllerStatic();
