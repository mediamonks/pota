/**
 * Converts an object to a string of html attributes
 * @param obj The object with attribute key/values
 * @returns {string} The string with html attributes
 */
function renderAttributes(obj) {
  return Object.entries(obj).map(([key, value]) => `${key}="${value}"`).join(' ');
}

module.exports = {
  renderAttributes,
}
