module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "categories",
      timestamps: true, // because you have createdAt & updatedAt
    }
  );

//   Category.associate = models => {
//     // Example: Category has many Audios
//     // Category.hasMany(models.Audio, { foreignKey: "category_id" });
//   };

  return Category;
};
