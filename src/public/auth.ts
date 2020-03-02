/**
 * Auth
 * 授权、认证服务
 */

import { Route } from 'vue-router/types/router';

import { USER_ROLE } from './role';
import { ISessionInfo } from './models/session';
import { GetterKeys } from '../client/store';

export const AuthorizedRoles = {};

class Auth_ {
  authPath = '/login';
  entryPath = '/';
  logoutPath = '/api/logout';

  /**
   * 判断用户是否登录
   */
  public isAuthenticated(session: ISessionInfo): boolean {
    return !!(session.username && session.accessToken);
  }

  // 认证待跳转过去的视图
  public authRoute(session: ISessionInfo, to: Route) {
    return to.matched.every(record => {
      if (record.meta && record.meta.auth && record.meta.auth.length) {
        // 验证当前角色是否有访问权限
        const isa = this.isAuthorized(session, record.meta.auth);
        return isa.permissible;
      }
      return true;
    });
  }

  /**
   * 对于指定的角色组 判断当前用户是否已授权
   * @param session
   * @param {Array} authorizedRoles
   * 没有指定角色组 视为已授权
   * @return {Object}
   * permissible：是否有权限访问
   * unauthorizedRoles：未符合的角色组 若数量和小于指定的角色组 视为 已授权 否则为 未授权
   */
  public isAuthorized(
    session: ISessionInfo,
    authorizedRoles: USER_ROLE[]
  ): {
    permissible: boolean;
    unauthorizedRoles: USER_ROLE[];
  } {
    const length = authorizedRoles && authorizedRoles.length;
    const authorizedRolesNew = [];
    if (length) {
      // 先判断用户登录是否过期
      if (!this.isAuthenticated(session)) {
        return {
          permissible: false,
          unauthorizedRoles: authorizedRoles
        };
      }
      let temp;
      let temp2 = false;
      for (let i = 0; i < length; i++) {
        temp = authorizedRoles[i];
        for (const item of session.roles) {
          if (temp === item) {
            temp2 = true;
            break;
          }
        }
        if (!temp2) {
          authorizedRolesNew.push(temp);
          temp2 = false;
        }
      }
    }
    return {
      permissible: !length || authorizedRolesNew.length < length,
      unauthorizedRoles: authorizedRolesNew
    };
  }

  /**
   * 对于给定的Page name，判断当前用户是否有权限访问
   * @param session
   * @param page
   */
  public isAuthorizedForPage(session: ISessionInfo, page: string): boolean {
    let authorizedRoles = AuthorizedRoles[page];
    if (!authorizedRoles) {
      authorizedRoles = [USER_ROLE.Normal];
    }
    const authRes = this.isAuthorized(session, authorizedRoles);
    if (!authRes.permissible) {
      console.log("The page '" + page + "' is not authorized.");
    }
    return authRes.permissible;
  }
}

export const Auth = new Auth_();
