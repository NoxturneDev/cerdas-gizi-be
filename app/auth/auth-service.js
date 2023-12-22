const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { decode } = require('jsonwebtoken');
const { ApiError } = require('../lib/Error');
// const queryHandler = require('../lib/queryHandler');
const responseDataMapper = require('../lib/responseDataMapper');
const filterRequestBody = require('../lib/filterRequestBody');

const UserRepository = require('../user/User');

async function passwordChecker(passwordToCheck, correctPassword) {
  const match = await bcrypt.compare(passwordToCheck, correctPassword);
  if (!match) return false;
  return true;
}

async function logoutUser(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  const payload = {};
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (error, decode) => {
    payload.userId = decode.userId;
  });
  try {
    const userLogout = await UserRepository.getUserById(payload.userId);

    if (!userLogout) {
      throw new ApiError(404, `user with id ${payload.userId} is not found`, true);
    }
    await UserRepository.updateUserById(payload.userId, { refreshToken: null });

    return responseDataMapper(userLogout, ['userId', 'name']);
  } catch (error) {
    console.log(error);
    return { error: { message: error.message, statusCode: error.statusCode || 400 } };
  }
}

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

module.exports = {
  loginUser, registerNewUser, logoutUser,
};
