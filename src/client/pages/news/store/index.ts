/**
 * store
 */

import Vuex from 'vuex';
import { ActionKeys, Actions } from './actions';
import { GetterKeys, Getters } from './getters';
import { ExternalModules, InternalModules } from './modules';
import { MutationKeys, Mutations } from './mutations';
import { Name } from './name';
import { State, StateType } from './state';

// 当前 store
const Store = {
  namespaced: true,
  actions: Actions,
  getters: Getters,
  mutations: Mutations,
  state: State,
  // 内部模块
  modules: InternalModules
};

const Modules = {
  [Name]: Store,
  // 外部模块
  ...ExternalModules
};

export function CreateStore() {
  return new Vuex.Store<StateType>({
    modules: Modules
  });
}

export { ActionKeys, GetterKeys, MutationKeys, StateType, Modules, Name, Store };
