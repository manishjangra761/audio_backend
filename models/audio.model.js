module.exports = (sequelize, DataTypes) => {
  const Audio = sequelize.define(
    "Audio",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      language: {
        type: DataTypes.ENUM("english", "hindi"),
        allowNull: false,
      },

      audio_file: {
        type: DataTypes.BLOB,
        allowNull: false,
      },

      audio_path: {
        type: DataTypes.STRING, // optional cloud/local path
        allowNull: true,
      },

      correct_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    },
    {
      tableName: "audios",
      timestamps: true,
    }
  );

  Audio.associate = models => {
    Audio.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
      onDelete: "CASCADE",
    });

    // Example: audio attempts by users
    // Audio.hasMany(models.Attempt, { foreignKey: "audio_id" });
  };

  return Audio;
};
