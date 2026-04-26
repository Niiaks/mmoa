import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: JSON.stringify({
    status: false,
    message: "too many requests",
  }),
});

export const withdrawalLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: JSON.stringify({
    status: false,
    message: "too many requests",
  }),
});
