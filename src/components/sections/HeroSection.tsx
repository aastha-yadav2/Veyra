import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Wallet, 
  ShieldAlert, 
  Play,
  HeartHandshake
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Container } from '../common/Container';

interface HeroSectionProps {
  onStartPlanningClick: () => void;
  onExploreDemoClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartPlanningClick,
  onExploreDemoClick,
}) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background radial gradients for warm & intelligent glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-rose-600/20 via-pink-600/15 to-amber-500/10 rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute top-1/3 -left-48 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" 
        aria-hidden="true" 
      />

      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2">
              <Badge variant="rose" size="md">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Next-Gen Event Architecture</span>
              </Badge>
              <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
                GenAI Planning Assistant
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Plan moments. <br />
              <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                Not spreadsheets.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Veyra transforms chaotic weddings, milestone birthdays, and community gatherings into structured, stress-free celebrations. Get intelligent budgets, live minute-by-minute timelines, vendor contracts, and proactive risk detection in seconds.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="glow"
                size="lg"
                onClick={onStartPlanningClick}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto shadow-rose-500/25"
              >
                Start Planning
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onExploreDemoClick}
                leftIcon={<Play className="w-4 h-4 text-rose-400 fill-rose-400" />}
                className="w-full sm:w-auto"
              >
                Explore Live Simulation
              </Button>
            </div>

            {/* Proof Points */}
            <div className="pt-6 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300">10% Smart AI Buffer</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300">Zero Spreadsheet Math</span>
              </div>
              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-300">"What am I forgetting?" Audit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card / Interactive Concept Snapshot */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-rose-500/30 via-pink-500/20 to-amber-500/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>

              {/* Glass Card Mock Preview */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#141824]/90 to-[#0e111a]/95 border border-white/10 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl">
                {/* Header bar of preview */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block animate-ping"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Live AI Event Draft
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/20">
                    Readiness: 94%
                  </span>
                </div>

                {/* Event Title Snapshot */}
                <div className="space-y-1 mb-5">
                  <span className="text-[11px] font-medium text-rose-400 uppercase tracking-widest">
                    Botanical Glasshouse Wedding
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Elena & Julian's Celebration
                  </h3>
                  <p className="text-xs text-slate-400">
                    120 Guests • Hudson Valley Pavilion • Sep 2027
                  </p>
                </div>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  <div className="bg-white/[0.04] border border-white/5 rounded-xl p-2.5 text-center">
                    <Wallet className="w-3.5 h-3.5 text-rose-400 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400 block">Total Budget</span>
                    <span className="text-xs font-bold text-white">$42,000</span>
                  </div>
                  <div className="bg-white/[0.04] border border-white/5 rounded-xl p-2.5 text-center">
                    <Clock className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400 block">Day Pacing</span>
                    <span className="text-xs font-bold text-white">8 Segments</span>
                  </div>
                  <div className="bg-white/[0.04] border border-white/5 rounded-xl p-2.5 text-center">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-400 block">AI Reserve</span>
                    <span className="text-xs font-bold text-emerald-400">$3,800 (10%)</span>
                  </div>
                </div>

                {/* Timeline Mini-Strip */}
                <div className="space-y-2 mb-4 bg-black/20 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-medium text-slate-300">Live Timeline Segment</span>
                    <span className="text-rose-400">04:30 PM Ceremony</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-rose-500 to-amber-400 h-1.5 rounded-full w-[65%]" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span>11:00 AM Load-In</span>
                    <span className="text-emerald-400 font-medium">Unplugged Vows</span>
                    <span>11:30 PM Sparklers</span>
                  </div>
                </div>

                {/* What am I forgetting AI alert callout */}
                <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 flex items-start gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-rose-200 block">AI Pre-Flight Detection</span>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                      Identified 4 unallocated hot vendor meals for photo & video teams. Added to catering brief automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
