'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('attempts', 'correct_words', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('attempts', 'wrong_words', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('attempts', 'attempt_type', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('attempts', 'correct_words');
    await queryInterface.removeColumn('attempts', 'wrong_words');
    await queryInterface.removeColumn('attempts', 'attempt_type');
  },
};
