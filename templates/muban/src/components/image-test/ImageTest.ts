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
      const result = await fetch('/api/mocks/imageTest');
      const json = await result.json();
      image.value = json.imageTestDefaultMockData.dataImage;
    });
    return [bind(refs.jsImage, { attr: { src: computed(() => image.value ?? componentImage) } })];
  },
});
