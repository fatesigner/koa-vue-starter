/**
 * koa.d
 */

import { BaseContext } from 'koa';
import { ISessionInfo } from '../src/public/models/session';

declare module 'koa' {
  interface BaseContext {
    session: ISessionInfo;
  }
}

declare module 'koa2' {
  namespace Application {
    interface BaseContext {
      session: ISessionInfo;
    }
  }
}

Application.BaseContext.prototype.dataLoader = function() {
  console.log("Cannot find name 'Application' at line 11 col 1");
};
