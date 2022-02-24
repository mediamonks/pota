import { defineComponent, lazy } from '@muban/muban';

export const App = defineComponent({
  name: 'app',
  components: [
    lazy(
      'default-layout',
      () => import(/* webpackExports: "lazy" */ './layouts/default/DefaultLayout'),
    ),
    lazy(
      'custom-layout',
      () => import(/* webpackExports: "lazy" */ './layouts/custom/CustomLayout'),
    ),
  ],
  setup() {
    return [];
  },
});
