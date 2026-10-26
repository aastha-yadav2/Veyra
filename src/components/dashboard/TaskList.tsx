import React, { useState } from 'react';
import { CheckSquare, Square, ListTodo, Plus } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import type { DashboardTask, TaskPriority } from '../../types/event';
import { isTaskPriority } from '../../types/event';

interface TaskListProps {
  tasks: DashboardTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, priority: TaskPriority) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [isAdding, setIsAdding] = useState(false);

  // Requirement 5: Single-pass calculation for task completion and metrics
  const { completedCount, totalCount, completionPercentage, pendingCount } = React.useMemo(() => {
    let completed = 0;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].isCompleted) completed++;
    }
    const total = tasks.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      completedCount: completed,
      totalCount: total,
      completionPercentage: pct,
      pendingCount: total - completed,
    };
  }, [tasks]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAddTask(newTitle.trim(), newPriority);
      setNewTitle('');
      setIsAdding(false);
    }
  };

  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <Badge variant="rose" size="sm">High</Badge>;
      case 'medium':
        return <Badge variant="amber" size="sm">Medium</Badge>;
      case 'low':
      default:
        return <Badge variant="slate" size="sm">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Metric Header */}
      <Card variant="glass" padding="md" className="border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-rose-400" />
              Event Operations Master Task List
            </h4>
            <p className="text-xs text-slate-400">
              Interactive client-side task progress. Combined from AI timeline, vendor checklists, and risk audits.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-lg font-bold font-mono text-emerald-400 block">
              {completedCount} / {totalCount} Completed
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {completionPercentage}% of event milestones resolved
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </Card>

      {/* Filter and Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 w-fit">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white/15 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'pending'
                ? 'bg-rose-500/20 text-rose-300 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'completed'
                ? 'bg-emerald-500/20 text-emerald-300 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Add custom task button */}
        {!isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Custom Task
          </Button>
        )}
      </div>

      {/* Inline Create Task Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3 animate-in fade-in duration-200"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              autoFocus
              placeholder="What needs to be done? (e.g. Schedule bridal hair trial)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            />
            <select
              value={newPriority}
              onChange={(e) => {
                const val = e.target.value;
                if (isTaskPriority(val)) {
                  setNewPriority(val);
                }
              }}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <p className="py-8 text-center text-xs text-slate-400 italic">
            No tasks found matching current filter.
          </p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                task.isCompleted
                  ? 'bg-white/[0.01] border-white/5 opacity-60'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  aria-label={task.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                  className="shrink-0 text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
                >
                  {task.isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                <div className="min-w-0">
                  <span
                    className={`text-xs sm:text-sm font-medium block truncate ${
                      task.isCompleted
                        ? 'line-through text-slate-500'
                        : 'text-white'
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-mono">
                    <span>Deadline: {task.deadline}</span>
                    <span>•</span>
                    <span className="uppercase">[{task.category}]</span>
                    {task.source === 'missing-item' && (
                      <span className="text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded font-sans">
                        From Radar
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                {getPriorityBadge(task.priority)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
