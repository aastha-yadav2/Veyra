/**
 * Veyra Event Service Layer
 * 
 * Clean abstraction handling event data retrieval, budget calculations,
 * and future GenAI endpoint integrations. No secrets or API keys are stored here.
 */

import { apiClient, type RequestConfig } from './api.client';
import { budgetService } from './budget.service';
import { planMapper } from './plan.mapper';
import { EVENT_TYPES } from '../data/eventTypes';
import { MOCK_EVENT_PLANS } from '../data/mockPlans';
import type { 
  EventCategory, 
  EventPlan, 
  EventTypeDefinition, 
  BudgetSummary,
  ServerGeneratedPlan,
  EventCreationFormData,
  CopilotResponse
} from '../types/event';
import type { 
  ServiceResponse, 
  CreateEventDraftInput 
} from '../types/service';

export interface IEventService {
  getEventTypes(): Promise<ServiceResponse<EventTypeDefinition[]>>;
  getPlanByCategory(category: EventCategory, config?: RequestConfig): Promise<ServiceResponse<EventPlan>>;
  generateDraftPlan(input: CreateEventDraftInput, config?: RequestConfig): Promise<ServiceResponse<EventPlan>>;
  calculateSmartBudget(category: EventCategory, totalAmount: number): BudgetSummary;
}

export class EventService implements IEventService {
  /**
   * Fetch all supported event categories and metadata
   */
  public async getEventTypes(): Promise<ServiceResponse<EventTypeDefinition[]>> {
    return apiClient.wrapMockResponse(() => EVENT_TYPES, { mockDelayMs: 100 });
  }

  /**
   * Get pre-built or simulated plan for a specific category
   */
  public async getPlanByCategory(
    category: EventCategory, 
    config?: RequestConfig
  ): Promise<ServiceResponse<EventPlan>> {
    return apiClient.wrapMockResponse(() => {
      const plan = MOCK_EVENT_PLANS[category];
      if (!plan) {
        throw new Error(`Plan template for category "${category}" not found.`);
      }
      return plan;
    }, config);
  }

  /**
   * Generates a new dynamic event draft based on user inputs.
   * When the backend GenAI microservice is deployed, this method will call POST /api/v1/plans/generate
   */
  /**
   * Generates a new dynamic event draft based on user inputs.
   * Calls backend GenAI POST /api/planning/generate when available, with graceful offline fallback.
   */
  public async generateDraftPlan(
    input: CreateEventDraftInput, 
    config?: RequestConfig
  ): Promise<ServiceResponse<EventPlan>> {
    // If mock is not explicitly forced, try the backend GenAI server first
    if (!config?.useMock && !apiClient.isUsingMock()) {
      try {
        const payload = {
          eventType: input.category,
          eventName: input.title || `${input.preferredVibe || 'Bespoke'} Celebration`,
          date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          location: input.location || 'Local Venue',
          guestCount: input.guestCount,
          budget: input.targetBudget || input.guestCount * 250,
          currency: 'INR',
          style: input.preferredVibe || 'elegant minimal',
          preferences: [input.preferredVibe || 'minimal decor'],
        };

        const backendResponse = await apiClient.post<ServerGeneratedPlan>('/planning/generate', payload);
        if (backendResponse.status === 'success' && backendResponse.data) {
          const eventPlan = planMapper.mapServerPlanToEventPlan(
            backendResponse.data,
            input,
            payload.date,
            input.location || payload.location
          );

          return {
            data: eventPlan,
            error: null,
            status: 'success',
            timestamp: new Date().toISOString(),
          };
        }
      } catch {
        // Fall back gracefully to local calculation
      }
    }

    return apiClient.wrapMockResponse(() => {
      const basePlan = MOCK_EVENT_PLANS[input.category] || MOCK_EVENT_PLANS.custom;
      const budgetAmount = input.targetBudget ?? (input.guestCount * 180);
      const computedBudget = this.calculateSmartBudget(input.category, budgetAmount);

      const generatedPlan: EventPlan = {
        ...basePlan,
        id: `plan-draft-${Date.now()}`,
        title: input.title || `${input.preferredVibe || 'Bespoke'} ${basePlan.title}`,
        category: input.category,
        guestCount: input.guestCount,
        location: input.location || basePlan.location,
        status: 'draft',
        budget: computedBudget,
      };

      return generatedPlan;
    }, { mockDelayMs: 650, ...config });
  }

  /**
   * Pure domain calculation for smart budget allocation with 10% AI safety buffer.
   * Delegated to specialized BudgetService (Requirement 4).
   */
  public calculateSmartBudget(category: EventCategory, totalAmount: number): BudgetSummary {
    return budgetService.calculateSmartBudget(category, totalAmount);
  }

  /**
   * Phase 3: Sends wizard form data directly to POST /api/planning/generate
   */
  public async generatePlanFromBackend(
    formData: EventCreationFormData
  ): Promise<{ plan: ServerGeneratedPlan; isFallback: boolean; errorMessage?: string }> {
    try {
      const resp = await apiClient.post<ServerGeneratedPlan>('/planning/generate', formData);
      if (resp.status === 'success' && resp.data) {
        return {
          plan: resp.data,
          isFallback: false,
        };
      }

      const errorMsg = resp.error?.message || 'Server did not respond with a valid plan';
      const fallback = this.createOfflineFallbackPlan(formData);
      return {
        plan: fallback,
        isFallback: true,
        errorMessage: errorMsg,
      };
    } catch (err) {
      const fallback = this.createOfflineFallbackPlan(formData);
      return {
        plan: fallback,
        isFallback: true,
        errorMessage: err instanceof Error ? err.message : 'Network failure connecting to Veyra planning server',
      };
    }
  }

  /**
   * Creates a mathematically compliant offline fallback plan if server is offline
   */
  public createOfflineFallbackPlan(
    formData: EventCreationFormData
  ): ServerGeneratedPlan {
    const contingencyAmount = Math.round(formData.budget * 0.1);
    const usableBudget = formData.budget - contingencyAmount;

    const categoryRatios = [
      { name: 'Venue & Environment', pct: 0.38, reason: `Primary gathering venue booking in ${formData.location}` },
      { name: 'Dining, Food & Bar', pct: 0.35, reason: `Headcount catering estimate for ${formData.guestCount} guests` },
      { name: 'Photo, Video & Memories', pct: 0.15, reason: 'Full day coverage with digital assets and highlight reel' },
      { name: 'Atmosphere, Styling & Sound', pct: 0.12, reason: `Ambiance matching the requested ${formData.style} style` },
    ];

    let allocatedSum = 0;
    const categories = categoryRatios.map((item, idx) => {
      const isLast = idx === categoryRatios.length - 1;
      const amount = isLast ? usableBudget - allocatedSum : Math.round(usableBudget * item.pct);
      allocatedSum += amount;
      const percentage = Math.round((amount / formData.budget) * 100);

      return {
        name: item.name,
        amount,
        percentage,
        reason: item.reason,
      };
    });

    return {
      eventSummary: `Autonomous blueprint created for "${formData.eventName}" (${formData.eventType}) in ${formData.location} for ${formData.guestCount} guests. Calibrated to an aesthetic of ${formData.style} with strict budget guardrails.`,
      budget: {
        total: formData.budget,
        currency: formData.currency,
        categories,
        contingency: {
          amount: contingencyAmount,
          percentage: 10,
        },
      },
      timeline: [
        {
          task: 'Lock in primary venue reservation and deposit',
          deadline: '6 Months Prior',
          priority: 'high',
          category: 'venue',
        },
        {
          task: `Tasting and dietary confirmation (${formData.preferences.join(', ') || 'standard'})`,
          deadline: '2 Months Prior',
          priority: 'high',
          category: 'catering',
        },
        {
          task: 'Finalize photography shot checklist & timing run sheet',
          deadline: '3 Weeks Prior',
          priority: 'medium',
          category: 'photography',
        },
        {
          task: 'Day-of load-in and audio visual soundcheck',
          deadline: 'Event Day - 10:00 AM',
          priority: 'high',
          category: 'logistics',
        },
        {
          task: 'Guest arrival & welcome refreshment service',
          deadline: 'Event Day - 04:30 PM',
          priority: 'medium',
          category: 'program',
        },
      ],
      vendors: [
        {
          category: 'Venue & Facilities',
          tasks: [
            'Confirm occupancy limits and floor arrangement plan',
            'Verify curfew and sound decibel restrictions with property management',
          ],
          questionsToAsk: [
            'Are tables, chairs, and standard clean-up included in the baseline fee?',
            'What is the designated load-in window for audio and floral vendors?',
          ],
        },
        {
          category: 'Catering & Beverages',
          tasks: [
            'Finalize dietary substitutions and allergy counts',
            'Lock in final guaranteed guest headcount 14 days prior',
          ],
          questionsToAsk: [
            'Is service waitstaff and dishware included in per-plate estimates?',
            'What is the vendor meal protocol for on-site media crew?',
          ],
        },
        {
          category: 'Photography & Film',
          tasks: [
            'Supply essential family grouping shot lists',
            'Coordinate sunset golden hour portrait window',
          ],
          questionsToAsk: [
            'Will there be a secondary shooter or assistant present?',
            'What is the delivery turnaround timeline for preview galleries?',
          ],
        },
      ],
      ideas: [
        {
          title: 'Custom Ambient Lighting & Uplighting',
          description: `Soft warm lighting accents designed to enhance the ${formData.style} atmosphere throughout evening hours.`,
          estimatedCost: Math.round(formData.budget * 0.035),
        },
        {
          title: 'Curated Guest Welcome Cards',
          description: 'Personalized stationery cards with event timeline schedule and dietary indicators.',
          estimatedCost: Math.round(formData.budget * 0.015),
        },
      ],
      risks: [
        {
          title: 'Inclement Weather & Temperature Shift',
          severity: 'medium',
          solution: 'Establish a firm 72-hour forecast decision milestone with venue coordinator for indoor alternative spaces.',
        },
        {
          title: 'Sound Curfew and Decibel Regulations',
          severity: 'low',
          solution: 'Schedule a seamless transition from amplified sound to acoustic or indoor lounge by mandatory curfew hour.',
        },
      ],
      missingItems: [
        'Dedicated vendor hot meal guarantee for on-site photo and video staff',
        'Physical printed emergency vendor contact sheet for coordinator',
        'Designated accessible parking and entrance route for elderly guests',
      ],
    };
  }

  /**
   * Phase 4: Structured Copilot endpoint integration (POST /api/planning/copilot)
   */
  public async callCopilot(
    message: string,
    currentPlan: ServerGeneratedPlan,
    eventContext: EventCreationFormData
  ): Promise<{ response: CopilotResponse; isFallback: boolean; error?: string }> {
    try {
      const resp = await apiClient.post<CopilotResponse>('/planning/copilot', {
        message,
        currentPlan,
        eventContext,
      });

      if (resp.status === 'success' && resp.data) {
        return {
          response: resp.data,
          isFallback: false,
        };
      }

      // If network fails or server is offline, provide graceful offline fallback response
      const fallback = this.createOfflineFallbackCopilotResponse(message, currentPlan, eventContext);
      return {
        response: fallback,
        isFallback: true,
        error: resp.error?.message,
      };
    } catch (err) {
      const fallback = this.createOfflineFallbackCopilotResponse(message, currentPlan, eventContext);
      return {
        response: fallback,
        isFallback: true,
        error: err instanceof Error ? err.message : 'Failed to connect to Veyra Copilot service',
      };
    }
  }

  /**
   * Local deterministic Copilot fallback calculation for offline or preview environments
   */
  public createOfflineFallbackCopilotResponse(
    message: string,
    currentPlan: ServerGeneratedPlan,
    eventContext: EventCreationFormData
  ): CopilotResponse {
    const lower = message.toLowerCase();

    // Budget reduction request
    if (lower.includes('budget') || lower.includes('reduce') || lower.includes('cost') || lower.includes('lakh')) {
      let targetBudget = currentPlan.budget.total;
      const lakhMatch = message.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)/i);
      const directNumberMatch = message.match(/(?:₹|rs\.?|inr|\$|€|£)?\s*(\d{5,10})/i);
      const percentMatch = message.match(/(\d+)\s*%/);

      if (lakhMatch && lakhMatch[1]) {
        targetBudget = Math.round(parseFloat(lakhMatch[1]) * 100000);
      } else if (directNumberMatch && directNumberMatch[1]) {
        targetBudget = parseInt(directNumberMatch[1], 10);
      } else if (percentMatch && percentMatch[1]) {
        targetBudget = Math.round(currentPlan.budget.total * (1 - parseInt(percentMatch[1], 10) / 100));
      } else {
        targetBudget = Math.round(currentPlan.budget.total * 0.8);
      }

      const contingencyAmount = Math.round(targetBudget * 0.1);
      const usableBudget = targetBudget - contingencyAmount;
      const currentCategorySum = currentPlan.budget.categories.reduce((acc, c) => acc + c.amount, 0) || 1;

      let allocatedSum = 0;
      const categories = currentPlan.budget.categories.map((c, idx) => {
        const isLast = idx === currentPlan.budget.categories.length - 1;
        const ratio = c.amount / currentCategorySum;
        const newAmount = isLast ? usableBudget - allocatedSum : Math.round(usableBudget * ratio);
        allocatedSum += newAmount;
        return {
          name: c.name,
          amount: newAmount,
          percentage: Math.round((newAmount / targetBudget) * 100),
          reason: `Recalibrated to fit updated ${targetBudget.toLocaleString()} ${eventContext.currency} budget ceiling`,
        };
      });

      return {
        message: `I've adjusted your plan to fit the new ${eventContext.currency} ${targetBudget.toLocaleString()} budget while preserving highest-priority categories and 10% contingency.`,
        requiresConfirmation: true,
        affectedSections: ['budget'],
        changes: {
          budget: {
            total: targetBudget,
            currency: currentPlan.budget.currency,
            categories,
            contingency: {
              amount: contingencyAmount,
              percentage: 10,
            },
          },
        },
      };
    }

    // Ceremony addition (Mehendi, Sangeet, Afterparty)
    if (lower.includes('mehendi') || lower.includes('ceremony') || lower.includes('sangeet') || lower.includes('afterparty')) {
      const feature = lower.includes('mehendi') ? 'Mehendi Ceremony' : 'Special Ceremony';
      return {
        message: `I've added the ${feature} into your plan with dedicated schedule timing, specialist vendor briefs, ideas, and risk contingencies.`,
        requiresConfirmation: true,
        affectedSections: ['timeline', 'vendors', 'ideas', 'risks', 'missingItems'],
        changes: {
          timeline: [
            {
              task: `${feature} - Setup, guest arrival, and traditional entertainment`,
              deadline: '1 Day Prior - 03:00 PM',
              priority: 'high',
              category: 'ceremony',
            },
            ...currentPlan.timeline,
          ],
          vendors: [
            {
              category: `${feature} Specialists`,
              tasks: [`Book lead artists and styling crew for ${feature}`, 'Arrange thematic seating layout'],
              questionsToAsk: ['What is the preparation setup time needed?', 'Are touch-up services included?'],
            },
            ...currentPlan.vendors,
          ],
          ideas: [
            {
              title: `Bespoke ${feature} Lounge Experience`,
              description: `Vibrant thematic seating lounge with customized cushions and photo op accents matching ${eventContext.style}.`,
              estimatedCost: Math.round(currentPlan.budget.total * 0.035),
            },
            ...currentPlan.ideas,
          ],
          risks: [
            {
              title: `${feature} Timeline & Sound Ordinance`,
              severity: 'medium',
              solution: 'Establish a firm sound deceleration milestone 1 hour before sound curfew.',
            },
            ...currentPlan.risks,
          ],
          missingItems: [
            `Dedicated hydration and refreshment station for ${feature}`,
            ...currentPlan.missingItems,
          ],
        },
      };
    }

    // Default modification
    return {
      message: `I've analyzed your request: "${message}" and drafted updates for your consideration.`,
      requiresConfirmation: true,
      affectedSections: ['ideas', 'missingItems'],
      changes: {
        ideas: [
          {
            title: 'Customized Experience Enhancement',
            description: `Creative operational adjustment responding to: "${message}".`,
            estimatedCost: Math.round(currentPlan.budget.total * 0.02),
          },
          ...currentPlan.ideas,
        ],
        missingItems: [
          `Review and lock in: "${message}" checkpoint with lead coordinator`,
          ...currentPlan.missingItems,
        ],
      },
    };
  }
}

export const eventService = new EventService();
