import { Router, type Request, type Response, type NextFunction } from 'express';
import { PlanningRequestSchema } from '../schemas/planning.schema';
import { geminiService } from '../services/gemini.service';
import { planningRateLimiter } from '../middleware/rateLimit.middleware';

import { copilotRouter } from './copilot.routes';

export const planningRouter = Router();

// Endpoint: POST /api/planning/copilot
planningRouter.use('/copilot', copilotRouter);

planningRouter.post(
  '/generate',
  planningRateLimiter,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Validate every field using Zod
      const validatedRequest = PlanningRequestSchema.parse(req.body);

      // 2. Call the server-side Gemini integration
      const generatedPlan = await geminiService.generatePlan(validatedRequest);

      // 3. Return structured JSON matching required schema
      res.status(200).json(generatedPlan);
    } catch (error) {
      next(error);
    }
  }
);
