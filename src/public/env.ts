/**
 * env
 * 全局环境变量
 */

export const TestAccount = {
  username: 'admin',
  name: '测试',
  password: 'A1s2d3',
  validateCode: '3585'
};

// 网站地址
export const WebSiteHost = process.env.NODE_ENV === 'development' ? '' : '';

// 分页
export const PageSize = 10;
