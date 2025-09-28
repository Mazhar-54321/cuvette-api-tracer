import axios from "axios";
import crypto from "crypto";
export default function logger() {
  return async (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    const logBuffer = [];
    const consoleObj = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };
    ["log", "error", "warn", "info"].forEach((method) => {
      console[method] = (...args) => {
        logBuffer.push({
          timestamp: new Date(),
          type: method,
          message: args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : a))
            .join(" "),
        });
        consoleObj[method](...args);
      };
    });
    res.on("finish", async () => {
      const duration = Date.now() - start;
      Object.keys(consoleObj).forEach((method) => {
        console[method] = consoleObj[method];
      });
      const obj = {
        timestamp: timestamp,
        apiName: req.originalUrl,
        method: req.method,
        traceId: crypto.randomBytes(8).toString("hex"),
        statusCode: res.statusCode,
        responseTimeMs: duration,
        logs: logBuffer,
      };
      try {
        await axios.post(
          "https://cuvette-api-dashboard.onrender.com/log",
          obj,
          {
            headers: {
              "x-api-key": req.headers["x-api-key"],
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    });
    next();
  };
}
