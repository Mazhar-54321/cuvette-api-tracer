import mongoose from "mongoose";
import database from "./database.js";
import express from 'express'
database();
// Request log schema
const requestSchema = new mongoose.Schema({
  method: String,
  url: String,
  body: mongoose.Schema.Types.Mixed,
  query: mongoose.Schema.Types.Mixed,
  params: mongoose.Schema.Types.Mixed,
  headers: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});

let RequestLog;
function initModel() {
  if (!RequestLog) RequestLog = mongoose.models.RequestLog || mongoose.model("RequestLog", requestSchema);
}

/**
 * Middleware factory
 * @param {Object} options - { mongoUri: 'your mongodb uri' }
 */
export function logger(options = {}) {
  const { mongoUri } = options;
  if (!mongoUri) throw new Error("cuvette-api-tracer: mongoUri is required");

  mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("cuvette-api-tracer: MongoDB connected"))
    .catch(err => console.error("cuvette-api-tracer: MongoDB connection error", err));

  initModel();

  return async (req, res, next) => {
    try {
      const log = new RequestLog({
        method: req.method,
        url: req.url,
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers
      });
      await log.save();
    } catch (err) {
      console.error("cuvette-api-tracer: failed to save log", err);
    }

    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  };
}
const app = express();
app.use(express.json())
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Central logger running on port ${PORT}`));
