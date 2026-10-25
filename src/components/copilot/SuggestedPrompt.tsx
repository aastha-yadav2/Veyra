import React from 'react';
import { Sparkles } from 'lucide-react';

interface SuggestedPromptProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

const SUGGESTED_PROMPTS = [
  'Reduce my budget to ₹6 lakh',
  'Make the event more intimate',
  'Add a mehendi ceremony',
  'Reduce decoration costs',
  'What am I still missing?',
];

export const SuggestedPrompt: React.FC<SuggestedPromptProps> = ({
  onSelectPrompt,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-rose-400" />
        Suggested Prompts:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            type="button"
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            disabled={disabled}
            className="text-[11px] px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/5 hover:border-rose-500/30 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            "{prompt}"
          </button>
        ))}
      </div>
    </div>
  );
};
