/**
 * modules
 */

import * as ProgressBarStore from '../components/progress-bar/store';

/**
 * 外部模块 和当前模块同级
 */
export const ExternalModules: any = {
  ...ProgressBarStore.Modules
};

/**
 * 内部模块 用于 modules 属性
 */
export const InternalModules = {};
