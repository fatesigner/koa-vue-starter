/**
 * api
 */

import JWT from 'jsonwebtoken';
import { writeFileSync } from 'fs';

import { USER_ROLE } from '../public/role';
import { ISessionInfo } from '../public/models/session';
import { Http } from '../public/axios';

import { ServerConfig } from './config';
import { CacheConfig } from './cache';
import { Consolelog } from '../public/logger';

//const axios = require('axios-https-proxy-fix');
const Cheerio = require('cheerio');

const tunnel = require('tunnel');
const tunnelProxy = tunnel.httpsOverHttp({
  proxy: {
    host: 'localhost',
    port: 8888
  }
});

const Http_ = Http.create({
  cacheAdapter: CacheConfig.cached,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36'
  },
  //httpsAgent: tunnelProxy,
  proxy: {
    host: '127.0.0.1',
    port: 1080
  },
  timeout: 50000
});

export class ApiServiceStatic {
  login(username: string, password: string) {
    // 模拟构造一个 axios 请求 登录
    return Http.get('http://www.baidu.com').then(() => {
      // 模拟登陆成功 并生成一个用户
      const res: ISessionInfo = {
        username: username,
        accessToken: '',
        roles: [USER_ROLE.Normal]
      };

      // 这里模拟生成一个 accessToken 实际应用中该 token 应为统一认证服务器下发
      res.accessToken = JWT.sign(res, ServerConfig.secret, {
        expiresIn: 60 * 24
      });
      console.log('__________res11 ' + JSON.stringify(res));

      return res;
    });
  }

  async getDownloadlinks(id: string) {
    // 查询网站
    const url = 'https://btsow.club';
    let err;
    let res = [];
    const { data } = await Http_.get(encodeURI(`${url}/search/${id}`), {
      cache: true
    }).catch(e => {
      err = e;
      return e;
    });
    if (data) {
      const $ = Cheerio.load(data.toString(), { decodeEntities: false });
      const links = $('.data-list .row');
      if (links) {
        res = links
          .toArray()
          .filter(x => {
            return !!$(x).find('a').length;
          })
          .map(x => {
            return {
              link: this.getHref($(x).find('a:first-child')),
              name: $(x)
                .find('.file')
                .html(),
              size: $(x)
                .find('.size')
                .html(),
              datetime: $(x)
                .find('.date')
                .html()
            };
          });
      }
    }
    if (err) {
      Consolelog(err.message, 'getDownloadlinks');
    }
    return res;
  }

  async getTsuyoshii(id: string) {
    // 查询网站
    const url = 'https://tsuyoshii.blog.fc2.com';
    let err;
    let res = [];
    const { data } = await Http_.get(encodeURI(`${url}/blog-entry-4911.html?q=${id}`)).catch(e => {
      err = e;
      return e;
    });
    if (data) {
      let $ = Cheerio.load(data.toString(), { decodeEntities: false });
      const link = this.getHref($('.list_body li a:last-child'));
      if (link) {
        const { data } = await Http_.get(encodeURI(link)).catch(e => {
          err = e;
          return e;
        });
        $ = Cheerio.load(data.toString(), { decodeEntities: false });
        res = [
          ...$('.entry_body > img')
            .toArray()
            .map(x => {
              return {
                src: $(x).attr('src')
              };
            }),
          ...$('.entry_body > a')
            .toArray()
            .filter(x => {
              const href = $(x).attr('href');
              return href.indexOf('.jpg') > -1;
            })
            .map(x => {
              const href = $(x).attr('href');
              return {
                src: href
              };
            })
        ];
      }
    }
    if (err) {
      Consolelog(err.message, 'getTsuyoshii');
    }
    return res;
  }

  async getMgstage(id: string) {
    // 查询网站
    const url = 'https://www.mgstage.com';
    let err;
    let res = [];
    const { data } = await Http_.get(encodeURI(`${url}/product/product_detail/${id}`)).catch(e => {
      err = e;
      return e;
    });
    if (data) {
      const $ = Cheerio.load(data.toString(), { decodeEntities: false });
      res = [
        ...$('#sample-photo > .sample_image')
          .toArray()
          .map(x => {
            return {
              src: $(x).attr('href')
            };
          })
      ];
      const link = this.getHref($('#sample-photo'));
    }
    if (err) {
      Consolelog(err.message, 'getMgstage');
    }
    return res;
  }

  getHref($el) {
    if ($el && $el.length) {
      return $el.attr('href');
    }
    return null;
  }
}

export const ApiService = new ApiServiceStatic();
