import React from 'react';
import { 
  Wallet, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import type { FullPlanningDashboardData, DashboardTab } from '../../types/event';

interface PlanOverviewProps {
  data: FullPlanningDashboardData;
  onNavigateTab: (tabId: DashboardTab) => void;
}

export const PlanOverview: React.FC<PlanOverviewProps> = ({
  data,
  onNavigateTab,
}) => {
  const { eventDetails, rawPlan, tasks, isFallbackPlan } = data;
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const symbol = currencySymbols[eventDetails.currency] || eventDetails.currency;

  const plannedSpend = rawPlan.budget.categories.reduce((acc, c) => acc + c.amount, 0);
  const completedTasks = tasks.reduce((acc, t) => (t.isCompleted ? acc + 1 : acc), 0);

  return (
    <div className="space-y-6">
      {/* Fallback Notice Banner if applicable */}
      {isFallbackPlan && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="amber" size="sm">Demo Plan</Badge>
              <span className="font-bold text-amber-200">
                Offline Deterministic Blueprint
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              This is a <strong>Demo Plan</strong> generated offline using baseline mathematical models. Live AI generation was unreachable. Start the backend server (`cd server && npm run dev`) with your <code>GEMINI_API_KEY</code> for real-time generative models.
            </p>
          </div>
        </div>
      )}

      {/* Top 5 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Card variant="glass" padding="sm" className="border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Wallet className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Total Budget</span>
          </div>
          <span className="text-lg sm:text-xl font-bold font-mono text-white block">
            {symbol} {rawPlan.budget.total.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Declared ceiling</span>
        </Card>

        <Card variant="glass" padding="sm" className="border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Planned Spend</span>
          </div>
          <span className="text-lg sm:text-xl font-bold font-mono text-amber-300 block">
            {symbol} {plannedSpend.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Allocated categories</span>
        </Card>

        <Card variant="glass" padding="sm" className="border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Contingency</span>
          </div>
          <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400 block">
            +{symbol} {rawPlan.budget.contingency.amount.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-300/80 block mt-0.5">10% AI safety reserve</span>
        </Card>

        <Card variant="glass" padding="sm" className="border-white/10">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Tasks</span>
          </div>
          <span className="text-lg sm:text-xl font-bold font-mono text-white block">
            {completedTasks} / {tasks.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Resolved items</span>
        </Card>

        <Card variant="glass" padding="sm" className="border-white/10 col-span-2 md:col-span-1">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Vendors</span>
          </div>
          <span className="text-lg sm:text-xl font-bold font-mono text-white block">
            {rawPlan.vendors.length} Categories
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Procurement briefs</span>
        </Card>
      </div>

      {/* Executive Summary Card */}
      <Card variant="gradient" padding="md" className="border-rose-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="rose" size="sm">Executive Summary</Badge>
          <span className="text-xs text-slate-400 font-mono">
            Generated with strict budget guardrails
          </span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-normal">
          {rawPlan.eventSummary}
        </p>
      </Card>

      {/* Quick Launch Cards into Sub-views */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          variant="glass"
          padding="md"
          className="border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
          onClick={() => onNavigateTab('budget')}
        >
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Smart Budget Allocation
            </h5>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Inspect category weights and review the automatic 10% contingency buffer.
          </p>
          <span className="text-xs font-mono font-bold text-amber-400">
            {rawPlan.budget.categories.length} Categories Defined →
          </span>
        </Card>

        <Card
          variant="glass"
          padding="md"
          className="border-white/5 hover:border-rose-500/30 transition-all cursor-pointer group"
          onClick={() => onNavigateTab('timeline')}
        >
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
              Chronological Timeline
            </h5>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Day-of schedules, prep milestones, and cascade buffers.
          </p>
          <span className="text-xs font-mono font-bold text-rose-400">
            {rawPlan.timeline.length} Milestones Sequenced →
          </span>
        </Card>

        <Card
          variant="glass"
          padding="md"
          className="border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group"
          onClick={() => onNavigateTab('risks')}
        >
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              "What am I forgetting?"
            </h5>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Pre-flight scan of contracts, weather cutoffs, and overlooked items.
          </p>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {rawPlan.risks.length} Risks • {rawPlan.missingItems.length} Radar Items →
          </span>
        </Card>
      </div>
    </div>
  );
};
