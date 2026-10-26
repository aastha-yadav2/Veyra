import { geminiService } from './gemini.service.js';
import { 
  CopilotResponseSchema, 
  type CopilotRequest, 
  type CopilotResponse,
  type CopilotChanges
} from '../schemas/copilot.schema.js';
import { 
  buildCopilotSystemInstruction, 
  buildCopilotUserPrompt 
} from '../prompts/copilot.prompt.js';
import { logger } from '../utils/logger.js';

export class CopilotService {
  /**
   * Modifies an existing plan using Gemini AI or deterministic fallback
   */
  public async modifyPlan(request: CopilotRequest): Promise<CopilotResponse> {
    logger.info(`[CopilotService] Processing request: "${request.message}" for event "${request.eventContext.eventName}"`);

    const client = geminiService.getClient();

    // If no client available (offline/mock/no API key), use deterministic fallback
    if (!client) {
      return this.generateDeterministicCopilotResponse(request);
    }

    const systemInstruction = buildCopilotSystemInstruction();
    const userPrompt = buildCopilotUserPrompt(request);

    try {
      const model = client.getGenerativeModel({
        model: geminiService.getModelName(),
        systemInstruction,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const result = await model.generateContent(userPrompt);
      const rawText = result.response.text();

      const cleanedJsonText = geminiService.extractJson(rawText);
      const parsedObject = JSON.parse(cleanedJsonText);

      // Validate strictly against Zod Schema
      const validatedResponse = CopilotResponseSchema.parse(parsedObject);

      // Post-AI generation integrity guard: enforce mathematical budget ceiling
      if (validatedResponse.changes.budget) {
        const sumCategories = validatedResponse.changes.budget.categories.reduce((acc, c) => acc + c.amount, 0);
        const overallSum = sumCategories + validatedResponse.changes.budget.contingency.amount;
        if (overallSum > validatedResponse.changes.budget.total + 1) {
          throw new Error('AI generated budget changes exceeded total allowed ceiling');
        }
      }

      logger.info(`[CopilotService] Successfully modified and validated plan changes for "${request.eventContext.eventName}"`);
      return validatedResponse;
    } catch (err: unknown) {
      const safeErrorMessage = err instanceof Error 
        ? err.message.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED]') 
        : 'Unknown Copilot AI error';
      logger.error(`[CopilotService] AI Copilot execution failed: ${safeErrorMessage}`);

      if (err && typeof err === 'object' && 'issues' in err) {
        throw new Error(`Copilot response failed schema validation: ${safeErrorMessage}`);
      }

      throw new Error('Failed to process copilot plan modification. Please try again.');
    }
  }

  /**
   * Deterministic fallback generator for Copilot requests when Gemini API is offline or unconfigured
   */
  public generateDeterministicCopilotResponse(req: CopilotRequest): CopilotResponse {
    const { message, currentPlan, eventContext } = req;
    const lower = message.toLowerCase();

    // Security Guard: Detect and deflect prompt injection, credentials extraction, or script execution
    const isPromptInjectionAttempt =
      lower.includes('ignore all previous') ||
      lower.includes('ignore previous') ||
      lower.includes('system prompt') ||
      lower.includes('api key') ||
      lower.includes('gemini_api_key') ||
      lower.includes('secret') ||
      lower.includes('return javascript') ||
      lower.includes('<script') ||
      lower.includes('eval(') ||
      lower.includes('process.env');

    if (isPromptInjectionAttempt) {
      return CopilotResponseSchema.parse({
        message: 'I am Veyra Copilot, specialized exclusively in event planning. I cannot reveal internal system instructions, credentials, or execute code. How can I adjust your event plan?',
        requiresConfirmation: false,
        affectedSections: [],
        changes: {},
      });
    }

    // Safety Guard: Deflect requests for private vendor contacts / unverified commercial listings
    const isVendorSafetyAttempt =
      lower.includes('phone number') ||
      lower.includes('contact number') ||
      lower.includes('real vendor') ||
      lower.includes('verified vendor') ||
      lower.includes('fake reviews');

    if (isVendorSafetyAttempt) {
      return CopilotResponseSchema.parse({
        message: 'For security and vendor safety, Veyra Copilot generates functional planning checklists and consultation frameworks rather than private contact numbers or unverified vendor directories.',
        requiresConfirmation: false,
        affectedSections: [],
        changes: {},
      });
    }

    // 1. Budget reduction / adjustment request
    if (lower.includes('budget') || lower.includes('cost') || lower.includes('lakh') || lower.includes('reduce') || lower.includes('cut')) {
      let targetBudget = currentPlan.budget.total;

      // Check for numeric patterns like ₹600000, 600000, 6 lakh, 8 lakh, 15%
      const lakhMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)/i);
      const directNumberMatch = message.match(/(?:₹|rs\.?|inr|\$|€|£)?\s*(\d{4,12})/i);
      const percentMatch = message.match(/(\d+)\s*%/);

      if (lakhMatch && lakhMatch[1]) {
        targetBudget = Math.round(parseFloat(lakhMatch[1]) * 100000);
      } else if (directNumberMatch && directNumberMatch[1]) {
        targetBudget = parseInt(directNumberMatch[1], 10);
      } else if (percentMatch && percentMatch[1]) {
        const pct = parseInt(percentMatch[1], 10) / 100;
        targetBudget = Math.round(currentPlan.budget.total * (1 - pct));
      } else {
        // Default reasonable reduction: 20%
        targetBudget = Math.round(currentPlan.budget.total * 0.8);
      }

      // Enforce realistic bounds & prevent NaN/Infinity/overflow
      if (isNaN(targetBudget) || !isFinite(targetBudget) || targetBudget < 1000) {
        targetBudget = currentPlan.budget.total;
      }
      targetBudget = Math.min(targetBudget, 1_000_000_000);

      const contingencyPercentage = currentPlan.budget.contingency.percentage || 10;
      const contingencyAmount = Math.round((targetBudget * contingencyPercentage) / 100);
      const usableBudget = targetBudget - contingencyAmount;

      const currentCategories = currentPlan.budget.categories;
      const currentCategorySum = currentCategories.reduce((acc, c) => acc + c.amount, 0) || 1;

      let allocatedSum = 0;
      const updatedCategories = currentCategories.map((c, idx) => {
        const isLast = idx === currentCategories.length - 1;
        const ratio = c.amount / currentCategorySum;
        const newAmount = isLast ? usableBudget - allocatedSum : Math.round(usableBudget * ratio);
        allocatedSum += newAmount;
        const newPct = Math.round((newAmount / targetBudget) * 100);

        return {
          name: c.name,
          amount: Math.max(0, newAmount),
          percentage: newPct,
          reason: `Recalibrated to fit the updated total budget of ${targetBudget.toLocaleString()} ${currentPlan.budget.currency}`,
        };
      });

      const changes: CopilotChanges = {
        budget: {
          total: targetBudget,
          currency: currentPlan.budget.currency,
          categories: updatedCategories,
          contingency: {
            amount: contingencyAmount,
            percentage: contingencyPercentage,
          },
        },
      };

      return CopilotResponseSchema.parse({
        message: `I've adjusted your plan to fit the new ${eventContext.currency} ${targetBudget.toLocaleString()} budget while preserving the highest-priority categories and your 10% contingency buffer.`,
        requiresConfirmation: true,
        affectedSections: ['budget'],
        changes,
      });
    }

    // 2. Ceremony or event addition (e.g. Mehendi, Sangeet, Afterparty, Cocktail)
    if (lower.includes('mehendi') || lower.includes('ceremony') || lower.includes('afterparty') || lower.includes('cocktail') || lower.includes('sangeet')) {
      const featureName = lower.includes('mehendi') 
        ? 'Mehendi Ceremony' 
        : lower.includes('sangeet') 
        ? 'Sangeet Night' 
        : lower.includes('afterparty') 
        ? 'Midnight Afterparty' 
        : 'Special Ceremony';

      const changes: CopilotChanges = {
        timeline: [
          {
            task: `${featureName} - Setup, guest arrival, and traditional entertainment`,
            deadline: '1 Day Prior - 03:00 PM',
            priority: 'high',
            category: 'ceremony',
          },
          ...currentPlan.timeline,
        ],
        vendors: [
          {
            category: `${featureName} Specialists`,
            tasks: [
              `Book lead artists and coordination crew for ${featureName}`,
              `Arrange dedicated seating and themed lounge backdrop`,
            ],
            questionsToAsk: [
              `What is the setup time required prior to guest arrival?`,
              `Are touch-up and cleanup services covered in the package?`,
            ],
          },
          ...currentPlan.vendors,
        ],
        ideas: [
          {
            title: `Bespoke ${featureName} Lounge Station`,
            description: `Vibrant thematic seating corner with custom cushions, refreshment cart, and photography backdrop tailored to ${eventContext.style}.`,
            estimatedCost: Math.round(currentPlan.budget.total * 0.04),
          },
          ...currentPlan.ideas,
        ],
        risks: [
          {
            title: `${featureName} Timing Overrun & Sound Limits`,
            severity: 'medium',
            solution: `Establish a strict sound transition milestone 60 minutes before local neighborhood noise curfews.`,
          },
          ...currentPlan.risks,
        ],
        missingItems: [
          `Dedicated lighting and hydration station for ${featureName}`,
          ...currentPlan.missingItems,
        ],
      };

      return CopilotResponseSchema.parse({
        message: `I've integrated the ${featureName} into your event blueprint across your timeline, vendor briefs, ideas, and pre-flight risk checks.`,
        requiresConfirmation: true,
        affectedSections: ['timeline', 'vendors', 'ideas', 'risks', 'missingItems'],
        changes,
      });
    }

    // 3. Intimate / Minimalist vibe change
    if (lower.includes('intimate') || lower.includes('minimal') || lower.includes('vibe') || lower.includes('theme') || lower.includes('style')) {
      const changes: CopilotChanges = {
        ideas: [
          {
            title: 'Candlelit Communal Dining Arrangement',
            description: 'Intimate long-table banquet layout with low-profile warm candlelight, encouraging conversation and acoustic warmth.',
            estimatedCost: Math.round(currentPlan.budget.total * 0.025),
          },
          {
            title: 'Personalized Hand-Written Guest Welcomes',
            description: 'Individual hand-lettered cards greeting each guest at their seat with a customized message from the hosts.',
            estimatedCost: Math.round(currentPlan.budget.total * 0.01),
          },
          ...currentPlan.ideas.slice(0, 2),
        ],
        risks: [
          {
            title: 'Space Echo in Oversized Venue Room',
            severity: 'low',
            solution: 'Utilize velvet draping and botanical clusters to create cozy partitioned zones within a larger hall.',
          },
          ...currentPlan.risks,
        ],
      };

      return CopilotResponseSchema.parse({
        message: `I've updated your event concept to create an intimate, sophisticated atmosphere with focused guest touchpoints and ambient staging.`,
        requiresConfirmation: true,
        affectedSections: ['ideas', 'risks'],
        changes,
      });
    }

    // 4. "What am I still missing?" / Overlooked items
    if (lower.includes('missing') || lower.includes('forget') || lower.includes('radar') || lower.includes('audit')) {
      const changes: CopilotChanges = {
        missingItems: [
          'Designated emergency transport contact for elderly guests',
          'Printed physical timeline and vendor run-sheet for coordinators',
          'Vendor meal guarantee and break room access for photo/video crew',
          'Reserved backup electrical generator for primary sound and lighting rig',
          ...currentPlan.missingItems,
        ],
        risks: [
          {
            title: 'Day-of Logistics & Load-in Bottle-neck',
            severity: 'medium',
            solution: 'Assign staggered 45-minute load-in arrival slots for decor, floral, and audio teams.',
          },
          ...currentPlan.risks,
        ],
      };

      return CopilotResponseSchema.parse({
        message: `I completed a fresh audit of your event constraints and flagged additional overlooked operational items for your task checklist.`,
        requiresConfirmation: false,
        affectedSections: ['missingItems', 'risks'],
        changes,
      });
    }

    // 5. Default fallback adjustment
    const changes: CopilotChanges = {
      ideas: [
        {
          title: 'Customized Event Experience Enhancement',
          description: `Strategic experiential addition responding to: "${message}". Tailored to ${eventContext.style} aesthetics.`,
          estimatedCost: Math.round(currentPlan.budget.total * 0.02),
        },
        ...currentPlan.ideas,
      ],
      missingItems: [
        `Review and lock in: "${message}" checkpoint with lead coordinator`,
        ...currentPlan.missingItems,
      ],
    };

    return CopilotResponseSchema.parse({
      message: `I've updated your plan based on your guidance: "${message}". Relevant ideas and operational checkpoints have been refined.`,
      requiresConfirmation: true,
      affectedSections: ['ideas', 'missingItems'],
      changes,
    });
  }
}

export const copilotService = new CopilotService();
