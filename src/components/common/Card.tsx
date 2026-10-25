import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'gradient';
  isHoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  isHoverable = false,
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  }[padding];

  const variantStyles = {
    glass:
      'bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-xl shadow-black/40',
    solid:
      'bg-slate-900 border border-slate-800 shadow-lg',
    gradient:
      'bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-white/10 shadow-2xl',
  }[variant];

  const hoverStyles = isHoverable
    ? 'transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/10'
    : '';

  return (
    <div
      className={`rounded-2xl relative overflow-hidden ${variantStyles} ${paddingStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
