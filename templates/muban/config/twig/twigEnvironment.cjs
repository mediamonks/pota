const { addExtensions } = require('./twig-extensions.cjs');
const twing = require('twing');
const { resolve } = require('path');

// everything you do in this file, should be also be done in `.storybook/middleware.js`,
// as they both expose a Twig environment, and those should be in sync.

const inWebpackMode = __dirname === '.';
const pathPrefix = inWebpackMode ? '' : '../../';

const paths = [
  resolve(__dirname, pathPrefix + 'src/components'),
  // Add other component folders here
];

const loader = new twing.TwingLoaderFilesystem();
paths.forEach(path => {
  loader.addPath(path);
});

const env = new twing.TwingEnvironment(loader);

// Add filters or functions to the Twig Environment
addExtensions(env, twing);

module.exports = env;
