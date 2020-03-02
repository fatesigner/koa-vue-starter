/**
 * news
 */

import { Http } from '../../lib/fetch';
import { Ctx, FromQuery, Get, Route } from '../../lib/koa-common';
import { INewsItem } from '../../public/models/news';
import { IApiResult } from '../../public/models/api';
import { GetSession } from '../common';

@Route('/api/news')
export class NewsServiceStatic {
  @Get()
  // 获取新闻列表
  getNewsList(
    @FromQuery('pageIndex') pageIndex = 1,
    @FromQuery('pageSize') pageSize = 10,
    @Ctx ctx: any
  ) {
    // 模拟构造一个 axios 请求 登录

    // 获取 session
    const session = GetSession(ctx);

    return Http.get('https://www.zhihu.com/', {
      headers: {
        Authorization: session ? session.accessToken : ''
      }
    }).then(() => {
      const start = (Number(pageIndex) - 1) * pageSize;
      const end = (Number(pageIndex) + 1) * pageSize;
      const res: IApiResult<INewsItem[]> = {
        result: []
      };
      for (let i = start; i < end; i++) {
        const item: INewsItem = {
          id: i.toString(),
          title: i.toString()
        };
        res.result.push(item);
      }
      return res;
    });
  }
}

export const NewsService = new NewsServiceStatic();
