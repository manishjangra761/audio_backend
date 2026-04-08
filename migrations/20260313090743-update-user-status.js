"use strict";

module.exports = {
  async up(queryInterface) {
    const [rows] = await queryInterface.sequelize.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_enum e
        INNER JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'enum_users_status' AND e.enumlabel = 'unapproved'
      ) AS already_added;
    `);
    if (!rows[0]?.already_added) {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_users_status" ADD VALUE 'unapproved';`
      );
    }
    await queryInterface.sequelize.query(`
      ALTER TABLE users ALTER COLUMN status SET DEFAULT 'unapproved';
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE users SET status = 'inactive' WHERE status::text = 'unapproved';
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE users ALTER COLUMN status SET DEFAULT 'inactive';
    `);
  },
};
