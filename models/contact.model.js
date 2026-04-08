module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define(
        "Contact",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },

            email: {
                type: DataTypes.STRING(150),
                allowNull: false
            },

            phone: {
                type: DataTypes.STRING(20),
                allowNull: true
            },

            form_type: {
                type: DataTypes.ENUM('contact', 'feedback'),
                allowNull: false,
                defaultValue: 'contact'
            },

            message: {
                type: DataTypes.TEXT,
                allowNull: false
            },

            status: {
                type: DataTypes.ENUM('unread', 'read'),
                defaultValue: 'unread'
            }

        },
        {
            tableName: "contact_messages",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    );

    return Contact;
};
