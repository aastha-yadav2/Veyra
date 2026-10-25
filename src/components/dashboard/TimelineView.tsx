import React from 'react';
import { Calendar } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import type { ServerTimelineItem } from '../../types/event';

interface TimelineViewProps {
  timeline: ServerTimelineItem[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <Badge variant="rose" size="sm" className="font-semibold"><span aria-hidden="true" className="mr-1">★</span>High Priority</Badge>;
      case 'medium':
        return <Badge variant="amber" size="sm">Medium</Badge>;
      case 'low':
      default:
        return <Badge variant="slate" size="sm">Low</Badge>;
    }
  };

  const categorizeGrouping = (deadline: string): 'Final Week & Day-Of' | 'Upcoming Milestones' | 'Strategic Planning' => {
    const lower = deadline.toLowerCase();
    if (lower.includes('day-of') || lower.includes('day of') || lower.includes('week') || lower.includes('7 days') || lower.includes('final')) {
      return 'Final Week & Day-Of';
    }
    if (lower.includes('month') || lower.includes('30 days') || lower.includes('60 days') || lower.includes('prior')) {
      return 'Upcoming Milestones';
    }
    return 'Strategic Planning';
  };

  // Group items by timeframe
  const groups: Record<string, ServerTimelineItem[]> = {
    'Strategic Planning': [],
    'Upcoming Milestones': [],
    'Final Week & Day-Of': [],
  };

  timeline.forEach((item) => {
    const groupName = categorizeGrouping(item.deadline);
    groups[groupName].push(item);
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div>
          <h4 className="text-base font-bold text-white">Chronological Execution Roadmap</h4>
          <p className="text-xs text-slate-400">
            Sequenced milestones designed to prevent day-of bottlenecks.
          </p>
        </div>
        <span className="text-xs font-mono text-rose-400">
          {timeline.length} Sequenced Milestones
        </span>
      </div>

      {(Object.keys(groups) as Array<keyof typeof groups>).map((groupTitle) => {
        const items = groups[groupTitle];
        if (!items || items.length === 0) return null;

        return (
          <div key={groupTitle} className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {groupTitle} ({items.length})
              </h5>
            </div>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/10">
              {items.map((item, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-9">
                  {/* Timeline circle dot */}
                  <div className={`absolute left-2 top-3 w-3.5 h-3.5 rounded-full ring-4 ring-[#090b10] ${
                    item.priority === 'high'
                      ? 'bg-rose-500'
                      : item.priority === 'medium'
                      ? 'bg-amber-400'
                      : 'bg-slate-400'
                  }`} />

                  <Card
                    variant="glass"
                    padding="sm"
                    className={`flex-1 transition-all ${
                      item.priority === 'high'
                        ? 'border-l-4 border-l-rose-500 border-white/10 bg-rose-500/[0.02]'
                        : 'border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-lg bg-white/5 font-mono text-xs font-bold text-rose-300">
                          {item.deadline}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 uppercase">
                          [{item.category}]
                        </span>
                      </div>
                      {getPriorityBadge(item.priority)}
                    </div>

                    <h6 className="text-sm font-semibold text-white leading-snug">
                      {item.task}
                    </h6>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
