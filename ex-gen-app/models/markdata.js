'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Markdata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Markdata.belongsTo(models.User)
    }
  };
  Markdata.init({
    userId:  { type: DataTypes.INTEGER, validate: { notEmpty: { msg: 'userIdは必須です' } } },
    title:   { type: DataTypes.STRING,  validate: { notEmpty: { msg: 'titleは必須です' } } },
    content: { type: DataTypes.TEXT,    validate: { notEmpty: { msg: 'contentは必須です' } } }
  }, {
    sequelize,
    modelName: 'Markdata',
  });
  return Markdata;
};