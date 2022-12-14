const { kebabCase } = require('lodash');

const { standardizeTwingData } = require('./standardizeTwingData.cjs');

/**
 * Converts an object to a string of html attributes
 * @param data The object with attribute key/values
 * @param prefix The prefix you want to apply to the attribute
 * @returns {string} The string with html attributes
 */
function toAttributeString(data, prefix = '') {
  const standardizedData = standardizeTwingData(data);

  if (Array.isArray(standardizedData)) {
    throw new Error('Arrays are not supported, please make sure to provide an object.');
  }

  return Object.entries(standardizedData)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${prefix + kebabCase(key)}="${value}"`)
    .join(' ');
}

module.exports = {
  toAttributeString,
};
