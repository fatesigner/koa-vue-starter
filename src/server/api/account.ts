/**
 * account
 */

import JWT from 'jsonwebtoken';
import { Http } from '../../lib/fetch';
import { Ctx, FromBody, Get, Post, Route } from '../../lib/koa-common';
import { USER_ROLE } from '../../public/role';
import { ISessionInfo } from '../../public/models/session';
import { AppConfig } from '../config';
import { SetSession } from '../common';

@Route('/api/account')
export class AccountServiceStatic {
  @Post()
  login(
    @FromBody('username') username: string,
    @FromBody('password') password: string,
    @Ctx ctx: any
  ) {
    // 模拟构造一个 axios 请求 登录
    return Http.get('https://www.zhihu.com/').then(() => {
      // 模拟登陆成功 并生成一个用户
      const res: ISessionInfo = {
        username: username,
        accessToken: '',
        roles: [USER_ROLE.Normal]
      };

      // 这里模拟生成一个 accessToken 实际应用中该 token 应为统一认证服务器下发
      res.accessToken = JWT.sign(res, AppConfig.secret, {
        expiresIn: 60 * 24
      });

      // 设置 sssion
      ctx.session = res;

      return res;
    });
  }

  @Get()
  logout(@Ctx ctx: any) {
    SetSession(ctx, null);
    // 注销后 重定向到主页
    ctx.redirect('/');
  }
}

export const AccountService = new AccountServiceStatic();
