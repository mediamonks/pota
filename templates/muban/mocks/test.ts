/* eslint-disable @typescript-eslint/naming-convention */
import type { RequestConfig } from '@mediamonks/monck';
import { imageTestDefaultMockData } from '../src/components/image-test/ImageTest.mocks';

export default {
  'GET /mocks/imageTest': (_, response) => {
    response.send(imageTestDefaultMockData);
  },
} as RequestConfig;
