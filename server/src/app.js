import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import apiLimiter from './middleware/rateLimiter.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// 1. Security headers
app.use(helmet());

// 2. Cross-origin resource sharing.
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// 3. Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 4. Rate limiting
app.use('/api', apiLimiter);

// 5. Application routes.
app.use('/api', routes);

// 6. Unmatched routes -> 404.
app.use(notFound);

// 7. Centralized error handler
app.use(errorHandler);

export default app;
