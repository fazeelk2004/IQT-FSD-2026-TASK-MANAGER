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

export default apiLimiter;
