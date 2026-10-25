import { z } from 'zod';
import { 
  PlanningRequestSchema, 
  GeneratedPlanSchema, 
  BudgetSchema, 
  TimelineItemSchema, 
  VendorItemSchema, 
  IdeaItemSchema, 
  RiskItemSchema
} from './planning.schema';

export const CopilotRequestSchema = z.object({
  message: z
    .string({ required_error: 'message is required' })
    .trim()
    .min(1, 'message cannot be empty')
    .max(1000, 'message is too long (maximum 1000 characters)'),
  currentPlan: GeneratedPlanSchema,
  eventContext: PlanningRequestSchema,
});

export type CopilotRequest = z.infer<typeof CopilotRequestSchema>;

export const CopilotChangesSchema = z.object({
  budget: BudgetSchema.optional(),
  timeline: z.array(TimelineItemSchema).min(1).optional(),
  vendors: z.array(VendorItemSchema).min(1).optional(),
  ideas: z.array(IdeaItemSchema).min(1).optional(),
  risks: z.array(RiskItemSchema).min(1).optional(),
  missingItems: z.array(z.string().trim().min(1)).min(1).optional(),
});

export type CopilotChanges = z.infer<typeof CopilotChangesSchema>;

export const CopilotResponseSchema = z.object({
  message: z.string().trim().min(1, 'Copilot response message cannot be empty'),
  requiresConfirmation: z.boolean().default(true),
  affectedSections: z.array(z.string().trim().min(1)).default([]),
  changes: CopilotChangesSchema.default({}),
});

export type CopilotResponse = z.infer<typeof CopilotResponseSchema>;
