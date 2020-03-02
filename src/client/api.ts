/**
 * api
 */

import { Http } from '../public/fetch';

export class ApiServiceStatic {
  login(params: { username: string; password: string }) {
    return Http.post('/api/login', params, {
      headers: {
        contentType: 'application/json'
      }
    });
  }

  // 获取下载链接
  getDownloadlinks(id: string) {
    return Http.get('/api/getDownloadlinks', {
      params: {
        id
      }
    }).then(res => {
      return res.data;
    });
  }

  getMgstage(id: string) {
    return Http.get('/api/getMgstage', {
      params: {
        id
      }
    }).then(res => {
      return res.data;
    });
  }

  getTsuyoshii(id: string) {
    return Http.get('/api/getTsuyoshii', {
      params: {
        id
      }
    }).then(res => {
      return res.data;
    });
  }
}

export const ApiService = new ApiServiceStatic();
