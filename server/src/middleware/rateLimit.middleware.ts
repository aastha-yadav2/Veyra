import rateLimit from 'express-rate-limit';

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000; // 15 minutes default
const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 45; // 45 requests per window

export const planningRateLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many planning requests created from this IP, please try again after 15 minutes.',
    },
  },
});
