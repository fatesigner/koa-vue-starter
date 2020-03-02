/**
 * state
 */

import { ISessionInfo } from '../../public/models/session';

export interface StateType {
  // 存储session信息
  session: ISessionInfo;
}

export const State: StateType = {
  session: null
};
