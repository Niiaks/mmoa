import express from "express";
import { protectedRoute } from "../middleware/auth.js";
import { withdrawMoney } from "../controllers/withdrawal.controller.js";

export const withdrawalRouter = express.Router();

withdrawalRouter.post("/", protectedRoute, withdrawMoney);
