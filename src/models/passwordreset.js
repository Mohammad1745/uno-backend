'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordReset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PasswordReset.init({
    userId: {
      type: DataTypes.BIGINT,
      references: {
        model: "user",
        key: 'id'
      },
      onDelete: 'cascade',
      allowNull: false
    },
    code: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    tableName: 'password_reset',
    modelName: 'PasswordReset',
  });
  return PasswordReset;
};