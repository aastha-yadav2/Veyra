import { z } from 'zod';

export const SUPPORTED_EVENT_TYPES = [
  'wedding',
  'birthday',
  'community',
  'custom',
  'anniversary',
  'corporate',
  'conference',
  'gala',
] as const;

export const PlanningRequestSchema = z.object({
  eventType: z
    .string({ required_error: 'eventType is required' })
    .trim()
    .min(2, 'eventType must be at least 2 characters')
    .refine(
      (val) => {
        const normalized = val.toLowerCase();
        return (
          SUPPORTED_EVENT_TYPES.includes(normalized as (typeof SUPPORTED_EVENT_TYPES)[number]) ||
          normalized.length >= 3
        );
      },
      { message: 'Invalid or unsupported eventType' }
    ),
  eventName: z
    .string({ required_error: 'eventName is required' })
    .trim()
    .min(2, 'eventName must be at least 2 characters')
    .max(120, 'eventName must not exceed 120 characters'),
  date: z
    .string({ required_error: 'date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD')
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: 'date must be a valid calendar date',
    }),
  location: z
    .string({ required_error: 'location is required' })
    .trim()
    .min(2, 'location must be at least 2 characters')
    .max(150, 'location must not exceed 150 characters'),
  guestCount: z
    .number({ required_error: 'guestCount is required' })
    .finite('guestCount must be a finite number')
    .int('guestCount must be an integer')
    .positive('guestCount must be greater than zero')
    .max(50000, 'guestCount cannot exceed 50,000'),
  budget: z
    .number({ required_error: 'budget is required' })
    .finite('budget must be a finite number')
    .positive('budget must be greater than zero')
    .max(1_000_000_000, 'budget must be realistic'),
  currency: z
    .string()
    .trim()
    .min(2, 'currency must be at least 2 characters')
    .max(10, 'currency must not exceed 10 characters')
    .default('INR'),
  style: z
    .string()
    .trim()
    .min(2, 'style must be at least 2 characters')
    .max(100, 'style must not exceed 100 characters')
    .optional()
    .default('elegant minimal'),
  preferences: z
    .array(z.string().trim().min(1, 'preference items cannot be empty'))
    .optional()
    .default([]),
});

export type PlanningRequest = z.infer<typeof PlanningRequestSchema>;

export const BudgetCategorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
  amount: z.number().finite('Amount must be finite').nonnegative('Category amount must be non-negative'),
  percentage: z.number().finite('Percentage must be finite').min(0).max(100, 'Percentage must be between 0 and 100'),
  reason: z.string().trim().min(1, 'Category reason is required'),
});

export const ContingencySchema = z.object({
  amount: z.number().finite('Contingency amount must be finite').positive('Contingency amount must be greater than zero'),
  percentage: z.number().finite('Contingency percentage must be finite').min(1).max(50, 'Contingency percentage must be reasonable (1-50%)'),
});

export const BudgetSchema = z
  .object({
    total: z.number().finite('Total budget must be finite').positive('Total budget must be positive'),
    currency: z.string().min(1, 'Currency is required'),
    categories: z.array(BudgetCategorySchema).min(1, 'At least one budget category is required'),
    contingency: ContingencySchema,
  })
  .superRefine((budget, ctx) => {
    const categoriesSum = budget.categories.reduce((acc, cat) => acc + cat.amount, 0);
    const overallSum = categoriesSum + budget.contingency.amount;

    // Allow slight float rounding variance of 1.0
    if (overallSum > budget.total + 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Budget category totals (${categoriesSum}) + contingency (${budget.contingency.amount}) = ${overallSum}, which exceeds the total allowed budget of ${budget.total}`,
        path: ['categories'],
      });
    }
  });

export const TimelineItemSchema = z.object({
  task: z.string().trim().min(1, 'Timeline task is required'),
  deadline: z.string().trim().min(1, 'Timeline deadline is required'),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.string().trim().min(1, 'Timeline category is required'),
});

export const VendorItemSchema = z.object({
  category: z.string().trim().min(1, 'Vendor category is required'),
  tasks: z.array(z.string().trim().min(1)).min(1, 'At least one vendor task is required'),
  questionsToAsk: z.array(z.string().trim().min(1)).min(1, 'At least one question is required'),
});

export const IdeaItemSchema = z.object({
  title: z.string().trim().min(1, 'Idea title is required'),
  description: z.string().trim().min(1, 'Idea description is required'),
  estimatedCost: z.number().nonnegative('Estimated cost must be non-negative'),
});

export const RiskItemSchema = z.object({
  title: z.string().trim().min(1, 'Risk title is required'),
  severity: z.enum(['high', 'medium', 'low']),
  solution: z.string().trim().min(1, 'Risk solution is required'),
});

export const GeneratedPlanSchema = z.object({
  eventSummary: z.string().trim().min(10, 'Event summary must be meaningful'),
  budget: BudgetSchema,
  timeline: z.array(TimelineItemSchema).min(2, 'Timeline must contain at least 2 milestones'),
  vendors: z.array(VendorItemSchema).min(1, 'At least one vendor group is required'),
  ideas: z.array(IdeaItemSchema).min(1, 'At least one idea is required'),
  risks: z.array(RiskItemSchema).min(1, 'At least one risk must be identified'),
  missingItems: z.array(z.string().trim().min(1)).min(1, 'At least one missing item must be listed'),
});

export type GeneratedPlan = z.infer<typeof GeneratedPlanSchema>;
