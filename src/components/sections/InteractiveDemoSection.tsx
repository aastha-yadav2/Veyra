import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wallet, 
  Calendar, 
  CheckSquare, 
  AlertCircle, 
  RefreshCw, 
  Sliders, 
  ShieldAlert, 
  Inbox,
  ArrowRight
} from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Container } from '../common/Container';
import { eventService } from '../../services/event.service';
import type { EventCategory, EventPlan } from '../../types/event';
import type { ServiceResponse } from '../../types/service';

interface InteractiveDemoSectionProps {
  onStartPlanningClick: () => void;
  initialCategory?: EventCategory;
}

const INITIAL_PLAN_RESPONSE: ServiceResponse<EventPlan> = {
  data: null,
  error: null,
  status: 'loading',
  timestamp: '',
};

export const InteractiveDemoSection: React.FC<InteractiveDemoSectionProps> = ({
  onStartPlanningClick,
  initialCategory = 'wedding',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>(initialCategory);
  const [activeTab, setActiveTab] = useState<'budget' | 'timeline' | 'vendors' | 'risk'>('budget');
  
  // State handling: loading, error, empty, success
  const [planResponse, setPlanResponse] = useState<ServiceResponse<EventPlan>>(INITIAL_PLAN_RESPONSE);
  
  // Simulated state controls
  const [simulateError, setSimulateError] = useState(false);
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const [guestCountModifier, setGuestCountModifier] = useState<number>(120);

  const fetchPlan = (cat: EventCategory, withError = false) => {
    setPlanResponse((prev) => ({ ...prev, status: 'loading', error: null }));
    eventService.getPlanByCategory(cat, {
      mockDelayMs: 400,
      shouldSimulateError: withError,
    }).then((resp) => {
      setPlanResponse(resp);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    eventService.getPlanByCategory(selectedCategory, {
      mockDelayMs: 400,
      shouldSimulateError: simulateError,
    }).then((resp) => {
      if (!isCancelled) {
        setPlanResponse(resp);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, simulateError]);

  const plan = planResponse.data;

  // Requirement 6: Targeted useMemo prevents recalculating dynamic budget on unrelated UI re-renders (tabs, simulation toggles)
  const dynamicBudget = React.useMemo(() => {
    return plan ? eventService.calculateSmartBudget(selectedCategory, guestCountModifier * 280) : null;
  }, [plan, selectedCategory, guestCountModifier]);

  return (
    <section id="interactive-demo" className="py-20 sm:py-28 relative">
      <Container size="wide">
        <SectionHeading
          badgeText="Live Simulation"
          badgeVariant="rose"
          title="Experience the engine in"
          gradientWord="action right now"
          description="Explore real blueprints created by Veyra. Test responsive tab views, live budget re-calculations, and production state handling."
        />

        {/* Category Picker Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {(['wedding', 'birthday', 'community', 'custom'] as EventCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSimulateEmpty(false);
              }}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                selectedCategory === cat && !simulateEmpty
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/5'
              }`}
            >
              {cat} Blueprint
            </button>
          ))}
        </div>

        {/* State Simulation Controls (Demonstrating Production UX: Loading, Error, Empty) */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900/40 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-400" />
            <span className="font-semibold text-white">Developer UX Sandbox Controls:</span>
            <span className="text-slate-400 hidden sm:inline">Test how the UI gracefully handles system states</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setSimulateError(!simulateError);
                setSimulateEmpty(false);
              }}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                simulateError
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {simulateError ? '✓ Error State Active' : 'Simulate Backend Error'}
            </button>

            <button
              onClick={() => {
                setSimulateEmpty(!simulateEmpty);
                setSimulateError(false);
              }}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                simulateEmpty
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              {simulateEmpty ? '✓ Empty State Active' : 'Simulate Empty State'}
            </button>

            <button
              onClick={() => fetchPlan(selectedCategory, false)}
              className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Re-fetch
            </button>
          </div>
        </div>

        {/* Interactive Viewer Card */}
        <Card variant="glass" padding="none" className="border-white/10 overflow-hidden shadow-2xl">
          {/* Top Bar: Plan Title and Internal Feature Navigation */}
          <div className="bg-[#121622] border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-rose-400 font-mono font-semibold">
                Event Blueprint Engine
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {simulateEmpty ? 'No Active Plan Selected' : plan?.title || 'Loading Blueprint...'}
              </h3>
            </div>

            {/* Feature Sub-Tabs */}
            <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab('budget')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'budget'
                    ? 'bg-white/10 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Smart Budget</span>
              </button>

              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'bg-white/10 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>AI Timeline</span>
              </button>

              <button
                onClick={() => setActiveTab('vendors')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'vendors'
                    ? 'bg-white/10 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Checklist</span>
              </button>

              <button
                onClick={() => setActiveTab('risk')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'risk'
                    ? 'bg-white/10 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Risk Audit</span>
              </button>
            </div>
          </div>

          {/* Body: State-dependent display */}
          <div className="p-6 sm:p-8">
            {/* LOADING STATE */}
            {planResponse.status === 'loading' && (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
                <p className="text-sm text-slate-300 font-medium">
                  Calculating smart allocations and sequencing vendor dependencies...
                </p>
                <span className="text-xs text-slate-500 font-mono">
                  apiClient.wrapMockResponse({selectedCategory})
                </span>
              </div>
            )}

            {/* ERROR STATE */}
            {planResponse.status === 'error' && (
              <div className="py-14 px-6 text-center max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white">Simulated Microservice Error</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {planResponse.error?.message}
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSimulateError(false);
                      fetchPlan(selectedCategory, false);
                    }}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  >
                    Recover & Reload Blueprint
                  </Button>
                </div>
              </div>
            )}

            {/* EMPTY STATE */}
            {simulateEmpty && planResponse.status !== 'loading' && (
              <div className="py-14 px-6 text-center max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Inbox className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white">No Event Plan Initialized</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You haven't generated a plan for this category yet. Click below to initiate the guided creator draft.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onStartPlanningClick}
                  >
                    Create New Event Draft
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSimulateEmpty(false)}
                  >
                    Restore Blueprint
                  </Button>
                </div>
              </div>
            )}

            {/* SUCCESS STATE */}
            {!simulateEmpty && planResponse.status === 'success' && plan && (
              <div>
                {/* TAB 1: SMART BUDGET */}
                {activeTab === 'budget' && (
                  <div className="space-y-6">
                    {/* Guest Count Interactive Slider to showcase dynamic recalculation */}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Dynamic Guest Count Simulator: {guestCountModifier} guests
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Adjusting guest count rebalances catering, rentals, and the 10% AI safety buffer in real-time.
                        </span>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-60">
                        <span className="text-xs font-mono text-slate-400">30</span>
                        <input
                          type="range"
                          min="30"
                          max="300"
                          step="10"
                          value={guestCountModifier}
                          onChange={(e) => setGuestCountModifier(Number(e.target.value))}
                          className="w-full accent-rose-500 cursor-pointer"
                          aria-label="Simulate guest count"
                        />
                        <span className="text-xs font-mono text-slate-400">300</span>
                      </div>
                    </div>

                    {/* Top Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-400 block">Total Est. Budget</span>
                        <span className="text-2xl font-bold text-white font-mono">
                          ${(dynamicBudget?.totalBudget ?? plan.budget.totalBudget).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5">
                        <span className="text-xs text-slate-400 block">Allocated Categories</span>
                        <span className="text-2xl font-bold text-slate-200 font-mono">
                          ${(dynamicBudget?.allocatedBudget ?? plan.budget.allocatedBudget).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30">
                        <span className="text-xs text-emerald-400 block font-medium">Smart AI Reserve (10%)</span>
                        <span className="text-2xl font-bold text-emerald-400 font-mono">
                          +${(dynamicBudget?.contingencyBuffer ?? plan.budget.contingencyBuffer).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Category Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-white/[0.04] text-slate-400 uppercase font-mono text-[10px]">
                          <tr>
                            <th className="py-3 px-4 rounded-l-lg">Category</th>
                            <th className="py-3 px-4">Priority</th>
                            <th className="py-3 px-4">Allocated</th>
                            <th className="py-3 px-4">Share</th>
                            <th className="py-3 px-4 rounded-r-lg">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {(dynamicBudget?.categories ?? plan.budget.categories).map((item) => (
                            <tr key={item.id} className="hover:bg-white/[0.02]">
                              <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                                {item.id === 'calc-b-buffer' || item.id === 'b7' ? (
                                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                                ) : null}
                                {item.category}
                              </td>
                              <td className="py-3 px-4 capitalize">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  item.priority === 'must-have'
                                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                    : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {item.priority}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono font-semibold text-white">
                                ${item.allocatedAmount.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 font-mono text-slate-400">
                                {item.percentage}%
                              </td>
                              <td className="py-3 px-4 text-emerald-400 font-medium">
                                Balanced
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 2: AI TIMELINE */}
                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    <div className="text-xs text-slate-400 flex items-center justify-between pb-2 border-b border-white/5">
                      <span>Sequential Day-Of Event Run Sheet</span>
                      <span className="font-mono text-rose-400">{plan.timeline.length} Scheduled Phases</span>
                    </div>

                    <div className="space-y-3">
                      {plan.timeline.map((slot) => (
                        <div
                          key={slot.id}
                          className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 font-mono text-xs font-bold text-rose-300 shrink-0">
                              {slot.time}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{slot.title}</h4>
                                {slot.isMilestone && (
                                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-medium">
                                    Key Milestone
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">{slot.description}</p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-[11px] text-slate-500 block">Responsible Lead:</span>
                            <span className="text-xs font-medium text-slate-300">{slot.assignedRole}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: VENDOR CHECKLIST */}
                {activeTab === 'vendors' && (
                  <div className="space-y-4">
                    <div className="text-xs text-slate-400 flex items-center justify-between pb-2 border-b border-white/5">
                      <span>Target Milestone Inquiries & Due Dates</span>
                      <span className="text-emerald-400 font-mono">Backwards-scheduled from event date</span>
                    </div>

                    <div className="space-y-3">
                      {plan.vendorChecklist.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={task.status === 'booked' ? 'emerald' : 'amber'} size="sm">
                                {task.status}
                              </Badge>
                              <span className="text-xs text-slate-400 capitalize font-mono">
                                [{task.category}]
                              </span>
                              <span className="text-xs font-semibold text-slate-300">
                                {task.dueDateLabel}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-white">{task.task}</h4>
                            {task.aiTip && (
                              <p className="text-xs text-rose-300/90 italic">
                                💡 Tip: {task.aiTip}
                              </p>
                            )}
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-[11px] text-slate-400 block">Est. Market Range:</span>
                            <span className="text-xs font-mono font-bold text-white">
                              {task.estimatedCostRange}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: RISK AUDIT */}
                {activeTab === 'risk' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-white">Event Readiness Score</h4>
                          <p className="text-xs text-slate-300">
                            Pre-flight scan of schedule, venue capacities, and vendor obligations.
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-bold font-mono text-rose-400">
                        {plan.forgettingAnalysis.readinessScore}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                          Flagged Gaps & Blind Spots
                        </span>
                        <ul className="space-y-2">
                          {plan.forgettingAnalysis.criticalGaps.map((gap, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-rose-400 mt-0.5">•</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-2">
                          Compliance & Permits Required
                        </span>
                        <ul className="space-y-2">
                          {plan.forgettingAnalysis.complianceReminders.map((rem, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-emerald-400 mt-0.5">✓</span>
                              <span>{rem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Card Footer */}
          <div className="bg-[#0b0e16] border-t border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Connected to <code>eventService</code> with strict TypeScript definitions.
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={onStartPlanningClick}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Start Custom Blueprint
            </Button>
          </div>
        </Card>
      </Container>
    </section>
  );
};
