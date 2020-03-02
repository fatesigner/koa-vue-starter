/**
 * news
 */

import { Http } from '../../lib/fetch';

export class NewsServiceStatic {
  // 获取新闻列表
  getNewsList(params: { pageIndex: number; pageSize: number }) {
    return Http.get('/api/news/getNewsList', {
      params
    }).then(res => {
      return res.data;
    });
  }
}

export const NewsService = new NewsServiceStatic();
