import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import type { ServerIdeaItem } from '../../types/event';

interface IdeasGridProps {
  ideas: ServerIdeaItem[];
  currency: string;
}

export const IdeasGrid: React.FC<IdeasGridProps> = ({ ideas, currency }) => {
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const symbol = currencySymbols[currency] || currency;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div>
          <h4 className="text-base font-bold text-white">Personalized Concept Sparks</h4>
          <p className="text-xs text-slate-400">
            Tailored creative ideas scored for impact and feasibility.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <Info className="w-3.5 h-3.5" />
          <span>All costs are AI estimates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ideas.map((idea, idx) => (
          <Card
            key={idx}
            variant="glass"
            padding="md"
            isHoverable
            className="border-purple-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <Badge variant="purple" size="sm">Bespoke Touch</Badge>
              </div>

              <h5 className="text-base font-bold text-white mb-2">
                {idea.title}
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {idea.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Estimated Cost:</span>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-purple-300 block">
                  ~{symbol} {idea.estimatedCost.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  (AI estimate, not quote)
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
