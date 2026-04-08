'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('contact_messages', 
      {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },

      form_type: {
        type: Sequelize.ENUM('contact', 'feedback'),
        allowNull: false,
        defaultValue: 'contact'
      },

      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM('unread', 'read'),
        defaultValue: 'unread'
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }

    });

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('contact_messages');

  }
};
