const { toAttributeString } = require('./toAttributeString.cjs');

/**
 * Convert arguments to data-attributes
 *
 * @param data
 * @returns {*}
 */
function toDataAttributeString(data) {
  return toAttributeString(data, 'data-');
}

module.exports = {
  toDataAttributeString,
};
