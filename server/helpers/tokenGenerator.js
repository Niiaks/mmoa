import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateToken = (id, email) => {
  const token = jwt.sign({ sub: id, email }, ENV.jwtSecret, {
    expiresIn: "15m",
  });
  return token;
};
