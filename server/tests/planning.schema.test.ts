import { describe, it, expect } from 'vitest';
import { 
  PlanningRequestSchema, 
  BudgetSchema, 
  GeneratedPlanSchema 
} from '../src/schemas/planning.schema';

describe('Planning Schema & Validation Suite', () => {
  const validRequestPayload = {
    eventType: 'wedding',
    eventName: 'Aarav & Aastha Wedding',
    date: '2026-12-20',
    location: 'Dehradun',
    guestCount: 250,
    budget: 800000,
    currency: 'INR',
    style: 'elegant minimal',
    preferences: ['vegetarian food', 'minimal decoration'],
  };

  const validGeneratedPlanPayload = {
    eventSummary: 'A curated minimal wedding celebration in Dehradun.',
    budget: {
      total: 800000,
      currency: 'INR',
      categories: [
        {
          name: 'Venue & Lawns',
          amount: 250000,
          percentage: 31,
          reason: 'Scenic property booking for 250 guests',
        },
        {
          name: 'Vegetarian Catering',
          amount: 320000,
          percentage: 40,
          reason: 'Buffet dining and welcome tea',
        },
        {
          name: 'Photography & Film',
          amount: 150000,
          percentage: 19,
          reason: 'Two candid photographers',
        },
      ],
      contingency: {
        amount: 80000,
        percentage: 10,
      },
    },
    timeline: [
      {
        task: 'Finalize venue deposit',
        deadline: '6 Months Prior',
        priority: 'high' as const,
        category: 'venue',
      },
      {
        task: 'Menu tasting and final dietary count',
        deadline: '1 Month Prior',
        priority: 'high' as const,
        category: 'catering',
      },
    ],
    vendors: [
      {
        category: 'Catering',
        tasks: ['Shortlist caterers', 'Compare menus', 'Confirm final guest count'],
        questionsToAsk: ['Is service staff included?'],
      },
    ],
    ideas: [
      {
        title: 'Minimal Marigold & Brass Decor',
        description: 'Understated organic marigold garlands with warm brass oil lamps.',
        estimatedCost: 15000,
      },
    ],
    risks: [
      {
        title: 'Winter evening chill in Dehradun',
        severity: 'medium' as const,
        solution: 'Arrange gas heaters and warm chai stations.',
      },
    ],
    missingItems: ['Guest transportation from station', 'Emergency contact sheet'],
  };

  // Test 1: Valid request
  it('validates a correct and complete request successfully', () => {
    const result = PlanningRequestSchema.safeParse(validRequestPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.eventName).toBe('Aarav & Aastha Wedding');
      expect(result.data.budget).toBe(800000);
    }
  });

  // Test 2: Invalid event type
  it('rejects an invalid event type', () => {
    const invalidPayload = {
      ...validRequestPayload,
      eventType: 'x', // too short / unsupported
    };
    const result = PlanningRequestSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('eventType'));
      expect(issue).toBeDefined();
    }
  });

  // Test 3: Negative budget
  it('rejects a negative budget', () => {
    const invalidPayload = {
      ...validRequestPayload,
      budget: -50000,
    };
    const result = PlanningRequestSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('budget'));
      expect(issue?.message).toContain('greater than zero');
    }
  });

  // Test 4: Invalid guest count (zero or negative or non-integer)
  it('rejects invalid guest count', () => {
    const zeroGuests = { ...validRequestPayload, guestCount: 0 };
    expect(PlanningRequestSchema.safeParse(zeroGuests).success).toBe(false);

    const floatGuests = { ...validRequestPayload, guestCount: 15.5 };
    expect(PlanningRequestSchema.safeParse(floatGuests).success).toBe(false);

    const negativeGuests = { ...validRequestPayload, guestCount: -10 };
    expect(PlanningRequestSchema.safeParse(negativeGuests).success).toBe(false);
  });

  // Test 5: Missing required fields
  it('rejects request with missing required fields', () => {
    const missingFieldsPayload = {
      eventType: 'wedding',
      // missing eventName, date, location, guestCount, budget
    };
    const result = PlanningRequestSchema.safeParse(missingFieldsPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('eventName');
      expect(paths).toContain('date');
      expect(paths).toContain('location');
      expect(paths).toContain('guestCount');
      expect(paths).toContain('budget');
    }
  });

  // Test 6: Budget schema validation
  it('validates a compliant budget schema structure', () => {
    const budgetPayload = validGeneratedPlanPayload.budget;
    const result = BudgetSchema.safeParse(budgetPayload);
    expect(result.success).toBe(true);
  });

  // Test 7: AI response schema validation
  it('validates a complete, compliant AI response plan', () => {
    const result = GeneratedPlanSchema.safeParse(validGeneratedPlanPayload);
    expect(result.success).toBe(true);
  });

  // Test 8: Budget total exceeding allowed amount
  it('rejects budget where categories + contingency exceeds total budget', () => {
    const overAllocatedBudget = {
      total: 500000,
      currency: 'INR',
      categories: [
        { name: 'Venue', amount: 350000, percentage: 70, reason: 'Venue booking' },
        { name: 'Catering', amount: 200000, percentage: 40, reason: 'Food' }, // 350k + 200k = 550k already > 500k
      ],
      contingency: {
        amount: 50000,
        percentage: 10,
      },
    };
    const result = BudgetSchema.safeParse(overAllocatedBudget);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues[0];
      expect(issue.message).toContain('exceeds the total allowed budget');
    }
  });

  // Test 9: Malformed AI response (missing required sections, bad types)
  it('rejects malformed AI responses with missing keys or invalid structures', () => {
    const malformedPlans = [
      // Missing timeline and vendors
      {
        eventSummary: 'Short',
        budget: validGeneratedPlanPayload.budget,
      },
      // Missing contingency in budget
      {
        ...validGeneratedPlanPayload,
        budget: {
          total: 800000,
          currency: 'INR',
          categories: validGeneratedPlanPayload.budget.categories,
        },
      },
      // Empty timeline
      {
        ...validGeneratedPlanPayload,
        timeline: [],
      },
    ];

    malformedPlans.forEach((badPlan) => {
      const result = GeneratedPlanSchema.safeParse(badPlan);
      expect(result.success).toBe(false);
    });
  });
});
