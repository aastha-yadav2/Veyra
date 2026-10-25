import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Container } from '../common/Container';

interface CtaBannerProps {
  onStartPlanningClick: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onStartPlanningClick }) => {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <Container size="wide">
        <div className="relative rounded-3xl bg-gradient-to-tr from-[#161324] via-[#1a1528] to-[#121626] border border-white/10 p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl">
          {/* Background decorative glows */}
          <div 
            className="absolute -right-20 -top-20 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px] pointer-events-none" 
            aria-hidden="true" 
          />
          <div 
            className="absolute -left-20 -bottom-20 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" 
            aria-hidden="true" 
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <Badge variant="rose">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Zero Spreadsheet Math</span>
              </Badge>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to create an event that feels like magic?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Say goodbye to broken formulas, frantic day-of text threads, and surprise vendor invoices. Let Veyra handle the architecture while you cherish every single second.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="glow"
                size="lg"
                onClick={onStartPlanningClick}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto text-base shadow-rose-500/30"
              >
                Start Planning Free
              </Button>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-rose-400" />
                Instant 10% AI safety buffer calculation
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
