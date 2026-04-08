require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });

const fromEnv = () => {
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    const opts = {
      use_env_variable: "DATABASE_URL",
      dialect: process.env.DB_DIALECT || "postgres",
    };
    if (process.env.DB_SSL !== "false") {
      opts.dialectOptions = {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        keepAlive: true,
        // Neon / remote Postgres: longer connect wait; passed through to node-pg
        connectionTimeoutMillis: parseInt(
          process.env.DB_CONNECTION_TIMEOUT_MS || "20000",
          10
        ),
      };
    }
    return opts;
  }

  return {
    username: process.env.DB_USER || "postgres",
    password:
      process.env.DB_PASSWORD !== undefined && process.env.DB_PASSWORD !== ""
        ? process.env.DB_PASSWORD
        : "postgres",
    database: process.env.DB_NAME || "audio_typing_db",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialect: process.env.DB_DIALECT || "postgres",
  };
};

module.exports = {
  development: fromEnv(),
  test: fromEnv(),
  production: fromEnv(),
};
