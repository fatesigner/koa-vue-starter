/**
 * router
 */

import { IAppRouteConfig } from '../../router';
import { USER_ROLE } from '../../../public/role';

const Router: IAppRouteConfig = {
  path: '/news/:id?',
  name: 'news',
  components: {
    default: () => import('./news.vue'),
    header: () => import('../../components/header/header.vue'),
    footer: () => import('../../components/footer/footer.vue')
  },
  meta: {
    auth: [USER_ROLE.Normal]
  }
};

export default Router;
