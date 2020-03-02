/**
 * getters
 */

import { IGetters } from '../../../../public/models/vuex-store';
import { Name } from './name';
import { StateType } from './state';

// 定义 getter keys
export const GetterKeys = {
  percent: Name + '/percent',
  show: Name + '/show',
  canSuccess: Name + '/canSuccess',
  duration: Name + '/duration',
  height: Name + '/height',
  color: Name + '/color',
  failedColor: Name + '/failedColor'
};

export const Getters: IGetters<typeof GetterKeys, StateType> = {
  percent: (state: StateType) => state.percent,
  show: (state: StateType) => state.show,
  canSuccess: (state: StateType) => state.canSuccess,
  duration: (state: StateType) => state.duration,
  height: (state: StateType) => state.height,
  color: (state: StateType) => state.color,
  failedColor: (state: StateType) => state.failedColor
};
