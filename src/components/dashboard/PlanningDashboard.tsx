import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Users, 
  Wallet, 
  ListTodo, 
  CheckSquare, 
  Lightbulb, 
  AlertTriangle, 
  Plus, 
  Printer,
  Bot
} from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PlanOverview } from './PlanOverview';
import { BudgetOverview } from './BudgetOverview';
import { TimelineView } from './TimelineView';
import { VendorChecklist } from './VendorChecklist';
import { IdeasGrid } from './IdeasGrid';
import { RiskPanel } from './RiskPanel';
import { MissingItemsPanel } from './MissingItemsPanel';
import { TaskList } from './TaskList';
import { VeyraCopilot } from '../copilot/VeyraCopilot';
import type { 
  FullPlanningDashboardData, 
  DashboardTask, 
  CopilotChanges 
} from '../../types/event';

interface PlanningDashboardProps {
  data: FullPlanningDashboardData;
  onBackToHome: () => void;
  onStartNewPlan: () => void;
}

export const PlanningDashboard: React.FC<PlanningDashboardProps> = ({
  data: initialData,
  onBackToHome,
  onStartNewPlan,
}) => {
  const [data, setData] = useState<FullPlanningDashboardData>(initialData);
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'risks' | 'tasks'>('overview');
  const [addedMissingItems, setAddedMissingItems] = useState<Record<string, boolean>>({});
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);

  const { eventDetails, rawPlan, tasks, vendorTaskStatus } = data;

  const handleToggleTask = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      ),
    }));
  };

  const handleAddTask = (title: string, priority: 'high' | 'medium' | 'low') => {
    const newTask: DashboardTask = {
      id: `task-custom-${Date.now()}`,
      title,
      deadline: 'Prior to Event',
      priority,
      category: 'custom',
      isCompleted: false,
      source: 'user',
    };
    setData((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const handleAddMissingItemToTasks = (itemText: string) => {
    if (addedMissingItems[itemText]) return;

    setAddedMissingItems((prev) => ({ ...prev, [itemText]: true }));
    const newTask: DashboardTask = {
      id: `task-missing-${Date.now()}`,
      title: itemText,
      deadline: 'High Priority Checkpoint',
      priority: 'high',
      category: 'operations',
      isCompleted: false,
      source: 'missing-item',
    };
    setData((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const handleToggleVendorTask = (vIdx: number, tIdx: number) => {
    const key = `${vIdx}-${tIdx}`;
    setData((prev) => ({
      ...prev,
      vendorTaskStatus: {
        ...prev.vendorTaskStatus,
        [key]: !prev.vendorTaskStatus[key],
      },
    }));
  };

  /**
   * Phase 4: Seamlessly merge Copilot modifications into the active dashboard state
   */
  const handleApplyPlanChanges = (changes: CopilotChanges) => {
    setData((prev) => {
      const updatedPlan = {
        ...prev.rawPlan,
        budget: changes.budget
          ? {
              ...changes.budget,
              categories: changes.budget.categories.map((c) => ({ ...c })),
              contingency: { ...changes.budget.contingency },
            }
          : prev.rawPlan.budget,
        timeline: changes.timeline ? changes.timeline.map((t) => ({ ...t })) : prev.rawPlan.timeline,
        vendors: changes.vendors
          ? changes.vendors.map((v) => ({
              ...v,
              tasks: [...v.tasks],
              questionsToAsk: [...v.questionsToAsk],
            }))
          : prev.rawPlan.vendors,
        ideas: changes.ideas ? changes.ideas.map((i) => ({ ...i })) : prev.rawPlan.ideas,
        risks: changes.risks ? changes.risks.map((r) => ({ ...r })) : prev.rawPlan.risks,
        missingItems: changes.missingItems ? [...changes.missingItems] : prev.rawPlan.missingItems,
      };

      const updatedDetails = {
        ...prev.eventDetails,
        budget: changes.budget ? changes.budget.total : prev.eventDetails.budget,
      };

      let updatedTasks = [...prev.tasks];

      // If timeline modified, recalculate timeline tasks while preserving user and missing-item tasks
      if (changes.timeline) {
        const newTimelineTasks: DashboardTask[] = changes.timeline.map((t, idx) => ({
          id: `task-t-mod-${idx + 1}-${Date.now()}`,
          title: t.task,
          deadline: t.deadline,
          priority: t.priority,
          category: t.category,
          isCompleted: false,
          source: 'timeline',
        }));
        const nonTimelineTasks = prev.tasks.filter((t) => t.source !== 'timeline');
        updatedTasks = [...newTimelineTasks, ...nonTimelineTasks];
      }

      return {
        ...prev,
        rawPlan: updatedPlan,
        eventDetails: updatedDetails,
        tasks: updatedTasks,
      };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 py-6 sm:py-10">
      <Container size="wide" className="space-y-8">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <button
            type="button"
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Landing Page</span>
          </button>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant={isCopilotOpen ? 'secondary' : 'glow'}
              size="sm"
              onClick={() => setIsCopilotOpen((prev) => !prev)}
              leftIcon={<Bot className="w-3.5 h-3.5 text-rose-400" />}
            >
              {isCopilotOpen ? 'Hide Copilot' : 'Open Copilot'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Print Plan
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onStartNewPlan}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Create Another Plan
            </Button>
          </div>
        </div>

        {/* Dashboard Header Landmark */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-900/90 via-[#131726]/90 to-slate-900/90 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="rose" size="md">
                {eventDetails.eventType.toUpperCase()}
              </Badge>
              {data.isFallbackPlan ? (
                <Badge variant="amber" size="sm">
                  Demo Plan (Offline)
                </Badge>
              ) : (
                <Badge variant="emerald" size="sm">
                  Live AI Plan
                </Badge>
              )}
              <span className="text-xs text-slate-400 font-mono">
                Generated {new Date(data.generatedAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {eventDetails.eventName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{eventDetails.date}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{eventDetails.location}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{eventDetails.guestCount} Guests</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{eventDetails.style}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'budget', label: 'Smart Budget', icon: <Wallet className="w-4 h-4" /> },
            { id: 'timeline', label: 'AI Timeline', icon: <Calendar className="w-4 h-4" /> },
            { id: 'tasks', label: `Tasks (${tasks.filter(t => t.isCompleted).length}/${tasks.length})`, icon: <ListTodo className="w-4 h-4" /> },
            { id: 'vendors', label: 'Vendors', icon: <CheckSquare className="w-4 h-4" /> },
            { id: 'ideas', label: 'Ideas', icon: <Lightbulb className="w-4 h-4" /> },
            { id: 'risks', label: 'What am I forgetting?', icon: <AlertTriangle className="w-4 h-4 text-rose-400" /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area with Integrated Copilot Assistant Panel */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Active Tab View */}
          <div className="flex-1 w-full min-w-0 min-h-[450px]">
            {activeTab === 'overview' && (
              <PlanOverview
                data={data}
                onNavigateTab={(tab) => setActiveTab(tab as any)}
              />
            )}

            {activeTab === 'budget' && (
              <BudgetOverview
                budget={rawPlan.budget}
                currency={eventDetails.currency}
              />
            )}

            {activeTab === 'timeline' && (
              <TimelineView timeline={rawPlan.timeline} />
            )}

            {activeTab === 'tasks' && (
              <TaskList
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
              />
            )}

            {activeTab === 'vendors' && (
              <VendorChecklist
                vendors={rawPlan.vendors}
                checkedTasks={vendorTaskStatus}
                onToggleTask={handleToggleVendorTask}
              />
            )}

            {activeTab === 'ideas' && (
              <IdeasGrid
                ideas={rawPlan.ideas}
                currency={eventDetails.currency}
              />
            )}

            {activeTab === 'risks' && (
              <div className="space-y-10">
                <RiskPanel risks={rawPlan.risks} />
                <MissingItemsPanel
                  missingItems={rawPlan.missingItems}
                  onAddMissingItemToTasks={handleAddMissingItemToTasks}
                  addedItems={addedMissingItems}
                />
              </div>
            )}
          </div>

          {/* Phase 4: Veyra AI Copilot Assistant Panel */}
          <VeyraCopilot
            eventContext={eventDetails}
            currentPlan={rawPlan}
            onApplyPlanChanges={handleApplyPlanChanges}
            onAddMissingItemToTasks={handleAddMissingItemToTasks}
            addedTasksMap={addedMissingItems}
            isOpen={isCopilotOpen}
            onToggleOpen={() => setIsCopilotOpen((prev) => !prev)}
          />
        </div>
      </Container>
    </div>
  );
};
