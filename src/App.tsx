import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { EventTypesSection } from './components/sections/EventTypesSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { WhatAmIForgettingSection } from './components/sections/WhatAmIForgettingSection';
import { InteractiveDemoSection } from './components/sections/InteractiveDemoSection';
import { CtaBanner } from './components/sections/CtaBanner';
import { Footer } from './components/layout/Footer';
import { EventWizard } from './components/planner/EventWizard';
import { PlanningDashboard } from './components/dashboard/PlanningDashboard';
import type { EventCategory, FullPlanningDashboardData } from './types/event';

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

  // If active generated plan exists, render the full Planning Dashboard
  if (activeDashboardPlan) {
    return (
      <PlanningDashboard
        data={activeDashboardPlan}
        onBackToHome={() => setActiveDashboardPlan(null)}
        onStartNewPlan={() => {
          setActiveDashboardPlan(null);
          handleOpenWizard('wedding');
        }}
      />
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

      {/* Phase 3: Multi-Step Event Creation Wizard */}
      <EventWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        initialCategory={wizardCategory}
        onPlanGenerated={(generatedData) => {
          setActiveDashboardPlan(generatedData);
          setIsWizardOpen(false);
        }}
      />
    </div>
  );
};

export default App;
