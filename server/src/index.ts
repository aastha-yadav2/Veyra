import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { planningRouter } from './routes/planning.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { logger } from './utils/logger.js';

export const app = express();

// Security: Safe CORS configuration supporting both development and production
const isProduction = process.env.NODE_ENV === 'production';

// Gather origins from FRONTEND_URL and CORS_ORIGIN
const configuredOrigins: string[] = [];

if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach((url) => {
    const trimmed = url.trim().replace(/\/+$/, '');
    if (trimmed) configuredOrigins.push(trimmed);
  });
}

if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(',').forEach((url) => {
    const trimmed = url.trim().replace(/\/+$/, '');
    if (trimmed) configuredOrigins.push(trimmed);
  });
}

// In development / test, include local development servers
const defaultDevOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
];

// In production, reject wildcard '*' and allow only configured origins
export const allowedOrigins = isProduction
  ? configuredOrigins.filter((origin) => origin !== '*')
  : Array.from(new Set([...configuredOrigins, ...defaultDevOrigins]));

if (isProduction && allowedOrigins.length === 0) {
  logger.warn(
    '[CORS] In production mode, FRONTEND_URL is not set. Cross-origin browser requests will be blocked.'
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, uptime monitors, health checks)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim().replace(/\/+$/, '');

      // In non-production, check for wildcard
      if (!isProduction && allowedOrigins.includes('*')) {
        return callback(null, true);
      }

      // Exact match against whitelist
      const isAllowed = allowedOrigins.some((allowed) => allowed === normalizedOrigin);

      if (isAllowed) {
        callback(null, true);
      } else {
        logger.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
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
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Veyra Planning Backend listening on http://0.0.0.0:${PORT}`);
    logger.info(`Health check available at http://0.0.0.0:${PORT}/health`);
  });
}
