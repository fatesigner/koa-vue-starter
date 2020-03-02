/**
 * entry.server
 */

import Vue from 'vue';
import Vuex from 'vuex';
import { sync } from 'vuex-router-sync';
import { Component } from 'vue-property-decorator';

import { Auth } from './public/auth';
import { TitleMixin } from './public/mixins';

import { CreateApp } from './client/app';
import { ActionKeys, GetterKeys } from './client/store';

Component.registerHooks(['asyncData']);
Vue.mixin(TitleMixin('koa-vue-starter'));

export default context => {
  // 返回 Promise 等待异步路由钩子函数或组件
  return new Promise((resolve, reject) => {
    Vue.use(Vuex);
    const { App, AppRouter, AppStore } = CreateApp();

    // 同步路由状态到 store
    sync(AppStore, AppRouter);

    // 同步session到 store
    AppStore.dispatch(ActionKeys.login, context.session);

    const matchComponents = function() {
      const matchedComponents = AppRouter.getMatchedComponents();
      // 如果未匹配到对应的组件，则返回 404
      if (!matchedComponents.length) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ code: 404, message: "Vue: can't match any component." });
      } else {
        // 对所有匹配的路由组件调用 `asyncData()`
        Promise.all(
          matchedComponents.map(Component => {
            if (Component && (Component as any).extendOptions.asyncData) {
              // console.log('______________(Component as any).extendOptions.asyncData ');
              return (Component as any).extendOptions.asyncData({
                store: AppStore,
                route: AppRouter.currentRoute
              });
            }
          })
        )
          .then(() => {
            // 在所有预取钩子(preFetch hook) resolve 后，
            // 我们的 store 现在已经填充入渲染应用程序所需的状态。
            // 当我们将状态附加到上下文，
            // 并且 `template` 选项用于 renderer 时，
            // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
            context.state = AppStore.state;
            resolve(App);
          })
          .catch(reject);
      }
    };

    // 设置服务端router的位置
    AppRouter.push(context.url).then(() => {
      // 认证待跳转过去的视图
      if (!Auth.authRoute(AppStore.getters[GetterKeys.session], AppRouter.currentRoute)) {
        // 认证未通过 抛出错误给node服务器 将请求重定向到授权页面
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({
          redirect: Auth.authPath + '?redirect=' + AppRouter.currentRoute.fullPath
        });
      } else {
        matchComponents();
      }
    });

    // 等待 AppRouter 将可能的异步组件和钩子解析完
    AppRouter.onReady(() => {}, reject);
  });
};
