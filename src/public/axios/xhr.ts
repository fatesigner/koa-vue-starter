/**
 * xhr
 * 使用 Axios
 * Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。
 *
 * 从浏览器中创建 XMLHttpRequests
 * 从 node.js 创建 http 请求
 * 支持 Promise API
 * 拦截请求和响应
 * 转换请求数据和响应数据
 * 取消请求
 * 自动转换 JSON 数据
 * 客户端支持防御 XSRF
 */

import Axios from 'axios';
import Qs from 'qs';

import { ContentType, RejectData } from './type';

// 接口地址
Axios.defaults.baseURL = '';

// Content-Type
Axios.defaults.headers.post['Content-Type'] = ContentType.FormUrlEncoded;

// 超时时间
Axios.defaults.timeout = 5000;

// 请求拦截: 为 POST 传参序列化
Axios.interceptors.request.use(
  function(config) {
    if (config.method === 'post' && config.headers['Content-Type'] === ContentType.FormUrlEncoded) {
      config.data = Qs.stringify(config.data);
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// 响应拦截
Axios.interceptors.response.use(
  function(res) {
    return res;
  },
  function(rejection) {
    let data: any = {};
    let message = '';
    let status;
    if (rejection.response) {
      if (rejection.response.data) {
        data = rejection.response.data;
      }
      if (rejection.response.status) {
        status = rejection.response.status;
      }
    }
    switch (status) {
      case -1: {
        // 远程服务器无响应
        message = '服务器无响应，请检查你的网络设置';
        break;
      }
      case 401: {
        // token 过期 刷新
        message = '请求的令牌过期';
        break;
      }
      case 408: {
        message = '连接服务器超时，请检查你的网络设置';
        break;
      }
      default: {
        if (rejection.code === 'ECONNABORTED') {
          message = '连接服务器超时，请检查你的网络设置';
        } else {
          if (Object.prototype.toString.call(data) === '[object String]') {
            message = data;
          } else {
            message = data.Message || '请求失败，请联系管理员';
          }
        }
      }
    }
    return Promise.reject(new RejectData(message, status, data));
  }
);

export { Axios as Http };
