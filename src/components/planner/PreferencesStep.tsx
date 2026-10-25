import React, { useState } from 'react';
import { Plus, X, Sparkles, Utensils, HeartHandshake, Compass } from 'lucide-react';

interface PreferencesStepProps {
  style: string;
  preferences: string[];
  onChangeStyle: (style: string) => void;
  onAddPreference: (pref: string) => void;
  onRemovePreference: (index: number) => void;
}

export const PreferencesStep: React.FC<PreferencesStepProps> = ({
  style,
  preferences,
  onChangeStyle,
  onAddPreference,
  onRemovePreference,
}) => {
  const [customDietary, setCustomDietary] = useState('');
  const [customRequirement, setCustomRequirement] = useState('');
  const [customAdditional, setCustomAdditional] = useState('');

  const quickThemeSuggestions = [
    'Elegant Minimal',
    'Warm Botanical Bohemian',
    'Neo-Tokyo Cyberpunk',
    'Heritage Royal',
    'Sunset Coastal',
    'Rustic Vineyard',
  ];

  const dietarySuggestions = [
    'Vegetarian food',
    'Vegan friendly',
    'Halal certified',
    'Gluten-free options',
    'Nut allergy aware',
    'Jain food options',
  ];

  const specialRequirementSuggestions = [
    'Wheelchair accessible',
    'Elderly priority seating',
    'Quiet sensory rest area',
    'Kids play corner',
    'Pet friendly area',
  ];

  const additionalSuggestions = [
    'Eco-friendly / Zero plastic',
    'Live acoustic band',
    'Unplugged ceremony',
    'Late night snack bar',
    'Drone videography friendly',
  ];

  const handleAdd = (value: string, setter: (val: string) => void) => {
    const trimmed = value.trim();
    if (trimmed && !preferences.includes(trimmed)) {
      onAddPreference(trimmed);
      setter('');
    }
  };

  const toggleChip = (item: string) => {
    const index = preferences.indexOf(item);
    if (index >= 0) {
      onRemovePreference(index);
    } else {
      onAddPreference(item);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h3 className="text-base sm:text-lg font-bold text-white">
          Style & Event Preferences
        </h3>
        <p className="text-xs text-slate-400">
          Guide the AI on your aesthetic theme, dietary needs, accessibility requirements, and guest guidelines.
        </p>
      </div>

      {/* 1. Style / Theme */}
      <div>
        <label
          htmlFor="wizard-style"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          Style / Theme
        </label>
        <input
          id="wizard-style"
          type="text"
          placeholder="e.g. Elegant Minimal, Warm Botanical Bohemian"
          value={style}
          onChange={(e) => onChangeStyle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors"
        />

        <div className="mt-2 flex flex-wrap gap-1.5">
          {quickThemeSuggestions.map((theme) => (
            <button
              type="button"
              key={theme}
              onClick={() => onChangeStyle(theme)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                style === theme
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 font-semibold'
                  : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Dietary Preferences */}
      <div className="space-y-2">
        <label
          htmlFor="wizard-dietary"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
        >
          <Utensils className="w-3.5 h-3.5 text-amber-400" />
          <span>Dietary Preferences</span>
        </label>
        <div className="flex gap-2">
          <input
            id="wizard-dietary"
            type="text"
            placeholder="Add custom dietary rule (e.g. Dairy-free, Kosher)"
            value={customDietary}
            onChange={(e) => setCustomDietary(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd(customDietary, setCustomDietary);
              }
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          />
          <button
            type="button"
            onClick={() => handleAdd(customDietary, setCustomDietary)}
            disabled={!customDietary.trim()}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {dietarySuggestions.map((item) => {
            const isAdded = preferences.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggleChip(item)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors cursor-pointer ${
                  isAdded
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-medium'
                    : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>{isAdded ? '✓' : '+'}</span>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Special Requirements */}
      <div className="space-y-2">
        <label
          htmlFor="wizard-special-req"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
          <span>Special Requirements</span>
        </label>
        <div className="flex gap-2">
          <input
            id="wizard-special-req"
            type="text"
            placeholder="Add special requirement (e.g. Sign language interpreter)"
            value={customRequirement}
            onChange={(e) => setCustomRequirement(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd(customRequirement, setCustomRequirement);
              }
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          />
          <button
            type="button"
            onClick={() => handleAdd(customRequirement, setCustomRequirement)}
            disabled={!customRequirement.trim()}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {specialRequirementSuggestions.map((item) => {
            const isAdded = preferences.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggleChip(item)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-medium'
                    : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>{isAdded ? '✓' : '+'}</span>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Additional Preferences */}
      <div className="space-y-2">
        <label
          htmlFor="wizard-additional-pref"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5 text-purple-400" />
          <span>Additional Preferences</span>
        </label>
        <div className="flex gap-2">
          <input
            id="wizard-additional-pref"
            type="text"
            placeholder="Add additional preference (e.g. Unplugged ceremony)"
            value={customAdditional}
            onChange={(e) => setCustomAdditional(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd(customAdditional, setCustomAdditional);
              }
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          />
          <button
            type="button"
            onClick={() => handleAdd(customAdditional, setCustomAdditional)}
            disabled={!customAdditional.trim()}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {additionalSuggestions.map((item) => {
            const isAdded = preferences.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggleChip(item)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors cursor-pointer ${
                  isAdded
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-medium'
                    : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>{isAdded ? '✓' : '+'}</span>
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Selected Preference Chips */}
      <div className="pt-2 border-t border-white/10">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Selected Preferences ({preferences.length}):
        </span>

        {preferences.length === 0 ? (
          <p className="text-xs text-slate-500 italic">
            No specific preferences selected. Veyra will generate a balanced standard plan.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {preferences.map((pref, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30"
              >
                <Sparkles className="w-3 h-3 text-rose-400 shrink-0" />
                <span>{pref}</span>
                <button
                  type="button"
                  onClick={() => onRemovePreference(idx)}
                  className="p-0.5 hover:bg-rose-500/20 rounded-full text-rose-300 hover:text-white transition-colors cursor-pointer"
                  aria-label={`Remove preference ${pref}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
