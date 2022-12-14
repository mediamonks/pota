/**
 * Helper to check if the provided data is a Map.
 *
 * @param data
 * @returns {boolean}
 */
function isMap(data) {
  return data instanceof Map;
}

/**
 * This is a bit hacky but there is no real way to detect whether the map is an array or an object,
 * therefore we check if a value exists for the key `0`.
 *
 * @param data
 * @returns {boolean}
 */
function isArray(data) {
  return isMap(data) && data.has(0);
}

/**
 * We assume that all maps that are not arrays can be considered to be objects.
 * @param data
 * @returns {boolean}
 */
function isObject(data) {
  return isMap(data) && !isArray(data);
}

/**
 * The Twing library that is used to parse the *.twig files has some discrepancies when it comes to
 * the data, sometimes they are passed as an object, and sometimes they are passed as a Map
 * which is really annoying when writing these util functions.
 *
 * This util converts the Maps to either objects or arrays so you can create one type of util
 * function that works either way.
 *
 * @param data
 * @returns {any[]|{}|*}
 */
function standardizeTwingData(data) {
  if (isArray(data)) {
    return [...data.values()];
  }

  if (isObject(data)) {
    return Object.fromEntries(
      [...data.entries()].map(([key, value]) => [key, standardizeTwingData(value)]),
    );
  }

  // The Twing library will mark all `undefined` values as `null` which is weird, therefore we
  // force all to `undefined` to be consistent.
  return data ?? undefined;
}

module.exports = {
  isArray,
  standardizeTwingData,
};
