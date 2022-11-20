const { objectToDataAttributes } = require('./attributes.cjs');
const { renderAttributes } = require('./html.cjs');

/**
 * Allows extending the Twig Environment with custom filers and functions.
 * For more information, see https://nightlycommit.github.io/twing/advanced.html
 *
 * Any custom extensions that we add, should also be added in PHP by the drupal/php team,
 * so our templates work there as well. Best practise is to create enough documentation and/or
 * unit tests to clearly communicate how they work.
 *
 * A few notes:
 * - Objects passed in twig templates are passed as Maps, so you might want to convert them back
 * - If your filter or function is outputting any HTML, you need to mark it a safe, so it won't
 *   escape the output.
 * @param env The Twig Environment
 */
exports.addExtensions = (env, { TwingFunction }) => {
  env.addFunction(new TwingFunction(
    'objectToDataAttributes',
    (dataAttributes) => Promise.resolve(renderAttributes(objectToDataAttributes(Object.fromEntries(dataAttributes)))),
    [{name: 'dataAttributes', defaultValue: {}}],
    { is_safe: ['html'] }
  ));
  // env.addFilter(() => {});
}
