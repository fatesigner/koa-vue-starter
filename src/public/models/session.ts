import { USER_ROLE } from '../role';

/**
 * user
 */

export interface ISessionInfo {
  username: string;
  // 用户拥有的角色 可以有多个
  roles: USER_ROLE[];
  avatar?: string;
  realName?: string;
  tokenType?: string;
  accessToken?: string;
  accessTokenFull?: string;
  refreshToken?: string;
  tokenExpirationTime?: number;
}
