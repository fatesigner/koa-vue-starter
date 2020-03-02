/**
 *  用户角色权限配置
 *  可以根据实际业务设置
 */

export enum USER_ROLE {
  // 所有用户，代表所有已认证了该系统的用户，不限角色
  All = 'All',
  // 管理员
  Admin = 'Admin',
  // 已登录用户
  Normal = 'Normal'
}
