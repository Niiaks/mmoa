import express from "express";
import {
  getCurrentUser,
  login,
  registerUser,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

export const authRouter = express.Router();

authRouter.post("/register", authLimiter, registerUser);
authRouter.post("/login", authLimiter, login);
authRouter.get("/me", protectedRoute, getCurrentUser);
