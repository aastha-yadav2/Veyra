import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import type { CurrencyCode } from '../../types/event';

interface BudgetStepProps {
  budget: number;
  currency: CurrencyCode;
  errors: Record<string, string>;
  onChange: (field: string, value: string | number) => void;
}

export const BudgetStep: React.FC<BudgetStepProps> = ({
  budget,
  currency,
  errors,
  onChange,
}) => {
  const supportedCurrencies: Array<{ code: CurrencyCode; label: string; symbol: string }> = [
    { code: 'INR', label: 'INR (₹)', symbol: '₹' },
    { code: 'USD', label: 'USD ($)', symbol: '$' },
    { code: 'EUR', label: 'EUR (€)', symbol: '€' },
    { code: 'GBP', label: 'GBP (£)', symbol: '£' },
  ];

  const currentCurrency = supportedCurrencies.find((c) => c.code === currency) || supportedCurrencies[0];
  const contingencyEstimate = Math.round(budget * 0.1);

  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h3 className="text-base sm:text-lg font-bold text-white">
          Budget & Currency
        </h3>
        <p className="text-xs text-slate-400">
          Set your total financial ceiling. Veyra ensures all categories fit within this total.
        </p>
      </div>

      {/* Currency Selector */}
      <div>
        <label
          htmlFor="wizard-currency"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          Currency
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {supportedCurrencies.map((c) => (
            <button
              type="button"
              key={c.code}
              onClick={() => onChange('currency', c.code)}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                currency === c.code
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm'
                  : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Total Budget Amount */}
      <div>
        <label
          htmlFor="wizard-budget"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          Total Budget Amount ({currentCurrency.symbol}) <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
            {currentCurrency.symbol}
          </span>
          <input
            id="wizard-budget"
            name="budget"
            type="number"
            min="1000"
            step="1000"
            required
            aria-required="true"
            aria-invalid={!!errors.budget}
            aria-describedby={errors.budget ? 'budget-error' : undefined}
            value={budget || ''}
            onChange={(e) => onChange('budget', Number(e.target.value))}
            placeholder="e.g. 800000"
            className={`w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 font-mono transition-colors ${
              errors.budget ? 'border-rose-500' : 'border-white/10'
            }`}
          />
        </div>
        {errors.budget && (
          <p id="budget-error" className="mt-1 text-xs text-rose-400 flex items-center gap-1">
            <span>⚠</span> {errors.budget}
          </p>
        )}
      </div>

      {/* Contingency Buffer Explanation Card */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Automated 10% AI Contingency Reserve</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Veyra automatically reserves approximately{' '}
          <strong className="text-white font-mono">
            {currentCurrency.symbol}
            {contingencyEstimate.toLocaleString()}
          </strong>{' '}
          (10%) as a safety margin for unexpected overtime, guest additions, or weather changes.
        </p>
        <div className="pt-1 flex items-center gap-1.5 text-[11px] text-amber-200/80 font-mono">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Planned Category Allocations: {currentCurrency.symbol}{(budget - contingencyEstimate).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
