import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));

    logger.warn('[ErrorHandler] Validation error:', formattedErrors);
    res.status(400).json({
      status: 'error',
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload or schema constraints failed.',
        details: formattedErrors,
      },
    });
    return;
  }

  // Handle SyntaxError (Malformed JSON body)
  if (err instanceof SyntaxError && 'body' in err) {
    logger.warn('[ErrorHandler] Malformed JSON payload received');
    res.status(400).json({
      status: 'error',
      error: {
        code: 'MALFORMED_JSON',
        message: 'Invalid JSON formatted body.',
      },
    });
    return;
  }

  // Handle CORS policy errors
  if (err instanceof Error && err.message.includes('CORS policy')) {
    logger.warn('[ErrorHandler] CORS policy violation:', err.message);
    res.status(403).json({
      status: 'error',
      error: {
        code: 'CORS_FORBIDDEN',
        message: 'Origin not allowed by CORS policy.',
      },
    });
    return;
  }

  // Generic errors
  const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
  logger.error('[ErrorHandler] Internal error:', message);

  res.status(500).json({
    status: 'error',
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to process event planning request. Please try again.',
    },
  });
}
