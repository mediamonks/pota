import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { define } from '@pota/authoring';
import vueBaseSkeleton from '@pota/vue-base-skeleton';

export default define(vueBaseSkeleton, {
  dirname: dirname(fileURLToPath(import.meta.url)),
  omit: ['src/App.vue'],
});
