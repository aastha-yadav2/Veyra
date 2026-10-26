/**
 * Veyra Plan Mapper
 * Transforms backend generated plans (ServerGeneratedPlan) into client-side domain EventPlan structures.
 */

import type { 
  ServerGeneratedPlan, 
  ServerBudgetCategory,
  ServerTimelineItem,
  ServerVendorItem,
  ServerIdeaItem,
  ServerRiskItem,
  EventPlan, 
  BudgetSummary, 
  BudgetItem
} from '../types/event';
import type { CreateEventDraftInput } from '../types/service';

export class PlanMapper {
  /**
   * Maps a ServerGeneratedPlan (from Gemini backend API) to client EventPlan format
   * with strict static typing and zero 'any'.
   */
  public mapServerPlanToEventPlan(
    raw: ServerGeneratedPlan,
    input: CreateEventDraftInput,
    fallbackDate: string,
    fallbackLocation: string
  ): EventPlan {
    const mappedBudget: BudgetSummary = {
      totalBudget: raw.budget.total,
      allocatedBudget: raw.budget.total - raw.budget.contingency.amount,
      contingencyBuffer: raw.budget.contingency.amount,
      currency: raw.budget.currency,
      categories: [
        ...raw.budget.categories.map((c: ServerBudgetCategory, idx: number): BudgetItem => ({
          id: `srv-b-${idx}`,
          category: c.name,
          allocatedAmount: c.amount,
          spentAmount: 0,
          percentage: c.percentage,
          priority: 'must-have',
          notes: c.reason,
        })),
        {
          id: 'srv-contingency',
          category: 'Smart Contingency Reserve (AI Buffer)',
          allocatedAmount: raw.budget.contingency.amount,
          spentAmount: 0,
          percentage: raw.budget.contingency.percentage,
          priority: 'must-have',
          notes: 'Automatic reserve for weather and unexpected overtime fees.',
        },
      ],
    };

    return {
      id: `plan-ai-${Date.now()}`,
      title: input.title || raw.eventSummary.slice(0, 60),
      category: input.category,
      guestCount: input.guestCount,
      targetDate: fallbackDate,
      location: input.location || fallbackLocation,
      status: 'draft',
      budget: mappedBudget,
      timeline: raw.timeline.map((t: ServerTimelineItem, idx: number) => ({
        id: `t-${idx}`,
        time: t.deadline,
        phase: 'main-program',
        title: t.task,
        description: `Category: ${t.category} • Priority: ${t.priority.toUpperCase()}`,
        assignedRole: 'Lead Coordinator',
        isMilestone: t.priority === 'high',
      })),
      vendorChecklist: raw.vendors.flatMap((v: ServerVendorItem, vIdx: number) =>
        v.tasks.map((task: string, tIdx: number) => ({
          id: `v-${vIdx}-${tIdx}`,
          category: 'venue',
          task: `${task} (${v.category})`,
          dueDateOffsetDays: -30,
          dueDateLabel: 'Prior to Event',
          status: 'pending',
          estimatedCostRange: 'Based on quote',
          aiTip: v.questionsToAsk[0] || undefined,
        }))
      ),
      ideas: raw.ideas.map((idea: ServerIdeaItem, idx: number) => ({
        id: `idea-${idx}`,
        title: idea.title,
        themeTag: 'GenAI Concept',
        description: idea.description,
        budgetImpact: 'medium',
        practicalityScore: 9,
      })),
      forgettingAnalysis: {
        criticalGaps: raw.missingItems,
        complianceReminders: raw.risks.map((r: ServerRiskItem) => `${r.title}: ${r.solution}`),
        readinessScore: 92,
      },
    };
  }
}

export const planMapper = new PlanMapper();
