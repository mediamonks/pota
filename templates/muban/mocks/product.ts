/* eslint-disable @typescript-eslint/naming-convention */
import path from 'path';
import { existsSync } from 'fs';

import type { RequestConfig } from '@mediamonks/monck';

export default {
  'GET /products': (_, ressponse) => {
    ressponse.send({
      products: 'todo',
    });
  },

  'GET /products/:id': (request, response) => {
    const { id } = request.params;
    const productPath = path.join(__dirname, `products/${id}.json`);
    if (existsSync(productPath)) {
      response.sendFile(productPath);
    } else {
      response.sendFile(path.join(__dirname, `products/default.json`));
    }
  },
} as RequestConfig;
