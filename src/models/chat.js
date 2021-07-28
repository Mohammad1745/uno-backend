'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  chat.init({
    senderId: {
      type: DataTypes.BIGINT,
      references: {
        model: "user",
        key: 'id'
      },
      onDelete: 'cascade',
      allowNull: false
    },
    receiverId: {
      type: DataTypes.BIGINT,
      references: {
        model: "user",
        key: 'id'
      },
      onDelete: 'cascade',
      allowNull: false
    },
    content: {
      type:DataTypes.STRING,
      allowNull:false
    }
  }, {
    sequelize,
    tableName: 'chat',
    modelName: 'Chat',
  });
  return chat;
};