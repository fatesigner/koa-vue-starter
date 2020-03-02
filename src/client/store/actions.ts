/**
 * actions
 */

import { IActions } from '../../public/models/vuex-store';
import { ISessionInfo } from '../../public/models/session';
import { Name } from './name';
import { MutationKeys } from './mutations';
import { StateType } from './state';

// 定义 action keys
export const ActionKeys = {
  login: Name + '/login',
  logout: Name + '/logout'
};

export const Actions: IActions<typeof ActionKeys, StateType> = {
  async login(context: { commit: any; state: StateType }, session: ISessionInfo) {
    context.commit(MutationKeys.update, {
      session
    });
  },
  async logout(context: { commit: any; state: StateType }) {
    context.commit(MutationKeys.update, {
      session: {}
    });
  }
};
