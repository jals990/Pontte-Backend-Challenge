import Sequelize, { Model } from 'sequelize';

class Request extends Model {
  static init(sequelize) {
    super.init(
      {
        price: Sequelize.DECIMAL,
        status: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
    this.hasMany(models.Log, { foreignKey: 'id_request', as: 'logs' });
    this.hasMany(models.Doc, { foreignKey: 'id_request', as: 'docs' });
  }
}

export default Request;
