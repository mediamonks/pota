const path = require('path');

(async () => {
  const { createServer } = await import('../../dist/index.js');

  createServer({
    templateDir: path.resolve(__dirname, '../templates'),
    useUnixSocket: process.env.NODE_ENV === 'production',
    extensionPath: path.resolve(__dirname, '../extensions/twig-extensions.cjs'),
  });
})();
