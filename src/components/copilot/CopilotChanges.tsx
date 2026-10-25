import React from 'react';
import { 
  Check, 
  X, 
  ArrowRight, 
  Calendar, 
  CheckSquare, 
  Lightbulb, 
  AlertTriangle, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '../common/Button';
import type { CopilotChanges as CopilotPlanChanges, ServerGeneratedPlan } from '../../types/event';

interface CopilotChangesProps {
  changes: CopilotPlanChanges;
  currentPlan: ServerGeneratedPlan;
  currency: string;
  onApply: () => void;
  onCancel: () => void;
  status?: 'pending' | 'applied' | 'cancelled';
}

export const CopilotChanges: React.FC<CopilotChangesProps> = ({
  changes,
  currentPlan,
  currency,
  onApply,
  onCancel,
  status = 'pending',
}) => {
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const symbol = currencySymbols[currency] || currency;

  // 1. Compute Budget Category Diffs
  const budgetDiffs: Array<{ label: string; oldVal: string; newVal: string }> = [];

  if (changes.budget) {
    if (changes.budget.total !== currentPlan.budget.total) {
      budgetDiffs.push({
        label: 'Total Budget',
        oldVal: `${symbol}${currentPlan.budget.total.toLocaleString()}`,
        newVal: `${symbol}${changes.budget.total.toLocaleString()}`,
      });
    }

    // Category changes
    changes.budget.categories.forEach((newCat) => {
      const oldCat = currentPlan.budget.categories.find(
        (c) => c.name.toLowerCase() === newCat.name.toLowerCase()
      );
      if (oldCat && oldCat.amount !== newCat.amount) {
        budgetDiffs.push({
          label: newCat.name,
          oldVal: `${symbol}${oldCat.amount.toLocaleString()}`,
          newVal: `${symbol}${newCat.amount.toLocaleString()}`,
        });
      }
    });

    // Contingency change
    if (changes.budget.contingency.amount !== currentPlan.budget.contingency.amount) {
      budgetDiffs.push({
        label: 'Contingency',
        oldVal: `${symbol}${currentPlan.budget.contingency.amount.toLocaleString()}`,
        newVal: `${symbol}${changes.budget.contingency.amount.toLocaleString()}`,
      });
    }
  }

  const hasTimelineChanges = !!changes.timeline && changes.timeline.length > 0;
  const hasVendorChanges = !!changes.vendors && changes.vendors.length > 0;
  const hasIdeaChanges = !!changes.ideas && changes.ideas.length > 0;
  const hasRiskChanges = !!changes.risks && changes.risks.length > 0;
  const hasMissingChanges = !!changes.missingItems && changes.missingItems.length > 0;

  const totalModifications = 
    budgetDiffs.length + 
    (hasTimelineChanges ? 1 : 0) + 
    (hasVendorChanges ? 1 : 0) + 
    (hasIdeaChanges ? 1 : 0) + 
    (hasRiskChanges ? 1 : 0) + 
    (hasMissingChanges ? 1 : 0);

  return (
    <div className="mt-3 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3.5 text-xs text-slate-200">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="font-bold uppercase tracking-wider text-[11px] text-rose-400">
          PLAN CHANGES ({totalModifications || 1})
        </span>
        {status === 'applied' && (
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            ✓ Changes Applied
          </span>
        )}
        {status === 'cancelled' && (
          <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            Cancelled
          </span>
        )}
      </div>

      {/* Budget Diffs List */}
      {budgetDiffs.length > 0 && (
        <div className="space-y-2">
          {budgetDiffs.map((diff, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 border-b border-white/5 last:border-none">
              <span className="text-slate-300 font-medium">{diff.label}</span>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="text-slate-500 line-through">{diff.oldVal}</span>
                <ArrowRight className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="text-emerald-400 font-bold">{diff.newVal}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline Highlights */}
      {hasTimelineChanges && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline Updates ({changes.timeline!.length} items)</span>
          </div>
          <p className="text-[11px] text-slate-400 pl-5">
            Key milestone: {changes.timeline![0].task} ({changes.timeline![0].deadline})
          </p>
        </div>
      )}

      {/* Vendor Highlights */}
      {hasVendorChanges && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px]">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Vendor Checklist Updates ({changes.vendors!.length} disciplines)</span>
          </div>
          <p className="text-[11px] text-slate-400 pl-5">
            Brief added: {changes.vendors![0].category}
          </p>
        </div>
      )}

      {/* Ideas Highlights */}
      {hasIdeaChanges && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px]">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Personalized Concept Sparks</span>
          </div>
          <p className="text-[11px] text-slate-400 pl-5">
            New idea: {changes.ideas![0].title} (~{symbol}{changes.ideas![0].estimatedCost.toLocaleString()} AI estimate)
          </p>
        </div>
      )}

      {/* Risk Highlights */}
      {hasRiskChanges && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Risk Pre-Flight Mitigations</span>
          </div>
          <p className="text-[11px] text-slate-400 pl-5">
            {changes.risks![0].title} ({changes.risks![0].severity.toUpperCase()})
          </p>
        </div>
      )}

      {/* Missing Items */}
      {hasMissingChanges && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Radar Alerts ({changes.missingItems!.length})</span>
          </div>
          <p className="text-[11px] text-slate-400 pl-5 truncate">
            {changes.missingItems![0]}
          </p>
        </div>
      )}

      {/* Action Buttons: Apply Changes / Cancel */}
      {status === 'pending' && (
        <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            leftIcon={<X className="w-3.5 h-3.5" />}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onApply}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Apply Changes
          </Button>
        </div>
      )}
    </div>
  );
};
