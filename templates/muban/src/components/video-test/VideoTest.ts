import { defineComponent, onMounted } from '@muban/muban';
import componentVideo from '../../assets/video/dummy-video-1.mp4';

import './VideoTest.styles.scss';

export const VideoTest = defineComponent({
  name: 'video-test',
  refs: {
    jsVideo: 'js-video',
  },
  setup({ refs }) {
    onMounted(() => {
      refs.jsVideo.element?.setAttribute('src', componentVideo);
      (refs.jsVideo.element?.parentElement as HTMLVideoElement).load();
    });
    return [];
  },
});
