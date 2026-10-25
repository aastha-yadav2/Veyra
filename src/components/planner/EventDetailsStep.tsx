import React from 'react';

interface EventDetailsStepProps {
  eventName: string;
  date: string;
  location: string;
  guestCount: number;
  errors: Record<string, string>;
  onChange: (field: string, value: string | number) => void;
}

const TODAY_STR = new Date().toISOString().split('T')[0];

export const EventDetailsStep: React.FC<EventDetailsStepProps> = ({
  eventName,
  date,
  location,
  guestCount,
  errors,
  onChange,
}) => {

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h3 className="text-base sm:text-lg font-bold text-white">
          Event Details
        </h3>
        <p className="text-xs text-slate-400">
          Tell Veyra where, when, and for how many people this event takes place.
        </p>
      </div>

      {/* Event Name */}
      <div>
        <label
          htmlFor="wizard-event-name"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          Event Name <span className="text-rose-400">*</span>
        </label>
        <input
          id="wizard-event-name"
          name="eventName"
          type="text"
          autoComplete="off"
          required
          aria-required="true"
          aria-invalid={!!errors.eventName}
          aria-describedby={errors.eventName ? 'eventName-error' : undefined}
          placeholder="e.g. Aarav & Aastha Wedding, Clara's 30th Birthday"
          value={eventName}
          onChange={(e) => onChange('eventName', e.target.value)}
          className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border text-white placeholder-slate-500 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors ${
            errors.eventName ? 'border-rose-500' : 'border-white/10'
          }`}
        />
        {errors.eventName && (
          <p id="eventName-error" className="mt-1 text-xs text-rose-400 flex items-center gap-1">
            <span>⚠</span> {errors.eventName}
          </p>
        )}
      </div>

      {/* Date & Location Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label
            htmlFor="wizard-event-date"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Target Date <span className="text-rose-400">*</span>
          </label>
          <input
            id="wizard-event-date"
            name="date"
            type="date"
            min={TODAY_STR}
            required
            aria-required="true"
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? 'date-error' : undefined}
            value={date}
            onChange={(e) => onChange('date', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors font-mono ${
              errors.date ? 'border-rose-500' : 'border-white/10'
            }`}
          />
          {errors.date && (
            <p id="date-error" className="mt-1 text-xs text-rose-400 flex items-center gap-1">
              <span>⚠</span> {errors.date}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="wizard-event-location"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            City or Venue Location <span className="text-rose-400">*</span>
          </label>
          <input
            id="wizard-event-location"
            name="location"
            type="text"
            autoComplete="address-level2"
            required
            aria-required="true"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? 'location-error' : undefined}
            placeholder="e.g. Dehradun, Mumbai, San Francisco"
            value={location}
            onChange={(e) => onChange('location', e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border text-white placeholder-slate-500 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-colors ${
              errors.location ? 'border-rose-500' : 'border-white/10'
            }`}
          />
          {errors.location && (
            <p id="location-error" className="mt-1 text-xs text-rose-400 flex items-center gap-1">
              <span>⚠</span> {errors.location}
            </p>
          )}
        </div>
      </div>

      {/* Guest Count */}
      <div>
        <label
          htmlFor="wizard-guest-count"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          Expected Guest Count <span className="text-rose-400">*</span>
        </label>
        <div className="relative">
          <input
            id="wizard-guest-count"
            name="guestCount"
            type="number"
            min="1"
            max="50000"
            step="1"
            required
            aria-required="true"
            aria-invalid={!!errors.guestCount}
            aria-describedby={errors.guestCount ? 'guestCount-error' : undefined}
            value={guestCount || ''}
            onChange={(e) => onChange('guestCount', Number(e.target.value))}
            className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 font-mono transition-colors ${
              errors.guestCount ? 'border-rose-500' : 'border-white/10'
            }`}
          />
        </div>
        {errors.guestCount && (
          <p id="guestCount-error" className="mt-1 text-xs text-rose-400 flex items-center gap-1">
            <span>⚠</span> {errors.guestCount}
          </p>
        )}
      </div>
    </div>
  );
};
