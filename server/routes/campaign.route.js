import express from "express";
import {
  closeCampaign,
  createCampaign,
  extendDeadline,
  getCampaign,
  getOrganizerCampaign,
} from "../controllers/campaign.controller.js";
import { protectedRoute } from "../middleware/auth.js";

export const campaignRouter = express.Router();

campaignRouter.post("/", protectedRoute, createCampaign);
campaignRouter.get("/me", protectedRoute, getOrganizerCampaign);
campaignRouter.get("/:slug", getCampaign);
campaignRouter.patch("/:id/close", protectedRoute, closeCampaign);
campaignRouter.patch("/:id/extend", protectedRoute, extendDeadline);
