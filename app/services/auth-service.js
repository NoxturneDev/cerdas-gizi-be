const jwt = require('jsonwebtoken');

async function authentication(req, res, next) {
  // eslint-disable-next-line no-use-before-define
  const authenticate = authenticateRequest(req);

  if (!authenticate.authorized) {
    return res.status(authenticate.statusCode)
      .json({
        status: 'failed',
        message: authenticate.message,
      });
  }

  req.payload = authenticate.decode;
  return next();
}

function authenticateRequest(request) {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  let authorized;

  if (!token) {
    authorized = false;

    return {
      authorized,
      statusCode: 403,
      message: 'Please login',
    };
  }

  return jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (error, decode) => {
    if (error) {
      authorized = false;
      return {
        authorized,
        statusCode: 401,
        message: error,
      };
    }

    authorized = true;
    return {
      statusCode: 200,
      authorized,
      decode,
    };
  });
}

module.exports = { authenticateRequest, authentication };
