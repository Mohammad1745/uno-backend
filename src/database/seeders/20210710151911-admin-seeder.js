'use strict';

const {ADMIN_ROLE} = require('../../helper/core_constants')
const {makeHash} = require('../../helper/helper')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert('user', [{
      firstName: 'Mr',
      lastName: 'Admin',
      email: 'admin@example.com',
      password: makeHash('admin@example.com','123456789'),
      phoneCode: '+880',
      phone: '1857712135',
      isPhoneVerified: true,
      role: ADMIN_ROLE,
      createdAt : new Date(),
      updatedAt : new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('user', {[Op.or]:[{
        email: 'admin@example.com'
      }]})
  }
};
