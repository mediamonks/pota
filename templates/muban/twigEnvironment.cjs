const { addExtensions } = require('./config/twig/twig-extensions.cjs');

const { TwingEnvironment, TwingLoaderRelativeFilesystem } = require('twing');

const env = new TwingEnvironment(
  new TwingLoaderRelativeFilesystem()
);

// everything you do in this file, should be also be done in `.storybook/middleware.js`,
// as they both expose a Twig environment, and those should be in sync.

// Add filters or functions to the Twig Environment
addExtensions(env);

module.exports = env;
