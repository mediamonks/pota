const { resolve, join, basename, dirname } = require('path');

const packageJsonConfig = (require(resolve(__dirname, '..', 'package.json'))?.config ?? {});

const ENABLE_MOCK_API_MIDDLEWARE = process.env.MOCK_API === 'true';
const ENABLE_TEMPLATE_MIDDLEWARE = packageJsonConfig['twig-support'] === true;
const MOCKS_OUTPUT_DIR = resolve(process.cwd(), 'dist', 'node', 'mocks');

const exampleCodeExport = `export default {
  title: 'MyComponent',
  argTypes: {
    ...
  },
  parameters: {
    server: {
      id: 'atoms/my-component',
    },
  },
};`;

const exampleCodeComponent = `export const Default: Story<MyComponentProps> = {
  render: () => ({
    component: MyComponent,
  }),
  parameters: {
    server: {
      id: 'atoms/my-component',
    },
  },
};`

module.exports = async (router) => {
  if (ENABLE_MOCK_API_MIDDLEWARE) {
    const { createMockMiddleware } = await import('@mediamonks/monck');
    router.use('/api/', createMockMiddleware(MOCKS_OUTPUT_DIR));
  }
  if (ENABLE_TEMPLATE_MIDDLEWARE) {
    router.use('/component-templates/', async (req, res) => {
      // Explicitly create a new Twig environment on each request,
      // otherwise it'll cache all the templates
      const { TwingEnvironment, TwingLoaderRelativeFilesystem } = require('twing');
      const env = new TwingEnvironment(
        new TwingLoaderRelativeFilesystem(),
        {
          cache: false,
          auto_reload: true,
        }
      );

      // Add filters or functions to the Twig Environment
      require('../scripts/twig/twig-extensions.cjs').addExtensions(env);

      const componentName = basename(req.path);
      const dirName = dirname(req.path).substring(1);

      try {
        const result = await env.render(join(resolve(__dirname, '../src/components'), dirName, componentName, `${componentName}.twig`), req.query);

        res.send(result);
      } catch (e) {
        if (e.message.includes('Unable to find template')) {
          const msg = `
            <h2>Could not find template "${componentName}"</h2>
            <p>Looking for <b><code>${req.path}</code></b> resolved at <code><b>${/"([^"]+)"/gi.exec(e.message)[1]}</b></code></p>
            <p>Please look at your story parameters to make sure it includes the path to the component folder, like:</p>
            <pre><code>${exampleCodeExport}</code></pre>
            <p>Or for individual stories:</p>
            <pre><code>${exampleCodeComponent}</code></pre>
          `;
          res.send(msg);
        } else {
          const msg = `
            <p>${e.message}</p>
            <pre><code>${e.stack}</code></pre>
          `;
          res.send(msg);
        }
      }
    });
  }
};
