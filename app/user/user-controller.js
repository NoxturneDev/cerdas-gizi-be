const jwt = require('jsonwebtoken');
const userService = require('./user-service');

// Test Passed
async function getAllUsers(req, res) {
  const users = await userService.getAllUsers(req.query);

  if (users?.error) {
    return res.status(users.error.statusCode).json({
      status: 'failed',
      message: users.error.message,
      users: [],
    });
  }

  if (users?.length < 1) {
    return res.status(200).json({
      status: 'success',
      message: 'users data empty',
      users: [],
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'all users data found',
    users,
  });
}

// Test Passed
async function getUserById(req, res) {
  const { userId } = req.params;

  const user = await userService.getUserById(userId);

  if (user.error) {
    return res.status(user.error.statusCode).json({
      status: 'failed',
      message: user.error.message,
      users: {},
    });
  }

  return res.status(200).json({
    status: 'success',
    message: `user with id: ${userId} found.`,
    users: user,
  });
}

// Test Passed
async function registerUser(req, res) {
  const newUser = await userService.registerNewUser(req.body);

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

// Test Passed
async function updateDataUserById(req, res) {
  const { userId } = req.params;

  const updatedUser = await userService.updateUserInformation(userId, req.body);

  if (updatedUser.error) {
    return res.status(updatedUser.error.statusCode).json({
      status: 'failed',
      message: updatedUser.error.message,
      users: {},
    });
  }

  return res.status(201).json({
    status: 'success',
    message: 'user updated',
    users: updatedUser,
  });
}

// Test Passed
async function deleteDataUserById(req, res) {
  const { userId } = req.params;

  const deletedUser = await userService.deleteUser(userId, 'userId');

  if (deletedUser.error) {
    return res.status(deletedUser.error.statusCode).json({
      status: 'failed',
      message: deletedUser.error.message,
      users: {},
    });
  }

  return res.status(200).json({
    status: 'success',
    message: `user with id: ${userId} deleted.`,
  });
}

// USER SERVICES API CONTROLLER
async function loginUser(req, res) {
  const { phoneNumber, password } = req.body;

  const loginResp = await userService.loginUser({ phoneNumber, password });

  if (loginResp.error) {
    return res.status(loginResp.error.statusCode).json({
      status: 'failed',
      message: loginResp.error.message,
      users: {},
    });
  }

  // res.cookie('refreshToken', loginResp.refreshToken, {
  //   httpOnly: true,
  //   maxAge: 24 * 60 * 60 * 1000,
  //   secure: true,
  //   sameSite: 'None',
  // });

  return res.status(200).json({
    status: 'success',
    message: 'login success',
    user: loginResp.user,
    accessToken: loginResp.accessToken,
  });
}

async function logoutUser(req, res) {
  try {
    const { userId } = req.body;

    const logoutResult = await userService.logoutUser(userId);

    if (logoutResult.error) {
      return res.status(logoutResult.error.statusCode).json({
        status: 'failed logout',
        message: logoutResult.error.message,
        users: {},
      });
    }

    res.clearCookie('refreshToken');
    return res.status(200).json({
      status: 'success',
      message: 'Success Logout!',

    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      message: error.message,
    });
  }
}

// DEVELOPMENT ONLY API
// async function deleteAllUserData(req, res) {
//   try {
//     await UserReposity.deleteAllData();
//
//     return res.status(200).json({
//       status: 'success',
//       message: 'succesfully delete all user data',
//       users: [],
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 'failed',
//       message: error.message,
//     });
//   }
// }

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  logoutUser,
  updateDataUserById,
  deleteDataUserById,
  // deleteAllUserData,
  loginUser,
};
