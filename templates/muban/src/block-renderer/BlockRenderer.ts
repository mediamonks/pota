import { defineComponent, lazy } from '@muban/muban';
import { ImageTest } from '../components/image-test/ImageTest';
import { VideoTest } from '../components/video-test/VideoTest';

export const BlockRenderer = defineComponent({
  name: 'block-renderer',
  components: [
    lazy(
      'toggle-expand',
      () => import(/* webpackExports: "lazy" */ '../components/atoms/toggle-expand/ToggleExpand'),
    ),
    ImageTest,
    VideoTest,
  ],
  setup() {
    return [];
  },
});
