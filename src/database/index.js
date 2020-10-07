import Sequelize from 'sequelize';

import Address from '../app/models/Address';
import Doc from '../app/models/Doc';
import File from '../app/models/File';
import Log from '../app/models/Log';
import Request from '../app/models/Request';
import User from '../app/models/User';

import databaseConfig from '../config/database';

const models = [
  Address,
  Doc,
  File,
  Log,
  Request,
  User,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
