const { jsonScriptTemplate } = require('@muban/template');
const classNames = require('clsx');

const { standardizeTwingData, isArray } = require('./helpers/standardizeTwingData.cjs');
const { toDataAttributeString } = require('./helpers/toDataAttributesString.cjs');
const { toAttributeString } = require('./helpers/toAttributeString.cjs');

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
 *
 * @param env The Twig Environment
 */
exports.addExtensions = (env, { TwingFunction, TwingTest }) => {
  env.addFunction(
    new TwingFunction(
      'objectToDataAttributes',
      async (data = {}) => toDataAttributeString(data),
      [{ name: 'dataAttributes', defaultValue: {} }],
      { is_safe: ['html'] },
    ),
  );
  env.addFunction(
    new TwingFunction(
      'objectToAttributes',
      async (data) => toAttributeString(data),
      [{ name: 'attributes', defaultValue: {} }],
      { is_safe: ['html'] },
    ),
  );
  env.addFunction(
    new TwingFunction(
      'classNames',
      async (...names) =>
        Promise.resolve(classNames(names.map((name) => standardizeTwingData(name)))),
      [],
    ),
  );
  env.addFunction(
    new TwingFunction(
      'jsonScriptTemplate',
      async (data) => jsonScriptTemplate(standardizeTwingData(data)),
      [],
      { is_safe: ['html'] },
    ),
  );
  env.addTest(
    new TwingTest(
      'typeof',
      (variable, type) => {
        if (type === 'array') {
          return Promise.resolve(Array.isArray(variable) || isArray(variable));
        }
        return Promise.resolve(typeof variable === type);
      },
      [],
    ),
  );
};
