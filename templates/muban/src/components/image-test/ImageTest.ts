import { defineComponent, computed, bind, onMounted, ref } from '@muban/muban';
import componentImage from './images/component-test.jpg';

import './ImageTest.styles.scss';

export const ImageTest = defineComponent({
  name: 'image-test',
  refs: {
    jsImage: 'js-image',
  },
  setup({ refs }) {
    const image = ref<string>();
    onMounted(async () => {
      image.value = (
        await (await fetch('/api/mocks/imageTest')).json()
      ).imageTestDefaultMockData.dataImage;
    });
    return [bind(refs.jsImage, { attr: { src: computed(() => image.value ?? componentImage) } })];
  },
});
