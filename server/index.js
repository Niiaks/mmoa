import "dotenv/config";
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";
import { contributionRouter } from "./routes/contribution.route.js";
import { authRouter } from "./routes/auth.route.js";
import { webhookRouter } from "./routes/webhook.route.js";
import { campaignRouter } from "./routes/campaign.route.js";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import { withdrawalRouter } from "./routes/withdrawal.route.js";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
const app = express();

app.use(
  "/api/v1/webhooks/paystack",
  express.raw({ type: "application/json" }),
  webhookRouter,
);
app.use(helmet());
app.use(
  cors({
    origin: ENV.clientUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
  });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/contributions", contributionRouter);
app.use("/api/v1/campaigns", campaignRouter);
app.use("/api/v1/withdrawals", withdrawalRouter);

//global error
app.use((err, req, res, next) => {
  console.error(err.stack); // Log for debugging
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Oops something broke",
  });
});

let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(ENV.port, () => {
      console.log(`server is running on http://localhost:${ENV.port}`);
    });
  } catch (error) {
    console.error("something in starting server broke:", error);
    process.exit(1);
  }
};

startServer();

const shutdown = () => {
  console.log("interrupt received");

  server.close(async () => {
    //close connections
    await disconnectDB();
    console.log("server closed");
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", (err) => {
  console.error("CRITICAL:", err);
  shutdown();
  setTimeout(() => process.exit(1), 5000).unref();
});
