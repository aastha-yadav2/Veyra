import React from 'react';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full mb-6 sm:mb-8" aria-label="Creation Progress">
      {/* Top step counters & title */}
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-semibold text-rose-400 uppercase tracking-wider">
          Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
        </span>
        <span className="font-mono text-slate-400">{percentage}% complete</span>
      </div>

      {/* Progress Bar Container */}
      <div
        className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep}: ${stepTitles[currentStep - 1]}`}
      >
        <div
          className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step dots for tablet/desktop */}
      <div className="hidden sm:flex items-center justify-between mt-3 px-1">
        {stepTitles.map((title, idx) => {
          const stepNumber = idx + 1;
          const isDone = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={title} className="flex flex-col items-center gap-1">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-colors ${
                  isDone
                    ? 'bg-rose-500 text-white'
                    : isCurrent
                    ? 'bg-white/10 text-white border-2 border-rose-500'
                    : 'bg-white/5 text-slate-500 border border-white/10'
                }`}
              >
                {isDone ? '✓' : stepNumber}
              </span>
              <span
                className={`text-[10px] font-medium tracking-tight ${
                  isCurrent ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
