const { TwingEnvironment, TwingLoaderRelativeFilesystem } = require('twing');

const env = new TwingEnvironment(
  new TwingLoaderRelativeFilesystem()
);

module.exports = env;