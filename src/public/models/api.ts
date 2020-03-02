/**
 * api
 */

/**
 * 定义 ApiService 接口
 */
export interface IApiService {

}

/**
 * 定义 api 接口
 */
export type IApi<T> = (
  params: {
    [key: string]: any;
  },
  headers: {
    [key: string]: string;
  }
) => Promise<T>;

/**
 * 定义 api 返回数据类型接口
 */
export interface IApiResult<T> {
  result: T;
}

/**
 * 定义 api 错误消息接口
 */
export interface IApiError<T> {
  code: number;
  message: string;
  result: T;
}
