/**
 * actions
 */

import { IActions } from '../../../../public/models/vuex-store';

import { Name } from './name';
import { MutationKeys } from './mutations';
import { StateType } from './state';

// 定义 action keys
export const ActionKeys = {
  present: Name + '/present',
  dismiss: Name + '/dismiss',
  update: Name + '/update'
};

let _cut;
let _timer;
const increase = function(num) {
  this.percent = this.percent + Math.floor(num);
  return this;
};
const hide = function() {
  clearInterval(_timer);
  _timer = null;
  setTimeout(() => {
    this.show = false;
    setTimeout(() => {
      this.percent = 0;
    }, 200);
  }, 500);
  return this;
};
const finish = function() {
  this.percent = 100;
  hide.call(this);
  return this;
};

export const Actions: IActions<typeof ActionKeys, StateType> = {
  present(context: { commit: any; state: StateType }, message: string) {
    context.state.show = true;
    context.state.canSuccess = true;
    if (_timer) {
      clearInterval(_timer);
      context.state.percent = 0;
    }
    _cut = 10000 / Math.floor(context.state.duration);
    _timer = setInterval(() => {
      increase.call(context.state, _cut * Math.random());
      if (context.state.percent > 95) {
        finish.call(context.state);
      }
    }, 100);
  },
  dismiss(context: { commit: any; state: StateType }) {
    clearInterval(_timer);
    _timer = null;
    setTimeout(() => {
      context.state.show = false;
      setTimeout(() => {
        context.state.percent = 0;
      }, 200);
    }, 500);
  },
  update(context: { commit: any; state: StateType }, data: StateType) {
    context.commit(MutationKeys.update, data);
  }
};
