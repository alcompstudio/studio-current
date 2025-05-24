'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const SALT_ROUNDS = 10;
    const passwordHash = await bcrypt.hash('password', SALT_ROUNDS);
    
    await queryInterface.bulkInsert('users', [{
      email: 'admin@taskverse.test',
      password_hash: passwordHash,
      role: 'Администратор',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { 
      email: 'admin@taskverse.test' 
    }, {});
  }
};
