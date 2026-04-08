module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },

      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM("super_admin", "admin", "user"),
        allowNull: false,
        defaultValue: "user",
      },

      status: {
        type: DataTypes.ENUM("active", "inactive" , "unapproved"),
        allowNull: false,
        defaultValue: "unapproved",
      },

      reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      reset_token_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      isTempPassExists: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return User;
};
