import type { Plugin } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import routes from './routes';

/**
 * @see https://v3.vuejs.org/guide/plugins.html#plugins
 */
export default [
  // vue-router
  createRouter({ routes, history: createWebHistory(process.env.PUBLIC_URL) }),
] as ReadonlyArray<Plugin>;
