import { rateLimit, ipKeyGenerator } from "express-rate-limit";

const tooManyRequestsHandler = (_req, res) => {
  return res.status(429).json({
    success: false,
    message: "too many requests",
  });
};
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: tooManyRequestsHandler,
});

export const withdrawalLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || ipKeyGenerator(req.ip, 56);
  },
  handler: tooManyRequestsHandler,
});
