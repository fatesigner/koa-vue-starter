/**
 * 事件
 */

import Vue from 'vue';

export const EventBus = new Vue();

export enum EVENTS {
  // 登录成功
  LoginSuccess = 'App:LoginSuccess',
  // 登录失败
  LoginFailed = 'App:LoginFailed',
  // 注销成功
  LogoutSuccess = 'App:LogoutSuccess',
  RefreshAccessToken = 'App:RefreshAccessToken',
  SessionTimeout = 'App:SessionTimeout',
  SessionUpdate = 'App:SessionUpdate',
  NotAuthenticated = 'App:NotAuthenticated',
  NotAuthorized = 'App:NotAuthorized',
  Online = 'App:Online',
  Offline = 'App:Offline',
  LocationSuccess = 'App:LocationSuccess',
  LocationChange = 'App:LocationChange',
  LocationFailed = 'App:LocationFailed',
  LocationGet = 'App:LocationGet',
  // 网络已连接
  NetworkOnline = 'App:NetworkOnline',
  // 网络断开
  NetworkOffline = 'App:NetworkOffline',
  // 获取应用版本号成功
  GetAppVersion = 'App:GetAppVersion',
  // 获取客户端信息成功
  GetClientInfo = 'App:GetClientInfo'
}
