/**
 * mutations
 */

import { IMutations } from '../../../../public/models/vuex-store';
import * as _ from 'lodash';
import { StateType } from './state';

// 定义 mutation keys
export const MutationKeys = {
  update: 'update'
};

export const Mutations: IMutations<typeof MutationKeys, StateType> = {
  update(state: StateType, playload: StateType) {
    state = _.merge(state, playload);
  }
};
