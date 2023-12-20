/* eslint-disable no-use-before-define */
/**
 * @param {Object[] | Object} source single object or array of object data source
 * @param {Array<String>} map array of string to store object keys to be mapped
 * @returns {Object[] | Object} Mapped object or Array of object data
 */

function responseDataMapper(source, map) {
  if (!source.length) {
    return dataMap(source, map);
  }

  return arrayOfObjectDataMapping(source, map);
}

function arrayOfObjectDataMapping(source, map) {
  return source.map((data) => (
    dataMap(data, map)
  ));
}

function dataMap(source, map) {
  if (!map) {
    return source;
  }

  const sourceKeys = Object.keys(source);

  const mapped = sourceKeys.reduce((mappedData, key) => {
    if (map.includes(key)) {
      // eslint-disable-next-line no-param-reassign
      mappedData[key] = source[key];
    }

    return mappedData;
  }, {});

  return mapped;
}

module.exports = responseDataMapper;
