import Sequelize, { Model } from 'sequelize';

class Doc extends Model {
  static init(sequelize) {
    super.init(
      {
        doc_type: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'id_file', as: 'file' });
    this.belongsTo(models.Request, { foreignKey: 'id_request', as: 'request' });
  }
}

export default Doc;
