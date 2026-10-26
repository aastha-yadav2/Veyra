/**
 * Veyra Core Domain Type Definitions
 * Strict types representing events, timelines, budgets, and checklists.
 */

export type EventCategory = 'wedding' | 'birthday' | 'community' | 'custom';

export type PlanningStatus = 'draft' | 'planning' | 'confirmed' | 'completed';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface BudgetItem {
  id: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  percentage: number;
  notes?: string;
  priority: 'must-have' | 'recommended' | 'optional';
}

export interface BudgetSummary {
  totalBudget: number;
  allocatedBudget: number;
  contingencyBuffer: number; // e.g. 10% smart AI reserve
  currency: string;
  categories: BudgetItem[];
}

export interface TimelineSlot {
  id: string;
  time: string;
  phase: 'setup' | 'arrival' | 'main-program' | 'refreshment' | 'farewell' | 'teardown';
  title: string;
  description: string;
  assignedRole: string;
  isMilestone?: boolean;
}

export interface VendorChecklistItem {
  id: string;
  category: 'venue' | 'catering' | 'photography' | 'decor' | 'entertainment' | 'logistics';
  task: string;
  dueDateOffsetDays: number; // e.g. -60 means 60 days before event
  dueDateLabel: string;
  status: 'pending' | 'in-progress' | 'booked';
  estimatedCostRange: string;
  aiTip?: string;
}

export interface AiInspirationIdea {
  id: string;
  title: string;
  themeTag: string;
  description: string;
  budgetImpact: 'low' | 'medium' | 'high';
  practicalityScore: number; // 1-10
}

export interface EventPlan {
  id: string;
  title: string;
  category: EventCategory;
  guestCount: number;
  targetDate: string;
  location: string;
  status: PlanningStatus;
  budget: BudgetSummary;
  timeline: TimelineSlot[];
  vendorChecklist: VendorChecklistItem[];
  ideas: AiInspirationIdea[];
  forgettingAnalysis: {
    criticalGaps: string[];
    complianceReminders: string[];
    readinessScore: number; // 0 - 100
  };
}

export interface EventTypeDefinition {
  id: EventCategory;
  name: string;
  tagline: string;
  description: string;
  typicalTimeline: string;
  keyHighlights: string[];
  recommendedBudgetFocus: string;
  badge: string;
  gradient: string;
  accentColor: string;
}

/**
 * Phase 3: Event Wizard & Server GenAI Planning Types
 */
export interface EventCreationFormData {
  eventType: EventCategory;
  eventName: string;
  date: string;
  location: string;
  guestCount: number;
  budget: number;
  currency: CurrencyCode;
  style: string;
  preferences: string[];
}

export interface ServerBudgetCategory {
  name: string;
  amount: number;
  percentage: number;
  reason: string;
}

export interface ServerTimelineItem {
  task: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface ServerVendorItem {
  category: string;
  tasks: string[];
  questionsToAsk: string[];
}

export interface ServerIdeaItem {
  title: string;
  description: string;
  estimatedCost: number;
}

export interface ServerRiskItem {
  title: string;
  severity: 'high' | 'medium' | 'low';
  solution: string;
}

export interface ServerGeneratedPlan {
  eventSummary: string;
  budget: {
    total: number;
    currency: string;
    categories: ServerBudgetCategory[];
    contingency: {
      amount: number;
      percentage: number;
    };
  };
  timeline: ServerTimelineItem[];
  vendors: ServerVendorItem[];
  ideas: ServerIdeaItem[];
  risks: ServerRiskItem[];
  missingItems: string[];
}

export const TASK_PRIORITIES = ['high', 'medium', 'low'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export function isTaskPriority(value: string): value is TaskPriority {
  return (TASK_PRIORITIES as readonly string[]).includes(value);
}

export const DASHBOARD_TABS = [
  'overview',
  'budget',
  'timeline',
  'tasks',
  'vendors',
  'ideas',
  'risks',
] as const;
export type DashboardTab = (typeof DASHBOARD_TABS)[number];

export interface DashboardTask {
  id: string;
  title: string;
  deadline: string;
  priority: TaskPriority;
  category: string;
  isCompleted: boolean;
  source: 'timeline' | 'missing-item' | 'user';
}

export interface FullPlanningDashboardData {
  eventDetails: EventCreationFormData;
  rawPlan: ServerGeneratedPlan;
  tasks: DashboardTask[];
  vendorTaskStatus: Record<string, boolean>; // key: "vIndex-tIndex" -> boolean
  isFallbackPlan: boolean;
  generatedAt: string;
}

/**
 * Phase 4: Structured AI Copilot Types
 */
export interface CopilotChanges {
  budget?: ServerGeneratedPlan['budget'];
  timeline?: ServerTimelineItem[];
  vendors?: ServerVendorItem[];
  ideas?: ServerIdeaItem[];
  risks?: ServerRiskItem[];
  missingItems?: string[];
}

export interface CopilotResponse {
  message: string;
  requiresConfirmation: boolean;
  affectedSections: string[];
  changes: CopilotChanges;
}

export interface CopilotMessageItem {
  id: string;
  sender: 'user' | 'veyra';
  text: string;
  timestamp: string;
  changes?: CopilotChanges;
  requiresConfirmation?: boolean;
  status?: 'pending' | 'applied' | 'cancelled';
  error?: boolean;
}
