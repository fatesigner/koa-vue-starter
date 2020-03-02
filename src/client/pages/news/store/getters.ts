/**
 * getters
 */

import { IGetters } from '../../../../public/models/vuex-store';
import { Name } from './name';
import { StateType } from './state';

// 定义 getter keys
export const GetterKeys = {
  id: Name + '/id',
  downloadlinks: Name + '/downloadlinks',
  mgstage: Name + '/mgstage',
  tsuyoshii: Name + '/tsuyoshii'
};

export const Getters: IGetters<typeof GetterKeys, StateType> = {
  id: (state: StateType) => state.id,
  downloadlinks: (state: StateType) => state.downloadlinks,
  mgstage: (state: StateType) => state.mgstage,
  tsuyoshii: (state: StateType) => state.tsuyoshii
};
