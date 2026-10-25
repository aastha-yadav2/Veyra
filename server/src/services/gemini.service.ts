import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  GeneratedPlanSchema, 
  type GeneratedPlan, 
  type PlanningRequest 
} from '../schemas/planning.schema';
import { 
  buildPlanningSystemInstruction, 
  buildPlanningUserPrompt 
} from '../prompts/planning.prompt';
import { logger } from '../utils/logger';

export interface IPlanningAiService {
  generatePlan(request: PlanningRequest): Promise<GeneratedPlan>;
}

export class GeminiPlanningService implements IPlanningAiService {
  private readonly client: GoogleGenerativeAI | null = null;
  private readonly modelName: string;

  constructor(apiKey?: string, modelName = 'gemini-1.5-flash') {
    this.modelName = modelName;
    const key = apiKey || process.env.GEMINI_API_KEY;

    if (key && key !== 'your_gemini_api_key_here') {
      this.client = new GoogleGenerativeAI(key);
      logger.info(`[GeminiPlanningService] Initialized with Gemini model: ${this.modelName}`);
    } else {
      logger.warn('[GeminiPlanningService] No valid GEMINI_API_KEY found. Running in mock/fallback engine mode.');
    }
  }

  public getClient(): GoogleGenerativeAI | null {
    return this.client;
  }

  public getModelName(): string {
    return this.modelName;
  }

  public async generatePlan(request: PlanningRequest): Promise<GeneratedPlan> {
    logger.info(`[GeminiPlanningService] Generating plan for event: "${request.eventName}" (${request.eventType})`);

    // If no client available, use high-fidelity realistic fallback generator
    if (!this.client) {
      return this.generateDeterministicFallback(request);
    }

    const systemInstruction = buildPlanningSystemInstruction();
    const userPrompt = buildPlanningUserPrompt(request);

    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        systemInstruction,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const result = await model.generateContent(userPrompt);
      const rawText = result.response.text();

      // Clean any potential markdown wrapper
      const cleanedJsonText = this.extractJson(rawText);
      const parsedObject = JSON.parse(cleanedJsonText);

      // Validate strictly against Zod Schema
      const validatedPlan = GeneratedPlanSchema.parse(parsedObject);
      logger.info(`[GeminiPlanningService] Successfully generated and validated plan for "${request.eventName}"`);
      return validatedPlan;
    } catch (err: unknown) {
      // Never leak API key or internal secrets
      const safeErrorMessage = err instanceof Error ? err.message.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED]') : 'Unknown AI generation error';
      logger.error(`[GeminiPlanningService] Gemini API call failed: ${safeErrorMessage}`);

      // If validation error from Zod on AI response
      if (err && typeof err === 'object' && 'issues' in err) {
        throw new Error(`AI generated plan failed schema validation: ${safeErrorMessage}`);
      }

      throw new Error('Failed to generate event plan using AI provider. Please try again.');
    }
  }

  /**
   * Cleans possible markdown backticks or preamble text from model output
   */
  public extractJson(rawText: string): string {
    const trimmed = rawText.trim();
    if (trimmed.startsWith('```json')) {
      return trimmed.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    }
    if (trimmed.startsWith('```')) {
      return trimmed.replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
    }
    return trimmed;
  }

  /**
   * High-fidelity deterministic generator used when GEMINI_API_KEY is not configured
   * or during offline test runs. Guarantees 100% schema compliance and mathematical precision.
   */
  public generateDeterministicFallback(req: PlanningRequest): GeneratedPlan {
    const contingencyPercentage = 10;
    const contingencyAmount = Math.round((req.budget * contingencyPercentage) / 100);
    const usableBudget = req.budget - contingencyAmount;

    // Proportional category allocations according to event type
    const categoryRatios = req.eventType === 'wedding'
      ? [
          { name: 'Venue & Staging', pct: 0.35, reason: 'Core ceremony and reception space rental with furniture basics' },
          { name: 'Catering & Beverages', pct: 0.35, reason: 'Dining service tailored to guest headcount and food preferences' },
          { name: 'Photo & Cinematography', pct: 0.15, reason: 'Full day coverage with digital albums and highlight reel' },
          { name: 'Decor & Floral Styling', pct: 0.10, reason: 'Aesthetic ambiance matching requested style' },
          { name: 'Sound & Entertainment', pct: 0.05, reason: 'Audio visual equipment and musical coordination' },
        ]
      : [
          { name: 'Venue & Facilities', pct: 0.40, reason: 'Space rental suited for expected capacity and activities' },
          { name: 'Refreshments & Bar', pct: 0.30, reason: 'Food and drink stations for guest enjoyment' },
          { name: 'Audio/Visual & Lighting', pct: 0.15, reason: 'Sound engineering and mood illumination' },
          { name: 'Experiential Activations', pct: 0.15, reason: 'Interactive activities and keepsakes' },
        ];

    let allocatedSum = 0;
    const categories = categoryRatios.map((item, idx) => {
      const isLast = idx === categoryRatios.length - 1;
      const amount = isLast
        ? usableBudget - allocatedSum
        : Math.round(usableBudget * item.pct);
      allocatedSum += amount;
      const percentage = Math.round((amount / req.budget) * 100);

      return {
        name: item.name,
        amount,
        percentage,
        reason: item.reason,
      };
    });

    const fallbackPlan: GeneratedPlan = {
      eventSummary: `Comprehensive plan for ${req.eventName} (${req.eventType}) in ${req.location} for ${req.guestCount} guests with an ${req.style} aesthetic, calibrated within the ${req.budget.toLocaleString()} ${req.currency} budget ceiling.`,
      budget: {
        total: req.budget,
        currency: req.currency,
        categories,
        contingency: {
          amount: contingencyAmount,
          percentage: contingencyPercentage,
        },
      },
      timeline: [
        {
          task: 'Finalize and book primary venue contract with deposit',
          deadline: '6 Months Prior',
          priority: 'high',
          category: 'venue',
        },
        {
          task: 'Tasting session and menu confirmation with catering vendor',
          deadline: '2 Months Prior',
          priority: 'high',
          category: 'catering',
        },
        {
          task: 'Soundcheck, schedule briefing, and emergency contact review',
          deadline: 'Day-of 10:00 AM',
          priority: 'medium',
          category: 'logistics',
        },
        {
          task: 'Guest arrival, welcome refreshments, and opening program',
          deadline: 'Day-of 04:30 PM',
          priority: 'high',
          category: 'program',
        },
      ],
      vendors: [
        {
          category: 'Venue & Rentals',
          tasks: [
            'Confirm floor plan layout and fire marshal capacity limits',
            'Verify curfew and sound decibel restrictions with management',
          ],
          questionsToAsk: [
            'Is on-site security and clean-up included in the base fee?',
            'What are the load-in and load-out time windows for vendors?',
          ],
        },
        {
          category: 'Catering & Dining',
          tasks: [
            'Finalize dietary substitutions and allergy lists',
            'Lock in guaranteed guest count 14 days prior',
          ],
          questionsToAsk: [
            'Is service staff and tableware rental included in per-plate price?',
            'What is the vendor meal protocol for on-site crew?',
          ],
        },
      ],
      ideas: [
        {
          title: 'Signature Ambient Lighting Installation',
          description: `Custom warm amber and soft rose uplighting to complement the ${req.style} ambiance.`,
          estimatedCost: Math.round(req.budget * 0.03),
        },
        {
          title: 'Personalized Welcome Keepsakes',
          description: 'Eco-conscious personalized cards welcoming guests with event schedule and dietary markers.',
          estimatedCost: Math.round(req.budget * 0.015),
        },
      ],
      risks: [
        {
          title: 'Weather and Rain Contingency',
          severity: 'medium',
          solution: 'Establish a 72-hour forecast decision window with venue coordinator for indoor staging.',
        },
        {
          title: 'Sound Curfew and Decibel Ordinance',
          severity: 'low',
          solution: 'Pre-schedule a transition from amplified sound to acoustic or indoor lounge by curfew hour.',
        },
      ],
      missingItems: [
        'Dedicated vendor hot meal count for on-site photo, video, and audio staff',
        'Emergency first-aid and printed contact telephone tree',
        'Dedicated loading zone parking passes for setup trucks',
      ],
    };

    return GeneratedPlanSchema.parse(fallbackPlan);
  }
}

export const geminiService = new GeminiPlanningService();
