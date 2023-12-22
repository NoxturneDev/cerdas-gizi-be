const BaseRepository = require('../base/baseRepository');

const prisma = require('../../prisma/prismaClient');

/**
 * @typedef {import('@prisma/client').prisma.userswhereinput} userwhere
 */

class UserRepository extends BaseRepository {
  async createNewUser(data) {
    return super.createData({ data });
  }

  async getUsers() {
    const users = super.getAllData();

    return users;
  }

  async getUserById(userId) {
    const user = await super.getDataByUUID({ uuid: userId, column: 'userId' });

    return user;
  }

  async getUserByPhoneNumber(username) {
    const usersWithPhoneNumber = await super.getDataByUniqueField({ field: 'phoneNumber', value: username });

    return usersWithPhoneNumber;
  }

  async getUserToken(token) {
    const user = await super.getDataByColumnName({ column: 'refreshtoken', value: token });

    return user;
  }

  // async getuserbyroles(roles) {
  //   const checkrolesid = await rolesrepository.getdatabyuuid({uuid: roles, column: 'rolesid'});
  //
  //   if (!checkrolesid) {
  //     return [];
  //   }
  //
  //   return super.getdatabyfilterquery({rolesid: checkrolesid.id});
  // }

  async updateUserById(userId, updateData) {
    const updatedUser = await super.updateDataByUUID({ uuid: userId, column: 'userId', data: updatedata });

    return updatedUser;
  }

  async deleteUserById(userId) {
    const deletedUser = await super.deleteDataByUUID({ uuid: userId, column: 'userId' });

    return deletedUser;
  }
}

const model = 'users';

const include = undefined;

const InitializedUserRepository = new UserRepository({ prisma, include, model });
module.exports = InitializedUserRepository;
