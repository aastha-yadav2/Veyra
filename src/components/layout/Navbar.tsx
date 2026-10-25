import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowRight, CalendarHeart } from 'lucide-react';
import { Button } from '../common/Button';
import { Container } from '../common/Container';

interface NavbarProps {
  onStartPlanningClick: () => void;
  onExploreDemoClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartPlanningClick,
  onExploreDemoClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Event Types', href: '#event-types' },
    { label: 'Smart Budget', href: '#smart-budget' },
    { label: 'Timeline & Tasks', href: '#ai-timeline' },
    { label: 'Live Simulation', href: '#interactive-demo' },
    { label: 'AI Risk Audit', href: '#risk-analysis' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090b10]/85 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-xl shadow-black/30'
          : 'bg-transparent py-5'
      }`}
    >
      <Container size="wide">
        <nav className="flex items-center justify-between" aria-label="Main Navigation">
          {/* Logo & Tagline */}
          <a
            href="#"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-[1.5px] shadow-lg shadow-rose-500/20 group-hover:shadow-rose-500/40 transition-shadow">
              <div className="w-full h-full bg-[#0c0f18] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                Veyra
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium -mt-0.5">
                Plan moments. Not spreadsheets.
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExploreDemoClick}
              className="text-slate-300 hover:text-white"
            >
              Interactive Preview
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onStartPlanningClick}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Planning
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0f18]/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-4 pb-6 mt-3 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-rose-400 py-2 border-b border-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onExploreDemoClick();
              }}
            >
              Interactive Preview
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartPlanningClick();
              }}
              rightIcon={<CalendarHeart className="w-4 h-4" />}
            >
              Start Planning Free
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
