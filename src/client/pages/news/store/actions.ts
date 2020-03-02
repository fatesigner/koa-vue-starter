/**
 * actions
 */

import { IActions } from '../../../../public/models/vuex-store';

import { Name } from './name';
import { MutationKeys } from './mutations';
import { StateType } from './state';

// 定义 action keys
export const ActionKeys = {
  fetchItems: Name + '/fetchItems'
};

export const Actions: IActions<typeof ActionKeys, StateType> = {
  async fetchItems(context: { commit: any; state: StateType }, params: { id: string }) {
    if (process.env.BROWSER) {
      const { ApiService } = await import('../../../api');
      const [downloadlinks, mgstage, tsuyoshii] = await Promise.all([
        ApiService.getDownloadlinks(params.id).catch(function(err) {
          return [];
        }),
        ApiService.getMgstage(params.id).catch(function(err) {
          return [];
        }),
        ApiService.getTsuyoshii(params.id).catch(function(err) {
          return [];
        })
      ]);
      context.commit(MutationKeys.update, {
        id: params.id,
        downloadlinks,
        mgstage,
        tsuyoshii
      });
    } else {
      const { ApiService } = await import('../../../../server/api');
      // const SSR = global.__VUE_SSR_CONTEXT__;
      // console.log('SSR ' + JSON.stringify(Object.keys(global)));
      const [downloadlinks, mgstage, tsuyoshii] = await Promise.all([
        ApiService.getDownloadlinks(params.id).catch(function(err) {
          return [];
        }),
        ApiService.getMgstage(params.id).catch(function(err) {
          return [];
        }),
        ApiService.getTsuyoshii(params.id).catch(function(err) {
          return [];
        })
      ]);
      context.commit(MutationKeys.update, {
        id: params.id,
        downloadlinks,
        mgstage,
        tsuyoshii
      });
    }
  }
};
