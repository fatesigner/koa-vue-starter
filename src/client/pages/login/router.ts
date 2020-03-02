/**
 * router
 */

import { IAppRouteConfig } from '../../router';

const Router: IAppRouteConfig = {
  path: '/login',
  name: 'login',
  components: {
    default: () => import('./login.vue'),
    header: null,
    footer: null
  }
};

export default Router;
