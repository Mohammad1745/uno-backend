'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chat', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      senderId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'user'
          },
          key: 'id'
        },
        onDelete: 'cascade',
        allowNull: false
      },
      receiverId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'user'
          },
          key: 'id'
        },
        onDelete: 'cascade',
        allowNull: false
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('chat');
  }
};