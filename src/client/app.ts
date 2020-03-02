/**
 * app
 */

import Vue from 'vue';

import AppPage from './app.vue';
import { CreateRouter } from './router';
import { CreateStore } from './store';

export function CreateApp(context?: any) {
  const AppRouter = CreateRouter();
  const AppStore = CreateStore();

  const App = new Vue({
    components: { AppPage },
    router: AppRouter,
    store: AppStore,
    render: h => h(AppPage)
  });

  return { App, AppRouter, AppStore };
}
