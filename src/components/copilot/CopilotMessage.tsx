import React from 'react';
import { Sparkles, User, AlertTriangle, Plus, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { CopilotChanges } from './CopilotChanges';
import type { CopilotMessageItem, ServerGeneratedPlan } from '../../types/event';

interface CopilotMessageProps {
  item: CopilotMessageItem;
  currentPlan: ServerGeneratedPlan;
  currency: string;
  onApplyChanges: (messageId: string) => void;
  onCancelChanges: (messageId: string) => void;
  onRetry: () => void;
  onKeepCurrent: () => void;
  onAddMissingItemToTasks?: (itemText: string) => void;
  addedTasksMap?: Record<string, boolean>;
}

const CopilotMessageComponent: React.FC<CopilotMessageProps> = ({
  item,
  currentPlan,
  currency,
  onApplyChanges,
  onCancelChanges,
  onRetry,
  onKeepCurrent,
  onAddMissingItemToTasks,
  addedTasksMap = {},
}) => {
  const isUser = item.sender === 'user';

  if (item.error) {
    return (
      <div className="flex gap-3 text-left">
        <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-2 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs">
          <p className="font-semibold text-rose-200">
            I couldn't update your plan right now.
          </p>
          <p className="text-slate-300">
            We encountered an unexpected issue while communicating with the planning engine.
          </p>
          <div className="pt-1 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onKeepCurrent} className="text-xs">
              Keep Current Plan
            </Button>
            <Button variant="primary" size="sm" onClick={onRetry} className="text-xs">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}

      <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
            isUser
              ? 'bg-rose-500/20 border border-rose-500/30 text-white rounded-tr-none'
              : 'bg-white/[0.04] border border-white/10 text-slate-200 rounded-tl-none'
          }`}
        >
          <p>{item.text}</p>

          {/* Missing items specific quick-add button if detected in changes */}
          {item.changes?.missingItems && item.changes.missingItems.length > 0 && onAddMissingItemToTasks && (
            <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1.5">
              <span className="text-[11px] font-semibold text-amber-300 block">
                Flagged Action Items:
              </span>
              {item.changes.missingItems.map((mi, idx) => {
                const isAdded = !!addedTasksMap[mi];
                return (
                  <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-[11px] text-slate-300 truncate">{mi}</span>
                    {isAdded ? (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 shrink-0">
                        <Check className="w-3 h-3" /> Added
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddMissingItemToTasks(mi)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add to Tasks
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Change Preview block if structured changes are present */}
        {item.changes && Object.keys(item.changes).length > 0 && (
          <CopilotChanges
            changes={item.changes}
            currentPlan={currentPlan}
            currency={currency}
            onApply={() => onApplyChanges(item.id)}
            onCancel={() => onCancelChanges(item.id)}
            status={item.status}
          />
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
          <User className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
};

export const CopilotMessage = React.memo(CopilotMessageComponent);
