const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const origins = (process.env.CORS_ORIGINS)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (origins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.get("/", (req, res) => res.status(200).send("API OK"));

app.use("/integrations/n8n", require("./routers/n8n.routes"));
app.use("/api", require("./routers/router"));


module.exports = app;
