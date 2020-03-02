/**
 * router
 */

import { IAppRouteConfig } from '../../router';
import { USER_ROLE } from '../../../public/role';

const Router: IAppRouteConfig = {
  path: '/personal',
  name: 'personal',
  components: {
    default: () => import('./personal.vue'),
    header: () => import('../../components/header/header.vue'),
    footer: () => import('../../components/footer/footer.vue')
  },
  meta: {
    auth: [USER_ROLE.Normal]
  }
};

export default Router;
