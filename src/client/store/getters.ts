/**
 * igetters
 */

import { IGetters } from '../../public/models/vuex-store';

import { Name } from './name';
import { StateType } from './state';

// 定义 getter keys
export const GetterKeys = {
  session: Name + '/session'
};

export const Getters: IGetters<typeof GetterKeys, StateType> = {
  session: state => state.session
};
