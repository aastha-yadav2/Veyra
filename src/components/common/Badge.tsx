import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'rose' | 'amber' | 'emerald' | 'purple' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'rose',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wide',
    md: 'text-xs px-2.5 py-1 font-medium',
  }[size];

  const variantClasses = {
    rose: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700/80',
    outline: 'bg-transparent text-slate-400 border border-slate-700/80',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase tracking-wider ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
