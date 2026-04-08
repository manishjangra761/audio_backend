module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("audios", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id"
        },
        onDelete: "CASCADE"
      },

      language: {
        type: Sequelize.ENUM("english", "hindi"),
        allowNull: false
      },

      // 🔥 actual audio stored in DB
      audio_file: {
        type: Sequelize.BLOB,
        allowNull: false,
      },

      // 👉 for future cloud storage (optional)
      audio_path: {
        type: Sequelize.STRING,
        allowNull: true
      },

      correct_text: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("audios");
  }
};
