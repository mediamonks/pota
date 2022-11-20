const { addExtensions } = require('./twig-extensions.cjs');

const twing = require('twing');

const env = new twing.TwingEnvironment(
  new twing.TwingLoaderRelativeFilesystem()
);

// everything you do in this file, should be also be done in `.storybook/middleware.js`,
// as they both expose a Twig environment, and those should be in sync.

// Add filters or functions to the Twig Environment
addExtensions(env, twing);

module.exports = env;
