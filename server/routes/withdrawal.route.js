import express from "express";
import { protectedRoute } from "../middleware/auth.js";
import { withdrawMoney, previewWithdrawal } from "../controllers/withdrawal.controller.js";
import { withdrawalLimiter } from "../middleware/rateLimiter.js";

export const withdrawalRouter = express.Router();

withdrawalRouter.use(protectedRoute);
withdrawalRouter.use(withdrawalLimiter);

withdrawalRouter.post("/:id", withdrawMoney);
withdrawalRouter.get("/preview/:id", previewWithdrawal);