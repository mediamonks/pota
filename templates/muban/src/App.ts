import { defineComponent, lazy } from '@muban/muban';

export const App = defineComponent({
  name: 'app',
  components: [
    lazy(
      'default-layout',
      () => import('./layouts/default/DefaultLayout'),
    ),
    lazy(
      'custom-layout',
      () => import('./layouts/custom/CustomLayout'),
    ),
  ],
  setup() {
    return [];
  },
});
