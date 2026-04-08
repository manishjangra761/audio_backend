module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("attempts", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },


      audio_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "audios",
          key: "id"
        },
        onDelete: "CASCADE"
      },

      typed_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      accuracy: {
        type: Sequelize.FLOAT,
        allowNull: false
      },

      score: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("attempts");
  }
};
