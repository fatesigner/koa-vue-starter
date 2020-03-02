/**
 * vuex-store
 */

// 定义 actions 类型
export type IActions<TKeys, TState> = {
  [key in keyof TKeys]: (store: { commit; state: TState }, ...data: any) => any;
};

// 定义 getters 类型
export type IGetters<TKeys, TState> = {
  [key in keyof TKeys]: (state: TState) => any;
};

// 定义 mutations 类型
export type IMutations<TKeys, TState> = {
  [key in keyof TKeys]: (state: TState, payload: any) => any;
};

/**
 * 预加载数据接口
 */
export interface IPrefetch<TState> {
  (state: TState): void;
}
