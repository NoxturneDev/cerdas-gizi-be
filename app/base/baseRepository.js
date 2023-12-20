const prisma = require('prisma')

class BaseRepository {
  /**
   *
   * @param {Object} conf {prisma: prismaClient, model: 'modelName'}
   */
  constructor(conf) {
    const {prisma, model, include} = conf;

    this.defaultPrismaClient = prisma;
    this.prisma = prisma;
    this.model = model;
    this.include = include;
    this.queryParams = null;
  }

  /**
   * @param {Prisma} prismaClient
   * @returns
   */
  bindPrismaTransaction(prismaClient) {
    this.prisma = prismaClient;
    return this;
  }

  removePrismaTransaction() {
    this.prisma = this.defaultPrismaClient;
    return this;
  }

  applySort(sortBy, order) {
    const temp = {
      [sortBy]: order,
    };

    const prismaSort = {
      ...this.queryParams,
      orderBy: {...temp},
    };

    this.queryParams = prismaSort;
    return this;
  }

  applyPagination(itemsPerPage, pageNumber) {
    const parsedParams = {
      itemsPerPage: parseInt(itemsPerPage, 10),
      pageNumber: parseInt(pageNumber, 10),
    };

    const prismaPagination = {
      take: parsedParams.itemsPerPage,
      skip: pageNumber
        ? (parsedParams.pageNumber - 1) * parsedParams.itemsPerPage
        : null,
    };

    const params = {
      ...this.queryParams,
      ...prismaPagination,
    };

    this.queryParams = params;
    return this;
  }

  resetQueryParams() {
    this.queryParams = null;
    return this;
  }

  combineParams() {
    if (!this.queryParams) {
      return;
    }

    const params = Object.keys(this.queryParams);
    const mergedParams = {};

    for (const opt of params) {
      mergedParams[opt] = this.queryParams[opt];
    }

    return mergedParams;
  }

  async createMethod(method) {
    const newMethod = await this.prisma[this.model][method];

    return newMethod;
  }

  /**
   * @returns {Array<Object>} array of all data[model] in database
   */
  async getAllData() {
    const params = this.combineParams();
    const {include} = this;

    const getAllData = await this.prisma[this.model].findMany({
      include,
      ...params,
    });

    return getAllData;
  }

  /**
   * @param {String} id string data id to search
   * @returns {Object} object data with searched id
   */
  async getDataById(id) {
    const parsedId = Number(id);
    const dataById = await this.prisma[this.model].findUnique({
      where: {id: parsedId},
      include: this.include,
    });

    return dataById;
  }

  /**
   * @param {String} field string data id to search
   * @param {String} value string data id to search
   * @returns {Object} object data with searched id
   */
  async getDataByColumnName({column, value}) {
    const params = this.combineParams();
    const where = {[column]: value};

    const dataById = await this.prisma[this.model].findMany({
      where,
      include: this.include,
      ...params,
    });

    return dataById;
  }

  async getDataByUniqueField({field, value}) {
    const uniqueData = await this.prisma[this.model].findUnique({
      where: {[field]: value},
      include: this.include,
    });

    return uniqueData;
  }

  /**
   * @param {ObjectKey} uuid UUID value type string
   * @param {String} column string of object key of the UUID
   * @example
   * Get data by UUID
   * const { modelId } = req.params
   * const data = await YourClass.getDataByUUID(modelId, 'modelId');
   */

  async getDataByUUID({uuid, column}) {
    const where = {[column]: uuid};
    const dataById = await this.prisma[this.model].findUnique({
      where,
      include: this.include,
    });

    return dataById;
  }

  /**
   * @param {Object} query query object parameter
   * @param {Object} includes includes object parameter for relational data
   * @returns {Promise<Object>}
   */
  async getDataByFilterQuery({query}) {
    const params = this.combineParams();

    const dataByQuery = await this.prisma[this.model].findMany({
      where: query,
      include: this.include,
      ...params,
    });

    return dataByQuery;
  }

  /**
   * @param {Object} requestBody object of request body
   * @param {Prisma}  tx transaction prisma
   * @returns {prisma} latest object data that get updated
   */

  async createData({data}) {
    if (!data) return {error: {message: 'data empty/not exist'}};

    const createData = await this.prisma[this.model].create({
      data,
      include: this.include,
    });

    return createData;
  }

  /**
   * @param {String} id string data id to search
   * @param {Object} data object of updated data
   * @returns {Object} latest object data that get updated
   */
  async updateDataById({id, data}) {
    const updateData = await this.prisma[this.model].update({
      where: {
        id: Number(id),
      },
      data,
    });

    return updateData;
  }

  /**
   * @param {ObjectKey} uuid UUID value type string
   * @param {String} column string of object key of the UUID
   * @example
   * Update data by UUID
   * const { modelId } = req.params
   * const data = await ModelFacades.updateDataByUUID({uuid: modelId, key: 'modelId'}, 'modelId');
   */

  async updateDataByUUID({uuid, column, data}) {
    const where = {[column]: uuid};

    const updatedData = await this.prisma[this.model].update({include: this.include, data, where});

    return updatedData;
  }

  /**
   * @param {String} id string data id to search
   * @returns {Object} delete data object
   */
  async deleteById(id) {
    const deleteData = await this.prisma[this.model].delete({
      where: {
        id: Number(id),
      },
    });

    return deleteData;
  }

  /**
   * @param {ObjectKey} uuid UUID value type string
   * @param {String} column string of object key of the UUID
   * @example
   * // delete data by UUID
   * const { modelId } = req.params
   * const data = await YourClass.deleteDataByUUID(modelId, 'modelId');
   */
  async deleteDataByUUID({uuid, column}) {
    const where = {[column]: uuid};

    const deleteData = await this.prisma[this.model].delete({where, include: this.include});

    return deleteData;
  }

  async deleteAllData() {
    const deleteDatas = await this.prisma[this.model].deleteMany();

    return deleteDatas;
  }
}

module.exports = BaseRepository;
