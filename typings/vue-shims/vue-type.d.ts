/**
 * vue-type.d
 */

import VueRouter, { Route } from 'vue-router';

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter;
    $route: Route;
    $style: { [key: string]: string };
    $store: {
      dispatch: any;
      [string]: any;
    };
    $refs: {
      [key: string]: any;
    };
    $vnode: any;
  }
}
