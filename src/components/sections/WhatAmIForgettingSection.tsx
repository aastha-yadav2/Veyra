import React from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Container } from '../common/Container';

export const WhatAmIForgettingSection: React.FC = () => {
  const commonBlindspots = [
    {
      title: 'Vendor Meal Contract Clauses',
      description: 'Catering contracts often omit feed requirements for the 4-6 on-site photo, video, and DJ staff.',
      impact: 'Avoids sudden $400 day-of rush meal surcharges or hungry crew delays.',
      badge: 'Catering & Crew'
    },
    {
      title: 'Sound Curfews & Decibel Limits',
      description: 'Many scenic hillside and residential barn venues mandate an abrupt volume drop at 10:00 PM.',
      impact: 'Plans silent disco transitions or indoor dance transitions seamlessly.',
      badge: 'Municipal Law'
    },
    {
      title: 'Power Draw Circuit Overload',
      description: 'Simultaneous coffee espresso bars, DJ amps, and stage heaters often trip standard 15A circuits.',
      impact: 'Pre-assigns dedicated isolated electrical drops with venue engineers.',
      badge: 'AV & Logistics'
    },
    {
      title: 'Rain / Heat Contingency Cutoffs',
      description: 'Most tent rental companies require a non-refundable go/no-go call 72 hours prior to load-in.',
      impact: 'Schedules an automated weather decision checkpoint on your calendar.',
      badge: 'Weather Risk'
    }
  ];

  return (
    <section id="risk-analysis" className="py-20 sm:py-28 relative">
      {/* Subtle background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />

      <Container size="wide">
        <SectionHeading
          badgeText="Signature AI Protection"
          badgeVariant="rose"
          title="The legendary question:"
          gradientWord="“What am I forgetting?”"
          description="The biggest stress in event planning isn't what's on your checklist — it's the invisible blind spots that only veteran coordinators anticipate."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main feature showcase */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <Card variant="gradient" padding="lg" className="h-full flex flex-col justify-between border-rose-500/25">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="rose">Pre-Flight Audit</Badge>
                  <span className="text-xs text-slate-400 font-mono">Real-Time Risk Engine</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Autonomous Pre-Flight Check for Your Celebration
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Veyra continuously scans your guest count, venue type, schedule gaps, and vendor agreements against hundreds of verified event failure modes.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300 font-semibold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Comprehensive Audit Score
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">92/100 Readiness</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
                      <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-2 rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <span className="text-xs font-bold text-rose-300 block mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Critical Blindspot Flagged
                    </span>
                    <p className="text-xs text-slate-300">
                      Cocktail hour terrace lacks shade covering during peak August 3:30 PM heat index. Recommended: 3 misting fan stations or parasol baskets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Simulated in Phase 1 demo. Connected to GenAI in Phase 2.</span>
              </div>
            </Card>
          </div>

          {/* Grid of common blind spots handled */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commonBlindspots.map((item, idx) => (
              <Card
                key={idx}
                variant="glass"
                padding="md"
                isHoverable
                className="flex flex-col justify-between border-white/5 hover:border-rose-500/30"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-rose-400 font-medium">
                      0{idx + 1} // BLINDSPOT
                    </span>
                    <Badge variant="slate" size="sm">{item.badge}</Badge>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-emerald-400 font-medium flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item.impact}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
