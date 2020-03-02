/**
 * index
 */

import { AxiosStatic } from 'axios';

import { IHttpRequestConfig, IHttpStatic } from './type';

const Hash = require('object-hash');

export * from './type';

function getDefaultAdapter(): AxiosStatic {
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    const { Http } = require('./xhr');
    return Http;
  } else {
    // For node use HTTP adapter
    const { Http } = require('./http');
    return Http;
  }
}

const Adapter: IHttpStatic = getDefaultAdapter();

const orgCreate = Adapter.create;
Adapter.prototype.create = function(config?: IHttpRequestConfig) {
  console.log('___________key ');
  return orgCreate(config);
};

const orgGet = Adapter.get;
Adapter.prototype.get = function(url, config?: IHttpRequestConfig) {
  const key = Hash.sha1(url + JSON.stringify(config.data));
  console.log('___________key ' + key);
  if (config.cacheAdapter && config.cache && config.cacheAdapter.has(key)) {
    console.log('_______ api get cached');
    return Promise.resolve(config.cacheAdapter.get(key));
  }
  return orgGet(url, config).then(res => {
    if (config.cacheAdapter && config.cache) {
      config.cacheAdapter.set(key, res);
    }
    return res;
  });
};

export { Adapter as Http };
