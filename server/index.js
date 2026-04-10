import "dotenv/config";
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

let server;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
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
