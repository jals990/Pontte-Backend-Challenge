import Sequelize, { Model } from 'sequelize';

class Log extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        finish: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Request, { foreignKey: 'id_request', as: 'request' });
  }
}

export default Log;
