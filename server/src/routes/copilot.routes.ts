import { Router, type Request, type Response, type NextFunction } from 'express';
import { CopilotRequestSchema } from '../schemas/copilot.schema';
import { copilotService } from '../services/copilot.service';
import { planningRateLimiter } from '../middleware/rateLimit.middleware';

export const copilotRouter = Router();

copilotRouter.post(
  '/',
  planningRateLimiter,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Validate complete incoming payload with Zod (message, currentPlan, eventContext)
      const validatedRequest = CopilotRequestSchema.parse(req.body);

      // 2. Execute plan modification through Copilot service
      const copilotResponse = await copilotService.modifyPlan(validatedRequest);

      // 3. Return structured JSON matching required schema
      res.status(200).json(copilotResponse);
    } catch (error) {
      next(error);
    }
  }
);
