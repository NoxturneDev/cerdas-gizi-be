/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../lib/Error');
const queryHandler = require('../lib/queryHandler');
const responseDataMapper = require('../lib/responseDataMapper');
const filterRequestBody = require('../lib/filterRequestBody');

const UserRepository = require('./User');

/**
 * @typedef {import('@prisma/client').Prisma.usersCreateInput} UsersCreateInput
 */

// ----------------------------------------------------------------------
// API USER SERVICES
// ----------------------------------------------------------------------

// GET
async function getAllUsers(queries) {
  const {
    sort, order, page = 1, pageSize = 10,
  } = queries;

  try {
    if (sort) {
      UserRepository.applySort(sort, order);
    }

    UserRepository.applyPagination(pageSize, page);

    const userQuery = [{
      param: 'phoneNumber',
      handler: async (phoneNumber) => UserRepository.getUserByPhoneNumber(phoneNumber),
      error: 'no users with phone number found',
    }];

    const users = (await queryHandler(userQuery, queries)) || (await UserRepository.getUsers());

    return responseDataMapper(users, ['userId', 'name', 'phoneNumber']);
  } catch (error) {
    console.log(error);
    return { error: { message: error.message, statusCode: error.statusCode || 400 } };
  }
}

async function getUserById(userId) {
  try {
    const user = await UserRepository.getUserById(userId);

    // empty data checking
    if (!user) {
      throw new ApiError(404, `user with id of ${userId} not found`);
    }

    return user;
  } catch (error) {
    console.log(error);
    return { error: { message: error.message, statusCode: error.statusCode || 400 } };
  }
}

// PATCH
async function updateUserInformation(userId, data) {
  const filteredReq = filterRequestBody(data, 'rolesId');
  const updateData = { ...filteredReq, updatedAt: new Date() };

  try {
    const updatedUser = await UserRepository.updateUserById(userId, updateData);

    if (!updatedUser) {
      throw new ApiError(404, `user with id ${userId} is not found`, true);
    }

    return responseDataMapper(updatedUser, ['userId', 'name', 'phoneNumber']);
  } catch (error) {
    console.log(error);
    return { error: { message: error.message, statusCode: error.statusCode || 400 } };
  }
}

// DELETE
async function deleteUser(userId) {
  try {
    const deletedUser = await UserRepository.deleteDataByUUID(userId, 'userId');

    if (!deletedUser) {
      throw new ApiError(404, `user with id ${userId} is not found`, true);
    }

    return responseDataMapper(deletedUser, ['userId', 'name']);
  } catch (error) {
    console.log(error);
    return { error: { message: error.message, statusCode: error.statusCode || 400 } };
  }
}

async function logoutUser(userId) {
  try {
    const userLogout = await UserRepository.getUserById(userId, 'userId');

    if (!userLogout) {
      throw new ApiError(404, `user with id ${userId} is not found`, true);
    }

    return responseDataMapper(userLogout, ['userId', 'name']);
  } catch (error) {
    console.log(error);
    return { error: { message: error.message, statusCode: error.statusCode || 400 } };
  }
}

// TODO: Logout functionality
// LOGIN & REGISTER
async function loginUser(credentials) {
  try {
    const { phoneNumber, password } = credentials;

    const user = await UserRepository.getUserByPhoneNumber(phoneNumber);

    if (!user) {
      throw new ApiError(404, `user with username ${phoneNumber} is not found`, true);
    }

    const passwordCheck = await passwordChecker(password, user.password);
    if (!passwordCheck) {
      throw new ApiError(403, 'wrong password');
    }

    const accessToken = jwt.sign({
      userId: user.userId,
    }, process.env.SECRET_ACCESS_TOKEN, {
      expiresIn: '30d',
    });

    // todo : send roles permission data also
    const refreshToken = jwt.sign({ id: user.id }, process.env.SECRET_REFRESH_TOKEN, {
      expiresIn: '40d',
    });

    await UserRepository.updateUserById(user.userId, { refreshToken });

    return {
      user, accessToken,
    };
  } catch (error) {
    console.log(error);
    return { error: { message: error.message, statusCode: error.statusCode || 400 } };
  }
}

async function registerNewUser(data) {
  const filteredReq = filterRequestBody(data, ['password']);
  const userId = data.userId !== undefined ? data.userId : uuidv4();
  const createdAt = new Date();
  const updatedAt = createdAt;

  try {
    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash(data.password, salt);

    /**
     * @type {UsersCreateInput}
     */
    const newUserData = {
      ...filteredReq, userId, createdAt, updatedAt, password: cryptedPassword,
    };

    // const existingPhoneNumber = await checkExistingPhoneNumber(data.phoneNumber);

    // if (existingPhoneNumber) {
    //   throw new ApiError(400, 'phone number already exist', true);
    // }

    const newUser = await UserRepository.createNewUser(newUserData);

    if (newUser.error) {
      throw new ApiError('400', newUser.error?.message, true);
    }

    return responseDataMapper(newUser, ['userId', 'phoneNumber', 'name']);
  } catch (error) {
    console.log(error);
    return { error: { message: error.message, statusCode: error.statusCode || 400 } };
  }
}

// ----------------------------------------------------------------------
// utility functions for user service
// ----------------------------------------------------------------------
async function checkExistingPhoneNumber(phoneNumber) {
  const getExistingUser = await UserRepository.getUserByPhoneNumber(phoneNumber);

  if (getExistingUser) return true;

  return false;
}

async function passwordChecker(passwordToCheck, correctPassword) {
  const match = await bcrypt.compare(passwordToCheck, correctPassword);

  if (!match) return false;

  return true;
}

module.exports = {
  getAllUsers, getUserById, logoutUser, updateUserInformation, deleteUser, registerNewUser,
};
