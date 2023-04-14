import { defineComponent } from '@muban/muban';
import { BlockRenderer } from '../../block-renderer/BlockRenderer';

export const DefaultLayout = defineComponent({
  name: 'default-layout',
  components: [BlockRenderer],
  setup() {
    return [];
  },
});
