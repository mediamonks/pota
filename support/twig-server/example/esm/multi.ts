import path from 'path';
import { URL } from 'url';
import { createServer } from '../../src/index';

createServer({
  templateDir: [
    path.resolve(new URL('.', import.meta.url).pathname, '../templates'),
    {
      foundation: path.resolve(new URL('.', import.meta.url).pathname, '../templates/foundation'),
    },
  ],
  useUnixSocket: process.env.NODE_ENV === 'production',
  extensionPath: path.resolve(
    new URL('.', import.meta.url).pathname,
    '../extensions/twig-extensions.cjs',
  ),
});
