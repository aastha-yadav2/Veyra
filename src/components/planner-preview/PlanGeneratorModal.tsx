import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  RotateCcw 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { eventService } from '../../services/event.service';
import type { EventCategory, EventPlan } from '../../types/event';
import type { CreateEventDraftInput } from '../../types/service';

interface PlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: EventCategory;
}

export const PlanGeneratorModal: React.FC<PlanGeneratorModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'wedding',
}) => {
  const [step, setStep] = useState<'input' | 'generated'>('input');
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>(defaultCategory);
  const [guestCount, setGuestCount] = useState<number>(100);
  const [targetBudget, setTargetBudget] = useState<number>(25000);
  const [location, setLocation] = useState('');
  const [preferredVibe, setPreferredVibe] = useState('Elegantly Intimate');

  const [generatedPlan, setGeneratedPlan] = useState<EventPlan | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const input: CreateEventDraftInput = {
      title: title || `${preferredVibe} ${category.toUpperCase()}`,
      category,
      guestCount,
      targetBudget,
      location: location || 'Private Venue',
      preferredVibe,
    };

    try {
      const response = await eventService.generateDraftPlan(input);
      if (response.data) {
        setGeneratedPlan(response.data);
        setStep('generated');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep('input');
    setGeneratedPlan(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'input' ? 'Start Your Event Blueprint' : 'Blueprint Generated Successfully'}
      subtitle={
        step === 'input'
          ? 'Configure your celebration parameters to calculate smart allocations.'
          : 'Here is your initial architecture with calculated 10% AI safety reserve.'
      }
      maxWidth="lg"
    >
      {step === 'input' ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Event Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['wedding', 'birthday', 'community', 'custom'] as EventCategory[]).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    category === cat
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-sm'
                      : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Event Title */}
          <div>
            <label htmlFor="event-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Celebration Name or Title
            </label>
            <input
              id="event-title"
              type="text"
              required
              placeholder="e.g. Mia & David's Autumn Glasshouse Wedding"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            />
          </div>

          {/* Two Column: Guests & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="guest-count" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Expected Guests: <span className="text-white font-mono">{guestCount}</span>
              </label>
              <input
                id="guest-count"
                type="number"
                min="10"
                max="5000"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label htmlFor="budget-amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Budget ($USD)
              </label>
              <input
                id="budget-amount"
                type="number"
                min="1000"
                step="500"
                value={targetBudget}
                onChange={(e) => setTargetBudget(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 font-mono"
              />
            </div>
          </div>

          {/* Location & Preferred Atmosphere Vibe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="event-location" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Location or Venue
              </label>
              <input
                id="event-location"
                type="text"
                placeholder="e.g. Sonoma County Vineyard"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              />
            </div>

            <div>
              <label htmlFor="event-vibe" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Atmosphere & Vibe
              </label>
              <input
                id="event-vibe"
                type="text"
                placeholder="e.g. Neo-Tokyo Minimalist, Warm Bohemian"
                value={preferredVibe}
                onChange={(e) => setPreferredVibe(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Veyra will automatically calculate dynamic line-items and reserve 10% ($
              {Math.round(targetBudget * 0.1).toLocaleString()}) for unexpected contingencies.
            </span>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
            <Button variant="ghost" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Generate Architecture
            </Button>
          </div>
        </form>
      ) : (
        /* Generated Result View */
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">{generatedPlan?.title}</h4>
                <p className="text-xs text-slate-300">
                  {generatedPlan?.guestCount} Guests • {generatedPlan?.location}
                </p>
              </div>
            </div>
            <Badge variant="emerald">Draft Created</Badge>
          </div>

          {/* Budget Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/[0.04] p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Total Budget</span>
              <span className="text-sm font-bold text-white font-mono">
                ${generatedPlan?.budget.totalBudget.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/[0.04] p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-slate-400 block uppercase">Allocated</span>
              <span className="text-sm font-bold text-slate-200 font-mono">
                ${generatedPlan?.budget.allocatedBudget.toLocaleString()}
              </span>
            </div>
            <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30 text-center">
              <span className="text-[10px] text-emerald-400 block uppercase">10% AI Buffer</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                +${generatedPlan?.budget.contingencyBuffer.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Calculated Allocation Categories */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Calculated Category Allocation:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {generatedPlan?.budget.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                >
                  <span className="text-white font-medium">{cat.category}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-400">{cat.percentage}%</span>
                    <span className="text-white font-semibold">${cat.allocatedAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Draft Another
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Done & Explore Blueprint
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
