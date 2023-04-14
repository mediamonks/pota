import { defineComponent, lazy } from '@muban/muban';
import { ImageTest } from '../image-test/ImageTest';
import { VideoTest } from '../video-test/VideoTest';

export const BlockRenderer = defineComponent({
  name: 'block-renderer',
  components: [
    lazy('toggle-expand', () => import('../atoms/toggle-expand/ToggleExpand')),
    ImageTest,
    VideoTest,
  ],
  setup() {
    return [];
  },
});
