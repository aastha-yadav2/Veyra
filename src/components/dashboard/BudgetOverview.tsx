import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  PieChart, 
  Layers,
  Info
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import type { ServerGeneratedPlan } from '../../types/event';

interface BudgetOverviewProps {
  budget: ServerGeneratedPlan['budget'];
  currency: string;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  budget,
  currency,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  const toggleCategory = (idx: number) => {
    setExpandedCategories((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const symbol = currencySymbols[currency] || currency;

  const plannedCategoriesTotal = budget.categories.reduce((acc, c) => acc + c.amount, 0);
  const remainingPlanned = Math.max(0, budget.total - (plannedCategoriesTotal + budget.contingency.amount));

  return (
    <div className="space-y-6">
      {/* AI Estimation Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Planning Notice:</strong> All figures shown are estimated planned allocations architected by AI. They serve as strategic budget guardrails and are not confirmed vendor quotes or market commitments.
        </p>
      </div>

      {/* Top 4 KPI Metrics: Total Budget, Planned Amount, Contingency, Remaining */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" padding="sm" className="border-white/10">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
            Total Budget
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 block">
            {symbol} {budget.total.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Declared spending ceiling
          </span>
        </Card>

        <Card variant="glass" padding="sm" className="border-white/10">
          <span className="text-[11px] uppercase tracking-wider text-rose-300 block font-semibold">
            Planned Spend
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-rose-300 mt-1 block">
            {symbol} {plannedCategoriesTotal.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Allocated across {budget.categories.length} categories
          </span>
        </Card>

        <Card variant="glass" padding="sm" className="border-emerald-500/25 bg-emerald-950/20">
          <span className="text-[11px] uppercase tracking-wider text-emerald-300 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Contingency
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 block">
            +{symbol} {budget.contingency.amount.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-300/80 mt-1 block">
            {budget.contingency.percentage}% smart AI buffer
          </span>
        </Card>

        <Card variant="glass" padding="sm" className="border-white/10">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
            Remaining
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 block">
            {symbol} {remainingPlanned.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Unallocated buffer margin
          </span>
        </Card>
      </div>

      {/* Visual Allocation Stack Bar */}
      <Card variant="glass" padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Planned Allocation Distribution
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            100% of Total Accounted
          </span>
        </div>

        {/* Multi-color stacked visual meter */}
        <div className="w-full h-3 bg-slate-800 rounded-full flex overflow-hidden">
          {budget.categories.map((c, idx) => {
            const colors = [
              'bg-rose-500',
              'bg-amber-400',
              'bg-purple-500',
              'bg-cyan-400',
              'bg-blue-500',
              'bg-pink-400',
            ];
            const color = colors[idx % colors.length];

            return (
              <div
                key={idx}
                className={`${color} h-full transition-all duration-300 hover:opacity-80`}
                style={{ width: `${c.percentage}%` }}
                title={`${c.name}: ${c.percentage}%`}
              />
            );
          })}
          <div
            className="bg-emerald-500 h-full transition-all duration-300 hover:opacity-80"
            style={{ width: `${budget.contingency.percentage}%` }}
            title={`Contingency Reserve: ${budget.contingency.percentage}%`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
          {budget.categories.map((c, idx) => {
            const colors = [
              'bg-rose-500',
              'bg-amber-400',
              'bg-purple-500',
              'bg-cyan-400',
              'bg-blue-500',
              'bg-pink-400',
            ];
            const color = colors[idx % colors.length];
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className="text-slate-300">{c.name}</span>
                <span className="font-mono text-slate-400">({c.percentage}%)</span>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Contingency Reserve</span>
            <span className="font-mono">({budget.contingency.percentage}%)</span>
          </div>
        </div>
      </Card>

      {/* Expandable Category List with Category, Amount, Percentage, Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            Category Breakdown (Click to expand notes)
          </span>
          <span>Estimated Planned Figures</span>
        </div>

        {budget.categories.map((cat, idx) => {
          const isExpanded = !!expandedCategories[idx];

          return (
            <Card
              key={idx}
              variant="glass"
              padding="sm"
              className="border-white/5 hover:border-white/10 transition-colors cursor-pointer"
              onClick={() => toggleCategory(idx)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-rose-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-sm font-bold text-white truncate">{cat.name}</h5>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {cat.percentage}% of planned budget
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-bold font-mono text-white block">
                      {symbol} {cat.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block uppercase">
                      Planned Amount
                    </span>
                  </div>

                  <button
                    type="button"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Progress Bar for Category */}
              <div className="mt-2.5">
                <div 
                  className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={cat.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${cat.name} budget percentage: ${cat.percentage}%`}
                >
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, cat.percentage))}%` }}
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-300 animate-in fade-in duration-200">
                  <span className="text-[11px] font-semibold text-rose-300 block mb-1">
                    AI Strategic Allocation Rationale:
                  </span>
                  <p className="leading-relaxed text-slate-300">{cat.reason}</p>
                </div>
              )}
            </Card>
          );
        })}

        {/* Contingency Row */}
        <Card variant="glass" padding="sm" className="border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-bold text-emerald-300">Contingency Reserve</h5>
                  <Badge variant="emerald" size="sm">Smart AI Buffer</Badge>
                </div>
                <span className="text-[11px] text-emerald-400/80 font-mono">
                  {budget.contingency.percentage}% reserved for surprise overtime fees or weather changes
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm sm:text-base font-bold font-mono text-emerald-400 block">
                {symbol} {budget.contingency.amount.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-300/80 uppercase block">
                Locked Safety Margin
              </span>
            </div>
          </div>

          <div className="mt-2.5">
            <div 
              className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden"
              role="progressbar"
              aria-valuenow={budget.contingency.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Contingency budget percentage: ${budget.contingency.percentage}%`}
            >
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, budget.contingency.percentage))}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
