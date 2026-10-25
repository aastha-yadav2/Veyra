import React from 'react';
import { HelpCircle, CheckSquare, Square, Building2, Utensils, Camera, Palette, Music, Truck, Info } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import type { ServerVendorItem } from '../../types/event';

interface VendorChecklistProps {
  vendors: ServerVendorItem[];
  checkedTasks: Record<string, boolean>;
  onToggleTask: (vendorIdx: number, taskIdx: number) => void;
}

export const VendorChecklist: React.FC<VendorChecklistProps> = ({
  vendors,
  checkedTasks,
  onToggleTask,
}) => {
  const getVendorIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('venue') || lower.includes('space')) return <Building2 className="w-5 h-5 text-rose-400" />;
    if (lower.includes('cater') || lower.includes('food') || lower.includes('bar')) return <Utensils className="w-5 h-5 text-amber-400" />;
    if (lower.includes('photo') || lower.includes('video') || lower.includes('film')) return <Camera className="w-5 h-5 text-purple-400" />;
    if (lower.includes('decor') || lower.includes('floral')) return <Palette className="w-5 h-5 text-pink-400" />;
    if (lower.includes('music') || lower.includes('sound') || lower.includes('dj')) return <Music className="w-5 h-5 text-cyan-400" />;
    return <Truck className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="space-y-6">
      {/* AI Trust Signal Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
        <Info className="w-4 h-4 text-purple-400 shrink-0" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Planning Guideline:</strong> Vendor checklists and discipline briefs are AI-generated strategic planning frameworks. Veyra does not provide verified commercial vendor directories, phone numbers, or guaranteed availability.
        </p>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div>
          <h4 className="text-base font-bold text-white">Vendor Negotiation & Run-Sheets</h4>
          <p className="text-xs text-slate-400">
            Check off procurement tasks and use expert qualifying questions before executing contracts.
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400">
          {vendors.length} Vendor Disciplines
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {vendors.map((vendor, vIdx) => (
          <Card key={vIdx} variant="glass" padding="md" className="border-white/10 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {getVendorIcon(vendor.category)}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{vendor.category}</h5>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                      Vendor Milestone Sheet
                    </span>
                  </div>
                </div>
                <Badge variant="slate" size="sm">
                  {vendor.tasks.length} Deliverables
                </Badge>
              </div>

              {/* Tasks List */}
              <div className="space-y-2 mb-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 block mb-1">
                  Procurement Checklist:
                </span>
                {vendor.tasks.map((task, tIdx) => {
                  const key = `${vIdx}-${tIdx}`;
                  const isChecked = !!checkedTasks[key];

                  return (
                    <button
                      type="button"
                      key={tIdx}
                      onClick={() => onToggleTask(vIdx, tIdx)}
                      className={`w-full text-left p-2.5 rounded-xl border flex items-start gap-2.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/15 text-slate-200'
                      }`}
                    >
                      <span className="mt-0.5 shrink-0 text-emerald-400">
                        {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-500" />}
                      </span>
                      <span className={`text-xs leading-snug ${isChecked ? 'line-through text-slate-500' : ''}`}>
                        {task}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Questions To Ask */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Crucial Questions to Ask Before Signing:</span>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {vendor.questionsToAsk.map((q, qIdx) => (
                    <li key={qIdx} className="text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
