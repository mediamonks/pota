const { kebabCase } = require('lodash');

/**
 * Optionally prefixes all object properties,
 * and convert them to kebabCase to align with html attribute conventions.
 * @param source The source object
 * @param prefix What to prepend to the source object keys
 * @returns {*} The newly created object with modified object keys
 */
function objectToAttributes(source, prefix) {
  return Object.entries(source)
    .filter(([, value]) => Boolean(value))
    .reduce(
      (attributes, [key, value]) => ({ ...attributes, [prefix + kebabCase(key)]: value }),
      {},
    );
}

function objectToDataAttributes(source) {
  return objectToAttributes(source, 'data-');
}

module.exports = {
  objectToAttributes,
  objectToDataAttributes,
}
