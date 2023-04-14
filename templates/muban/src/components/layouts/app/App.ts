import { defineComponent, lazy } from '@muban/muban';

export const App = defineComponent({
  name: 'app',
  components: [
    lazy('default-layout', () => import('../default/DefaultLayout')),
    lazy('custom-layout', () => import('../custom/CustomLayout')),
  ],
  setup() {
    return [];
  },
});
