const path = require("path");
// Always load backend/.env (cwd-independent — fixes missing DATABASE_URL when nodemon/IDE cwd is not backend/)
require("dotenv").config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 6000;
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require('./src/routes');
const sequelize = require("./config/database");


const app = express();

// Middleware
app.use(helmet());
// app.use(cors());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use('/audios', express.static(path.join(__dirname, 'audios')));

// Test route
app.get("/", (req, res) => {
  res.send({ message: "API is running..." });
});

app.use('/api', routes);

function dbConnectionHint() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    return "DATABASE_URL is not set; using localhost Postgres from config (set DATABASE_URL in backend/.env for Neon).";
  }
  try {
    const normalized = url.replace(/^postgres(ql)?:/i, "http:");
    const { hostname, port } = new URL(normalized);
    return `Trying ${hostname}${port ? `:${port}` : ""} (from DATABASE_URL).`;
  } catch {
    return "DATABASE_URL is set but could not be parsed.";
  }
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error.message || error);
    console.error("   " + dbConnectionHint());
    if (error?.parent?.code === "ETIMEDOUT" || error?.original?.code === "ETIMEDOUT") {
      console.error(
        "   ETIMEDOUT: allow outbound TCP to Postgres (port 5432), try Neon’s direct (non-pooler) URL, or run Node with IPv4 first: node --dns-result-order=ipv4first server.js"
      );
    }
  }
})();


// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


module.exports = app;