/**
 * router
 */

import Vue from 'vue';
import Router from 'vue-router';
import { Component, RouteConfig } from 'vue-router/types/router';

import { USER_ROLE } from '../public/role';
import routers from './routers';

Vue.use(Router);

export function CreateRouter() {
  return new Router({
    mode: 'history',
    linkActiveClass: 'activated',
    linkExactActiveClass: 'exact-activated',
    routes: routers
  });
}

export interface IAppRouteConfig extends RouteConfig {
  components?: {
    default: Component;
    header?: Component;
    footer?: Component;
  };
  meta?: {
    // 该路由可访问的权限组
    auth: USER_ROLE[];
  };
}
