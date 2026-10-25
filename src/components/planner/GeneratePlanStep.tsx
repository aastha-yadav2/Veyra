import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Users, 
  Palette, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  Tag
} from 'lucide-react';
import { Button } from '../common/Button';
import type { EventCreationFormData } from '../../types/event';

interface GeneratePlanStepProps {
  formData: EventCreationFormData;
  isLoading: boolean;
  onGenerate: () => void;
  error?: string | null;
  onRetry: () => void;
  onEdit: () => void;
}

export const GeneratePlanStep: React.FC<GeneratePlanStepProps> = ({
  formData,
  isLoading,
  onGenerate,
  error,
  onRetry,
  onEdit,
}) => {
  const [animationStep, setAnimationStep] = useState(0);

  const statusPhases = [
    'Analyzing your event',
    'Balancing your budget',
    'Building your timeline',
    'Checking what you might miss',
  ];

  // Rotate through real progress phases while request is in flight
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev < statusPhases.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => {
      clearInterval(interval);
      setAnimationStep(0);
    };
  }, [isLoading, statusPhases.length]);

  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const symbol = currencySymbols[formData.currency] || formData.currency;

  return (
    <div className="space-y-6">
      {/* If Error Occurred */}
      {error && !isLoading ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">
              Veyra couldn't generate your plan right now.
            </h4>
            <p className="text-xs text-slate-300 mt-1.5 max-w-md mx-auto leading-relaxed">
              We encountered an issue preparing your blueprint. Please verify your details or try again in a few moments.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit Event
            </Button>
            <Button variant="primary" size="sm" onClick={onRetry}>
              Try Again
            </Button>
          </div>
        </div>
      ) : isLoading ? (
        /* Real Animated Status During Generation */
        <div 
          className="py-12 px-4 text-center space-y-6"
          aria-live="polite"
          aria-busy="true"
        >
          {/* Pulsing AI Sparkle Core */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 blur-xl opacity-60 animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-[#0e121d] border border-rose-500/50 flex items-center justify-center shadow-2xl">
              <Sparkles className="w-8 h-8 text-rose-400 animate-spin" />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white tracking-tight">
              Veyra is rethinking your plan...
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Communicating with Veyra planning intelligence engine
            </p>
          </div>

          {/* Stepped Status Radar */}
          <div className="max-w-md mx-auto space-y-2.5 text-left bg-black/40 p-4 rounded-xl border border-white/5">
            {statusPhases.map((phase, idx) => {
              const isPast = idx < animationStep;
              const isCurrent = idx === animationStep;

              return (
                <div
                  key={phase}
                  className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                    isCurrent
                      ? 'text-white font-semibold'
                      : isPast
                      ? 'text-emerald-400'
                      : 'text-slate-600 opacity-60'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-rose-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span>{phase}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Normal Review & Confirm State */
        <div className="space-y-5">
          <div className="mb-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              Event Blueprint Ready to Generate
            </h3>
            <p className="text-xs text-slate-400">
              Review your parameters below. Veyra will architect budget allocations, timelines, vendor briefs, and risk audits.
            </p>
          </div>

          {/* Structured Summary Card */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 block font-bold">
                  Event Type: {formData.eventType}
                </span>
                <h4 className="text-lg font-bold text-white">{formData.eventName}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                  {symbol} {formData.budget.toLocaleString()} ({formData.currency})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong>Guest Count:</strong> {formData.guestCount}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate"><strong>Location:</strong> {formData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Date:</strong> {formData.date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Palette className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="truncate"><strong>Style:</strong> {formData.style}</span>
              </div>
            </div>

            {/* Contingency Pill */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/5">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Planned 10% Contingency: {symbol}{Math.round(formData.budget * 0.1).toLocaleString()}
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Currency: {formData.currency}
              </span>
            </div>

            {/* Explicit Preferences List in Summary */}
            <div className="pt-2 border-t border-white/5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
                <Tag className="w-3.5 h-3.5 text-rose-400" />
                <span>Preferences ({formData.preferences.length}):</span>
              </span>
              {formData.preferences.length === 0 ? (
                <span className="text-xs text-slate-500 italic">None specified (default standard plan)</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {formData.preferences.map((p, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Primary CTA */}
          <div className="pt-2">
            <Button
              variant="glow"
              size="lg"
              onClick={onGenerate}
              className="w-full justify-center shadow-rose-500/30"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Create My Plan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
