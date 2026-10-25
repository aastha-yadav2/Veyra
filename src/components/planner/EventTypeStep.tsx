import React from 'react';
import { Heart, Cake, Users, Sparkles, Check } from 'lucide-react';
import type { EventCategory } from '../../types/event';

interface EventTypeStepProps {
  selectedType: EventCategory;
  onSelect: (type: EventCategory) => void;
}

interface EventTypeOption {
  id: EventCategory;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}

export const EventTypeStep: React.FC<EventTypeStepProps> = ({
  selectedType,
  onSelect,
}) => {
  const options: EventTypeOption[] = [
    {
      id: 'wedding',
      title: 'Wedding',
      description: 'Ceremony flow, catering allocations, floral styling, and golden hour photos.',
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      accent: 'border-rose-500/50 hover:border-rose-500',
    },
    {
      id: 'birthday',
      title: 'Birthday',
      description: 'Milestone celebrations, signature bar concepts, music pacing, and surprise reveals.',
      icon: <Cake className="w-5 h-5 text-amber-400" />,
      accent: 'border-amber-500/50 hover:border-amber-500',
    },
    {
      id: 'community',
      title: 'Community Event',
      description: 'Civic festivals, town halls, vendor booths, sound ordinances, and volunteer duties.',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
      accent: 'border-emerald-500/50 hover:border-emerald-500',
    },
    {
      id: 'custom',
      title: 'Custom Event',
      description: 'Bespoke corporate galas, product reveals, retreats, and customized milestones.',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      accent: 'border-purple-500/50 hover:border-purple-500',
    },
  ];

  return (
    <div className="space-y-4" role="radiogroup" aria-label="Select Event Type">
      <div className="mb-2">
        <h3 className="text-base sm:text-lg font-bold text-white">
          What kind of event are you creating?
        </h3>
        <p className="text-xs text-slate-400">
          Veyra calibrates budget proportions, timeline rhythms, and vendor contracts to your event category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {options.map((option) => {
          const isSelected = selectedType === option.id;

          return (
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              key={option.id}
              onClick={() => onSelect(option.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onSelect(option.id);
                }
              }}
              className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 relative ${
                isSelected
                  ? 'bg-rose-500/10 border-rose-500 shadow-lg shadow-rose-500/10'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  isSelected
                    ? 'bg-rose-500/20 border-rose-500/40'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {option.icon}
              </div>

              <div className="flex-1 pr-6">
                <span className="text-sm font-bold text-white block">
                  {option.title}
                </span>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  {option.description}
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
