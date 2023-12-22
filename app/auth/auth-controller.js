const AuthService = require('./auth-service');

async function registerUser(req, res) {
  const newUser = await AuthService.registerNewUser(req.body);

  if (newUser.error) {
    return res.status(newUser.error.statusCode).json({
      status: 'failed',
      message: newUser.error.message,
      users: [],
    });
  }

  return res.status(201).json({
    status: 'success',
    message: 'new user data added!',
    users: newUser,
  });
}

async function loginUser(req, res) {
  const { phoneNumber, password } = req.body;

  const loginRespon = await AuthService.loginUser({ phoneNumber, password });

  if (loginRespon.error) {
    return res.status(loginRespon.error.statusCode).json({
      status: 'failed login',
      message: loginRespon.error.message,
      users: {},
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Success login',
    users: loginRespon.user,
    accessToken: loginRespon.accessToken,
  });
}

async function logoutUser(req, res) {
  try {
    const { userId } = req.body;

    const logoutResult = await AuthService.logoutUser(req);

    if (logoutResult?.error) {
      return res.status(logoutResult.error.statusCode).json({
        status: 'failed logout',
        message: logoutResult.error.message,
        users: {},
      });
    }

    res.clearCookie('refresh_token');
    return res.status(200).json({
      status: 'success',
      message: 'success logout!!',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      message: error.message,
    });
  }
}

module.exports = {
  loginUser, logoutUser, registerUser,
};
