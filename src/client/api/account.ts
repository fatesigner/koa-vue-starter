/**
 * account
 */

import { Http } from '../../lib/fetch';

export class AccountServiceStatic {
  // 获取新闻列表
  login(params: { username: string; password: string }) {
    return Http.post('/api/account/login', params, {
      headers: {
        contentType: 'application/json'
      }
    });
  }
}

export const AccountService = new AccountServiceStatic();
