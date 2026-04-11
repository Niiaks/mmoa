import "dotenv/config";
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";
import { contributionRouter } from "./routes/contribution.route.js";
import { authRouter } from "./routes/auth.route.js";
import { webhookRouter } from "./routes/webhook.route.js";
import { campaignRouter } from "./routes/campaign.route.js";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
const app = express();
app.use("/api/v1/webhook", webhookRouter);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/contributions", contributionRouter);
app.use("/api/v1/campaigns", campaignRouter);

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
