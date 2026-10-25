import React from 'react';
import { 
  Wallet, 
  CalendarClock, 
  ClipboardCheck, 
  Lightbulb, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2, 
  TrendingUp,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Container } from '../common/Container';

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 relative">
      <Container size="wide">
        <SectionHeading
          badgeText="Core Engine"
          badgeVariant="rose"
          title="Four pillars that replace"
          gradientWord="clunky spreadsheets"
          description="Every event is a complex multi-variable puzzle. Veyra connects your budget, timeline, and vendor contracts so changes in one place automatically update the rest."
        />

        <div className="space-y-16 lg:space-y-24">
          {/* Feature 1: Smart Budget */}
          <div id="smart-budget" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2">
                <Badge variant="amber" size="sm">
                  <Wallet className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pillar 01</span>
                </Badge>
                <span className="text-xs text-slate-400">Zero Mathematical Surprises</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Smart Budget Allocation with <br />
                <span className="text-amber-300">Intelligent 10% AI Buffer</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Traditional planners either guess line-items or get crushed by hidden delivery, gratuity, and overtime fees. Veyra allocates your capital across weighted categories and locks away an automated 10% contingency safety margin.
              </p>
              <ul className="space-y-2.5 pt-2">
                <li className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dynamic Re-balancing:</strong> If your venue exceeds target by $2,000, Veyra recommends exact trim candidates from decor or stationery.</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Contract Hidden Cost Detection:</strong> Flags mandatory service charges, cake cutting fees, and corkage rates before you sign.</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Visual Spend Gauges:</strong> Real-time variance tracking between estimated, contracted, and disbursed payments.</span>
                </li>
              </ul>
            </div>

            {/* Smart Budget Visual Card */}
            <div className="lg:col-span-6">
              <Card variant="glass" padding="md" className="border-amber-500/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Live Allocation Model
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Buffer Intact: +$3,800
                  </span>
                </div>

                {/* Simulated Budget Breakdown Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Venue & Catering Dining</span>
                      <span className="text-white font-mono">$17,500 (45%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full w-[45%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Photo & Cinematography</span>
                      <span className="text-white font-mono">$5,800 (15%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-rose-400 to-pink-500 h-2 rounded-full w-[15%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium">Floral, Production & Lighting</span>
                      <span className="text-white font-mono">$5,000 (13%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-400 to-indigo-500 h-2 rounded-full w-[13%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Smart AI Reserve Contingency
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">$3,800 (10%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[10%]" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-center gap-2">
                  <Sliders className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>AI Insight: Catering headcount shift (+8 guests) absorbed cleanly by buffer without exceeding primary ceiling.</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Feature 2: AI Timeline */}
          <div id="ai-timeline" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual First on Desktop */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <Card variant="glass" padding="md" className="border-rose-500/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Minute-By-Minute Flow
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Pacing: Synchronized</span>
                </div>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-white/10">
                  <div className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-rose-500 ring-4 ring-[#090b10]" />
                    <div className="flex-1 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">02:30 PM — First Look & Portraits</span>
                        <span className="text-[11px] font-mono text-rose-400">45 Mins</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Optimal soft sunlight in north garden courtyard.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-[#090b10]" />
                    <div className="flex-1 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">04:30 PM — Unplugged Ceremony</span>
                        <span className="text-[11px] font-mono text-amber-400">30 Mins</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">String quartet transition cue at minute 24 for recessional.</p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-[#090b10]" />
                    <div className="flex-1 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">06:45 PM — Dinner & Micro-Toasts</span>
                        <span className="text-[11px] font-mono text-emerald-400">90 Mins</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Discreet visual cue to prevent speeches exceeding 4 minutes.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2">
                <Badge variant="rose" size="sm">
                  <CalendarClock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Pillar 02</span>
                </Badge>
                <span className="text-xs text-slate-400">Flawless Day-Of Execution</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                AI Timeline Engine That <br />
                <span className="text-rose-300">Auto-Adjusts for Realities</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Events rarely run to the exact minute. When your ceremony runs 12 minutes over, Veyra doesn’t break — it cascades the adjustment across your caterer’s hot-plating schedule, sunset photography window, and band start time.
              </p>
              <ul className="space-y-2.5 pt-2">
                <li className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Sun-Angle & Golden Hour Tracking:</strong> Coordinates photographer timing with real astronomical data for your venue coordinates.</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Vendor-Specific Run Sheets:</strong> Generates dedicated one-page schedules for the DJ, the kitchen, and the bridal party.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3: Vendor Checklist */}
          <div id="vendor-checklist" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2">
                <Badge variant="emerald" size="sm">
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pillar 03</span>
                </Badge>
                <span className="text-xs text-slate-400">Contract & Task Tracking</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Milestone Vendor Checklist & <br />
                <span className="text-emerald-300">Contract Due-Date Radar</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Never lose a deposit or miss a tasting deadline again. Veyra arranges your vendor tasks chronologically backwards from event day, giving you actionable milestones rather than overwhelming 80-item to-do lists.
              </p>
              <ul className="space-y-2.5 pt-2">
                <li className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Intelligent Booking Windows:</strong> Know exactly which vendors must be booked 12 months out vs. 6 weeks out.</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Negotiation & Briefing Prompts:</strong> Ready-to-send email inquiries with standard industry questions pre-populated.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6">
              <Card variant="glass" padding="md" className="border-emerald-500/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Upcoming Vendor Milestones
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">3 of 5 Completed</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">Venue Contract Executed</span>
                        <span className="text-[10px] text-slate-400">Certificate of Insurance filed with property</span>
                      </div>
                    </div>
                    <Badge variant="emerald" size="sm">Booked</Badge>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.04] border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">Tasting Session & Final Headcount</span>
                        <span className="text-[10px] text-slate-400">Due in 14 days • 4 dietary exclusions noted</span>
                      </div>
                    </div>
                    <Badge variant="amber" size="sm">In Progress</Badge>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/5 border border-white/20"></div>
                      <div>
                        <span className="text-xs font-semibold text-slate-300 block">Day-of Audio Cue Submission</span>
                        <span className="text-[10px] text-slate-400">Due 7 days prior to celebration</span>
                      </div>
                    </div>
                    <Badge variant="slate" size="sm">Scheduled</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Feature 4: Personalized Ideas */}
          <div id="personalized-ideas" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <Card variant="glass" padding="md" className="border-purple-500/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">
                      Contextual Concept Sparks
                    </span>
                  </div>
                  <span className="text-[11px] text-purple-300">Scored for Feasibility</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Audio Guestbook Retro Telephone</span>
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        High Practicality (9/10)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Replaces sterile guestbooks with spontaneous 2:00 AM vocal recordings from closest friends.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Bespoke Midnight Snack Station</span>
                      <span className="text-[10px] font-medium text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        Budget Impact: Low
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Warm pretzel sliders or bao buns delivered right as dance floor energy hits peak.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2">
                <Badge variant="purple" size="sm">
                  <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                  <span>Pillar 04</span>
                </Badge>
                <span className="text-xs text-slate-400">Curated Atmosphere Concepts</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Personalized Ideas Scored for <br />
                <span className="text-purple-300">Real-World Feasibility</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Pinterest gives you unattainable 6-figure photo shoots without practical instructions. Veyra pairs creative decor, mixology, and musical touches with exact cost benchmarks and logistics ratings.
              </p>
              <ul className="space-y-2.5 pt-2">
                <li className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Theme-to-Budget Alignment:</strong> Generates ideas scaled specifically to your chosen budget envelope.</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Guest Memory Index:</strong> Prioritizes touches guests actually remember over expensive background filler.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
