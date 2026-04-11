import express from "express";
import { webhookController } from "../controllers/webhook.controller.js";

export const webhookRouter = express.Router();

webhookRouter.post("/", webhookController);
