import React from 'react';
import { Badge } from './Badge';

interface SectionHeadingProps {
  badgeText?: string;
  badgeVariant?: 'rose' | 'amber' | 'emerald' | 'purple' | 'slate';
  title: string;
  gradientWord?: string;
  description: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badgeText,
  badgeVariant = 'rose',
  title,
  gradientWord,
  description,
  align = 'center',
  className = '',
}) => {
  const isCentered = align === 'center';

  return (
    <div className={`mb-12 sm:mb-16 ${isCentered ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}>
      {badgeText && (
        <div className={`mb-4 flex ${isCentered ? 'justify-center' : 'justify-start'}`}>
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
        {title}{' '}
        {gradientWord && (
          <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            {gradientWord}
          </span>
        )}
      </h2>
      <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
        {description}
      </p>
    </div>
  );
};
