import express from "express";
import {
  getContributions,
  initializePayment,
  verifyPayment,
} from "../controllers/contribution.controller.js";
import { protectedRoute } from "../middleware/auth.js";

export const contributionRouter = express.Router();

contributionRouter.post("/", initializePayment);
contributionRouter.get("/verify", verifyPayment);
contributionRouter.get("/:campaignId", protectedRoute, getContributions);
