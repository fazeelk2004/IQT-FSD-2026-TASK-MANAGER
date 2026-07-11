import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 Minutes
  max: 100, //Max Requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too Many Requests, Please Try Again Later.',
  },
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 Minute
  max: 10, // Max AI Requests Per IP Per Minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too Many AI Requests, Please Slow Down And Try Again Shortly.',
  },
});

export default apiLimiter;
