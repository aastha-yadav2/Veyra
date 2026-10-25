import React from 'react';
import { Sparkles, Heart, ShieldCheck, Code2, ArrowUpRight } from 'lucide-react';
import { Container } from '../common/Container';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07090e] border-t border-white/[0.08] pt-16 pb-12 text-slate-400 text-sm">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-14">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-400 p-[1px]">
                <div className="w-full h-full bg-[#0c0f18] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Veyra
              </span>
            </div>
            <p className="text-slate-300 text-base max-w-sm font-medium">
              "Plan moments. Not spreadsheets."
            </p>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Veyra orchestrates weddings, milestone birthdays, and community festivals into calm, unforgettable reality with intelligent budgets, timelines, and vendor coordination.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Zero-knowledge client safety: No private keys stored in browser.</span>
            </div>
          </div>

          {/* Event Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Event Types
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#event-types" className="hover:text-rose-400 transition-colors">
                  Weddings & Elopements
                </a>
              </li>
              <li>
                <a href="#event-types" className="hover:text-rose-400 transition-colors">
                  Milestone Birthdays
                </a>
              </li>
              <li>
                <a href="#event-types" className="hover:text-rose-400 transition-colors">
                  Community & Festivals
                </a>
              </li>
              <li>
                <a href="#event-types" className="hover:text-rose-400 transition-colors">
                  Custom Galas & Launches
                </a>
              </li>
            </ul>
          </div>

          {/* Intelligence */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Features
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#smart-budget" className="hover:text-rose-400 transition-colors">
                  Dynamic 10% Smart Buffer
                </a>
              </li>
              <li>
                <a href="#ai-timeline" className="hover:text-rose-400 transition-colors">
                  Hour-by-Hour Rundown
                </a>
              </li>
              <li>
                <a href="#vendor-checklist" className="hover:text-rose-400 transition-colors">
                  Vendor Milestone Sheets
                </a>
              </li>
              <li>
                <a href="#risk-analysis" className="hover:text-rose-400 transition-colors flex items-center gap-1">
                  "What am I forgetting?"
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">AI</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture & Open Stack */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Architecture
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>React 19 + TypeScript</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Tailwind CSS</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Decoupled Service Layer</span>
              </li>
              <li>
                <a
                  href="https://github.com/aastha-yadav2/Veyra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white inline-flex items-center gap-1 text-slate-300 font-medium transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  GitHub Repository
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {CURRENT_YEAR} Veyra. All rights reserved. Crafted with care for event creators.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for moments that matter.
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
