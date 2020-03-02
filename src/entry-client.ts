/**
 * entry.client
 */

import Vue from 'vue';
import Vuex from 'vuex';
import { Component } from 'vue-property-decorator';

import { Auth } from './public/auth';
import { TitleMixin } from './public/mixins';

import { CreateApp } from './client/app';
import { GetterKeys } from './client/store';
import * as ProgressBarStore from './client/components/progress-bar/store';

Component.registerHooks(['asyncData']);
Vue.use(Vuex);
const { App, AppRouter, AppStore } = CreateApp();

Vue.mixin(TitleMixin('koa-vue-starter'));
Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData } = this.$options;
    if (asyncData) {
      asyncData({
        AppStore: this.$store,
        route: to
      })
        .then(next)
        .catch(next);
    } else {
      next();
    }
  }
});

if (window.__INITIAL_STATE__) {
  AppStore.replaceState(window.__INITIAL_STATE__);
}

AppRouter.onReady(() => {
  // 认证待跳转过去的视图
  AppRouter.beforeEach((to, from, next) => {
    if (Auth.authRoute(AppStore.getters[GetterKeys.session], to)) {
      next();
    } else {
      return next({
        path: Auth.authPath,
        query: { redirect: to.fullPath }
      });
    }
  });
  AppRouter.beforeResolve((to, from, next) => {
    const matched = AppRouter.getMatchedComponents(to);
    const prevMatched = AppRouter.getMatchedComponents(from);

    // 只需关心非预渲染的组件
    // 对比找出两个匹配列表的差异组件
    let diffed = false;
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c);
    });

    if (!activated.length) {
      return next();
    }
    AppStore.dispatch(ProgressBarStore.ActionKeys.present);
    Promise.all(
      activated.map(Component => {
        if (Component && (Component as any).extendOptions.asyncData) {
          return (Component as any).extendOptions.asyncData({
            store: AppStore,
            route: to
          });
        }
      })
    )
      .then(() => {
        AppStore.dispatch(ProgressBarStore.ActionKeys.dismiss);
        next();
      })
      .catch(next);
  });

  App.$mount('#app');
});
