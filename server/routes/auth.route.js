import express from "express";
import { login, registerUser } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.js";

export const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", login);
