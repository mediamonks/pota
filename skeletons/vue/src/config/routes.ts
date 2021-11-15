import type { RouteRecordRaw } from 'vue-router';
import HomePage from '../components/pages/HomePage/HomePage.vue';

/* eslint-disable @typescript-eslint/naming-convention, no-shadow */
export enum ROUTE_NAME {
  HOME = 'home',
}
/* eslint-enable @typescript-eslint/naming-convention, no-shadow */

/**
 * @see https://next.router.vuejs.org/guide/essentials/named-routes.html
 */
export default [
  {
    path: '/',
    component: HomePage,
    name: ROUTE_NAME.HOME,
  },
] as Array<RouteRecordRaw>;
