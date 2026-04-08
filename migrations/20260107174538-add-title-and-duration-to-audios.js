'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add 'title' column
    await queryInterface.addColumn('audios', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('audios', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove columns if rolling back
    await queryInterface.removeColumn('audios', 'title');
    await queryInterface.removeColumn('audios', 'duration');
  }
};
