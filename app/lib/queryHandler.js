/* eslint-disable no-restricted-syntax */
const { ApiError } = require('./Error');

/**
 * @param {Array} options Array of possible query collection
 * @param {Object} queries the req.query object from the controller
 * @returns
 */

async function queryHandler(options, queries) {
  const query = {
    isQueryPresent: false,
    option: {},
  };

  console.log();
  // check for every single query
  for (const opt of options) {
    if (queries[opt.param]) {
      query.isQueryPresent = true;
      query.option = opt;
      break;
    } else {
      query.isQueryPresent = false;
    }
  }

  try {
    if (!query.isQueryPresent) return null;

    const { handler, param, error } = query.option;
    const request = await handler(queries[param]);

    if (!request || request?.length <= 0) {
      return new ApiError(404, error, true);
    }

    return request;
  } catch (error) {
    console.log(error);
    return new ApiError(400, error.message, true);
  }
}

module.exports = queryHandler;
