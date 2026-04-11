import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const protectedRoute = (req, res, next) => {
  const bearerToken = req.cookies.token;

  if (!bearerToken) {
    return res
      .status(401)
      .json({ success: false, message: "no token in headers" });
  }

  try {
    const decoded = jwt.verify(bearerToken, ENV.jwtSecret);

    const user = {
      id: decoded.sub,
      email: decoded.email,
    };
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: error.message });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: error.message });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Auth Internal server error" });
    }
  }
};
