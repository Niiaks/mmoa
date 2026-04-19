import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateToken = (id, email, name) => {
  const token = jwt.sign({ sub: id, email, name }, ENV.jwtSecret, {
    expiresIn: "15m",
  });
  return token;
};
