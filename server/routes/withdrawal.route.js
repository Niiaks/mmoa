import express from "express";
import { protectedRoute } from "../middleware/auth.js";
import { withdrawMoney, previewWithdrawal } from "../controllers/withdrawal.controller.js";

export const withdrawalRouter = express.Router();

withdrawalRouter.post("/:id", protectedRoute, withdrawMoney);
withdrawalRouter.get("/preview/:id", protectedRoute, previewWithdrawal);