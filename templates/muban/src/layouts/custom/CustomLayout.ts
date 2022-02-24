import { defineComponent } from '@muban/muban';
import { supportLazy } from '@muban/muban/dist/esm/lib/api/apiLazy';

export const CustomLayout = defineComponent({
  name: 'custom-layout',
  setup() {
    return [];
  },
});

export const lazy = supportLazy(CustomLayout);
