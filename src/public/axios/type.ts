/**
 * type
 */

import {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  CancelStatic,
  CancelTokenStatic
} from 'axios';

export enum ContentType {
  FormUrlEncoded = 'application/x-www-form-urlencoded;charset=UTF-8',
  FormData = 'multipart/form-data',
  JSON = 'application/json;charset=UTF-8',
  PDF = 'application/pdf'
}

export class RejectData {
  data?: any;
  status?: number;
  message = '';

  constructor(message: string, status?: number, data?: any) {
    this.message = message;
    this.status = status;
    this.data = data;
  }
}

/**
 * 缓存适配器
 */
export interface ICacheAdapter {
  has: (key: string) => boolean;
  get: (key: string) => any;
  set: (key: string, data: any) => any;
}

export interface IHttpInstance {
  (config: IHttpRequestConfig): AxiosPromise;
  (url: string, config?: IHttpRequestConfig): AxiosPromise;
  defaults: IHttpRequestConfig;
  interceptors: {
    request: AxiosInterceptorManager<IHttpRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  getUri(config?: IHttpRequestConfig): string;
  request<T = any, R = AxiosResponse<T>>(config: IHttpRequestConfig): Promise<R>;
  get<T = any, R = AxiosResponse<T>>(url: string, config?: IHttpRequestConfig): Promise<R>;
  delete<T = any, R = AxiosResponse<T>>(url: string, config?: IHttpRequestConfig): Promise<R>;
  head<T = any, R = AxiosResponse<T>>(url: string, config?: IHttpRequestConfig): Promise<R>;
  options<T = any, R = AxiosResponse<T>>(url: string, config?: IHttpRequestConfig): Promise<R>;
  post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: IHttpRequestConfig): Promise<R>;
  put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: IHttpRequestConfig): Promise<R>;
  patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: IHttpRequestConfig): Promise<R>;
}

export interface IHttpStatic extends IHttpInstance {
  create(config?: IHttpRequestConfig): IHttpInstance;
  Cancel: CancelStatic;
  CancelToken: CancelTokenStatic;
  isCancel(value: any): boolean;
  all<T>(values: (T | Promise<T>)[]): Promise<T[]>;
  spread<T, R>(callback: (...args: T[]) => R): (array: T[]) => R;
}

export interface IHttpRequestConfig extends AxiosRequestConfig {
  cacheAdapter?: ICacheAdapter;
  cache?: boolean;
}
