import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { planningRouter } from './routes/planning.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

export const app = express();

// Security: Safe CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or if origin is in whitelist
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

// Security: Request body size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'veyra-planning-backend',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/planning', planningRouter);

// 404 Catch-All for unknown API endpoints
app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
    },
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3001;

// Only start listening if run directly (not during vitest test imports)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Veyra Planning Backend listening on http://localhost:${PORT}`);
    logger.info(`Health check available at http://localhost:${PORT}/health`);
  });
}
