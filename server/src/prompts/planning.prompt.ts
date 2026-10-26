import type { PlanningRequest } from '../schemas/planning.schema.js';

/**
 * Requirement 11: Static system instruction module-level constant
 * Avoids reconstructing the static string on every planning request.
 */
export const PLANNING_SYSTEM_INSTRUCTION = `You are Veyra, an elite senior event planning intelligence engine.
Your purpose is to architect comprehensive, mathematically sound, highly practical event blueprints for weddings, birthdays, community gatherings, and bespoke celebrations.

CRITICAL OPERATIONAL RULES:
1. STRICT BUDGET COMPLIANCE:
   - The user's total budget is an absolute ceiling.
   - The sum of all category amounts PLUS the contingency amount MUST exactly equal or be strictly less than the total budget.
   - Contingency must always be included (typically 8% to 15% of the total budget).
   - Each category percentage must accurately reflect amount / total * 100.
2. NO HALLUCINATIONS:
   - Do NOT invent specific vendor company names, phone numbers, email addresses, or real-world addresses.
   - Use generic role categories (e.g., "Boutique Floral Studio", "Local Acoustic Trio", "Heritage Venue").
   - Clearly state that all amounts are expert estimates, not confirmed contracts.
3. CHRONOLOGICAL TIMELINE:
   - Timeline tasks must be sequenced chronologically leading up to and through event day (e.g., "6 months prior", "2 months prior", "Day-of 10:00 AM").
4. "WHAT AM I FORGETTING?" RADAR:
   - The "missingItems" array MUST highlight subtle, practical, frequently overlooked requirements (e.g., vendor meals, generator permits, rain backup decision deadlines, gratuity cash envelopes, restroom ratios).
5. VALID JSON ONLY:
   - Output PURE, RAW JSON matching the exact schema requested.
   - Do NOT wrap your output in markdown code blocks (\`\`\`json ... \`\`\`).
   - Do NOT include conversational filler, greetings, or postscripts.`;

export function buildPlanningSystemInstruction(): string {
  return PLANNING_SYSTEM_INSTRUCTION;
}

export function buildPlanningUserPrompt(req: PlanningRequest): string {
  const preferencesList =
    req.preferences && req.preferences.length > 0
      ? req.preferences.join(', ')
      : 'None specified';

  return `Generate a comprehensive, structured event plan for the following event:

EVENT DETAILS:
- Event Name: ${req.eventName}
- Event Type: ${req.eventType}
- Target Date: ${req.date}
- Target Location/City: ${req.location}
- Expected Guest Count: ${req.guestCount}
- Total Budget: ${req.budget} ${req.currency}
- Desired Style & Aesthetic: ${req.style}
- Specific Preferences & Requirements: ${preferencesList}

REQUIRED JSON SCHEMA STRUCTURE:
{
  "eventSummary": "Concise executive overview of the event concept and execution strategy",
  "budget": {
    "total": ${req.budget},
    "currency": "${req.currency}",
    "categories": [
      {
        "name": "Category Name (e.g. Venue & Rentals, Dining & Bar, Photo & Film)",
        "amount": 200000,
        "percentage": 25,
        "reason": "Why this allocation suits this event style and guest count"
      }
    ],
    "contingency": {
      "amount": ${Math.round(req.budget * 0.1)},
      "percentage": 10
    }
  },
  "timeline": [
    {
      "task": "Milestone or day-of run-sheet item",
      "deadline": "Relative timeframe (e.g. 4 Months Prior, Day-of 03:00 PM)",
      "priority": "high",
      "category": "venue"
    }
  ],
  "vendors": [
    {
      "category": "Vendor specialty (e.g. Catering, Photography, Floral Design)",
      "tasks": ["Specific action items for this vendor category"],
      "questionsToAsk": ["Key qualifying questions to ask before signing contract"]
    }
  ],
  "ideas": [
    {
      "title": "Creative concept title",
      "description": "Specific execution detail",
      "estimatedCost": 15000
    }
  ],
  "risks": [
    {
      "title": "Potential risk name",
      "severity": "medium",
      "solution": "Concrete preventative mitigation plan"
    }
  ],
  "missingItems": [
    "Practical overlooked operational item 1",
    "Practical overlooked operational item 2"
  ]
}

Ensure sum(categories.amount) + contingency.amount <= ${req.budget}.
Return pure raw JSON only.`;
}
