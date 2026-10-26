import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { EventTypesSection } from './components/sections/EventTypesSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { WhatAmIForgettingSection } from './components/sections/WhatAmIForgettingSection';
import { InteractiveDemoSection } from './components/sections/InteractiveDemoSection';
import { CtaBanner } from './components/sections/CtaBanner';
import { Footer } from './components/layout/Footer';
import type { EventCategory, FullPlanningDashboardData } from './types/event';

// Requirement 2: Lazy-load heavy planning workflow components to keep initial landing page light
const EventWizard = React.lazy(() =>
  import('./components/planner/EventWizard').then((module) => ({
    default: module.EventWizard,
  }))
);

const PlanningDashboard = React.lazy(() =>
  import('./components/dashboard/PlanningDashboard').then((module) => ({
    default: module.PlanningDashboard,
  }))
);

// Accessible fallback for full-page planning dashboard workspace
const DashboardLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-screen bg-[#090b10] flex flex-col items-center justify-center p-6 text-slate-300"
  >
    <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
    <p className="text-sm font-medium">Loading your interactive event workspace...</p>
    <span className="sr-only">Loading event planning dashboard</span>
  </div>
);

// Accessible fallback for modal wizard
const WizardLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-slate-300"
  >
    <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-3" />
    <p className="text-xs font-medium">Initializing planner...</p>
    <span className="sr-only">Loading event creation wizard</span>
  </div>
);

export const App: React.FC = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardCategory, setWizardCategory] = useState<EventCategory>('wedding');
  const [activeDashboardPlan, setActiveDashboardPlan] = useState<FullPlanningDashboardData | null>(null);

  const handleOpenWizard = (category: EventCategory = 'wedding') => {
    setWizardCategory(category);
    setIsWizardOpen(true);
  };

  const handleScrollToDemo = () => {
    const el = document.getElementById('interactive-demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If active generated plan exists, render the lazy-loaded Planning Dashboard with accessible fallback
  if (activeDashboardPlan) {
    return (
      <React.Suspense fallback={<DashboardLoadingFallback />}>
        <PlanningDashboard
          data={activeDashboardPlan}
          onBackToHome={() => setActiveDashboardPlan(null)}
          onStartNewPlan={() => {
            setActiveDashboardPlan(null);
            handleOpenWizard('wedding');
          }}
        />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        onStartPlanningClick={() => handleOpenWizard('wedding')}
        onExploreDemoClick={handleScrollToDemo}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onStartPlanningClick={() => handleOpenWizard('wedding')}
          onExploreDemoClick={handleScrollToDemo}
        />

        {/* Event Type Cards Section */}
        <EventTypesSection
          onSelectCategory={(cat) => handleOpenWizard(cat)}
          onPreviewPlan={(cat) => {
            setWizardCategory(cat);
            handleScrollToDemo();
          }}
        />

        {/* Core Pillars: Smart Budget, AI Timeline, Vendor Checklist, Personalized Ideas */}
        <FeaturesSection />

        {/* Signature "What am I forgetting?" AI Risk Analysis */}
        <WhatAmIForgettingSection />

        {/* Live Simulation Showcase: Tabs, Dynamic Budget Slider, Loading/Error/Empty States */}
        <InteractiveDemoSection
          onStartPlanningClick={() => handleOpenWizard('wedding')}
          initialCategory={wizardCategory}
        />

        {/* Final CTA Banner */}
        <CtaBanner onStartPlanningClick={() => handleOpenWizard('wedding')} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Phase 3: Multi-Step Event Creation Wizard (Lazy-loaded with accessible fallback) */}
      {isWizardOpen && (
        <React.Suspense fallback={<WizardLoadingFallback />}>
          <EventWizard
            isOpen={isWizardOpen}
            onClose={() => setIsWizardOpen(false)}
            initialCategory={wizardCategory}
            onPlanGenerated={(generatedData) => {
              setActiveDashboardPlan(generatedData);
              setIsWizardOpen(false);
            }}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default App;
