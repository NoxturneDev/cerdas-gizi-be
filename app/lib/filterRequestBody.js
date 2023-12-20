/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
// TODO: add security checking too
function filterRequestBody(reqBody, exclude) {
  if (!exclude) return reqBody;

  const filtered = {};
  for (const body in reqBody) {
    if (!exclude.includes(body)) {
      filtered[body] = reqBody[body];
    }
  }

  return filtered;
}

module.exports = filterRequestBody;
