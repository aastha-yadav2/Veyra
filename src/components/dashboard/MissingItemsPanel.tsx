import React from 'react';
import { AlertCircle, Plus, Check } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface MissingItemsPanelProps {
  missingItems: string[];
  onAddMissingItemToTasks: (itemText: string) => void;
  addedItems: Record<string, boolean>;
}

export const MissingItemsPanel: React.FC<MissingItemsPanelProps> = ({
  missingItems,
  onAddMissingItemToTasks,
  addedItems,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            Overlooked Items Radar
          </h4>
          <p className="text-xs text-slate-400">
            Practical operational elements frequently forgotten in initial spreadsheets. Click to convert into trackable tasks.
          </p>
        </div>
        <span className="text-xs font-mono text-amber-400">
          {missingItems.length} Radar Alerts
        </span>
      </div>

      <div className="space-y-3">
        {missingItems.map((item, idx) => {
          const isAdded = !!addedItems[item];

          return (
            <Card
              key={idx}
              variant="glass"
              padding="sm"
              className="border-amber-500/20 bg-amber-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-amber-400 shrink-0 font-bold">⚠</span>
                <div>
                  <h5 className="text-xs sm:text-sm font-semibold text-white">
                    {item}
                  </h5>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Flagged by Veyra pre-flight detection
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {isAdded ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    <Check className="w-3.5 h-3.5" />
                    Added to Tasks
                  </span>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onAddMissingItemToTasks(item)}
                    leftIcon={<Plus className="w-3.5 h-3.5 text-amber-400" />}
                    className="text-xs"
                  >
                    Add to Tasks
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
