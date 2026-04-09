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
// When behind a proxy (Render/Vercel/NGINX), this is required for secure cookies and correct client IP.
app.set("trust proxy", 1);
app.use(helmet());
// app.use(cors());
const isProd = process.env.NODE_ENV === "production";
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const origins = allowedOrigins;

app.use(
  cors({
    origin(origin, cb) {
      // allow non-browser clients (curl, server-to-server, Postman)
      if (!origin) return cb(null, true);
      if (origins.includes(origin)) return cb(null, true);
      // In local development, allow any localhost/127.0.0.1 port by default
      if (
        !isProd &&
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(origin)
      ) {
        return cb(null, true);
      }
      // In local development, also allow common LAN/private IP origins (for testing from phone)
      if (
        !isProd &&
        /^https?:\/\/(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?\/?$/i.test(
          origin
        )
      ) {
        return cb(null, true);
      }
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
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