const { resolve } = require('path');

const packageJsonConfig = (require(resolve(__dirname, '..', 'package.json'))?.config ?? {});

const ENABLE_MOCK_API_MIDDLEWARE = process.env.MOCK_API === 'true';
const ENABLE_TEMPLATE_MIDDLEWARE = packageJsonConfig['twig-support'] === true;
const MOCKS_OUTPUT_DIR = resolve(process.cwd(), 'dist', 'node', 'mocks');

module.exports = async (router) => {
  if (ENABLE_MOCK_API_MIDDLEWARE) {
    const { createMockMiddleware } = await import('@mediamonks/monck');
    router.use('/api/', createMockMiddleware(MOCKS_OUTPUT_DIR));
  }
  if (ENABLE_TEMPLATE_MIDDLEWARE) {
    const { createTwigMiddleware } = (await import('@pota/twig-server'));
    router.use('/component-templates/', createTwigMiddleware(resolve(__dirname, '../src/components'), {
      extensionPath: resolve(__dirname, '../config/twig/twig-extensions.cjs')
    }));
  }
};
