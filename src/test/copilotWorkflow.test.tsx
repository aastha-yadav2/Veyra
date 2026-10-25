import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VeyraCopilot } from '../components/copilot/VeyraCopilot';
import { PlanningDashboard } from '../components/dashboard/PlanningDashboard';
import { eventService } from '../services/event.service';
import type { 
  FullPlanningDashboardData, 
  ServerGeneratedPlan, 
  EventCreationFormData,
  CopilotResponse 
} from '../types/event';

describe('Veyra Phase 4 - Copilot Frontend Acceptance Test Suite', () => {
  const sampleEventContext: EventCreationFormData = {
    eventType: 'wedding',
    eventName: 'Elena & David Wedding',
    date: '2027-10-15',
    location: 'Dehradun',
    guestCount: 200,
    budget: 800000,
    currency: 'INR',
    style: 'Elegant Minimal',
    preferences: ['Vegetarian food', 'Minimal decoration'],
  };

  const sampleCurrentPlan: ServerGeneratedPlan = {
    eventSummary: 'Elena & David Wedding blueprint in Dehradun',
    budget: {
      total: 800000,
      currency: 'INR',
      categories: [
        { name: 'Venue & Staging', amount: 300000, percentage: 37, reason: 'Venue booking' },
        { name: 'Catering & Dining', amount: 300000, percentage: 37, reason: 'Dining' },
        { name: 'Photo & Video', amount: 120000, percentage: 15, reason: 'Photography' },
      ],
      contingency: {
        amount: 80000,
        percentage: 10,
      },
    },
    timeline: [
      { task: 'Lock in primary venue contract', deadline: '6 Months Prior', priority: 'high', category: 'venue' },
    ],
    vendors: [
      { category: 'Venue', tasks: ['Sign lease'], questionsToAsk: ['Load-in hours?'] },
    ],
    ideas: [
      { title: 'Fairy lights canopy', description: 'Warm glow ambiance', estimatedCost: 15000 },
    ],
    risks: [
      { title: 'Rain Forecast', severity: 'medium', solution: 'Indoor alternative space' },
    ],
    missingItems: [
      'Dedicated vendor hot meal guarantee',
    ],
  };

  const sampleDashboardData: FullPlanningDashboardData = {
    eventDetails: sampleEventContext,
    rawPlan: sampleCurrentPlan,
    tasks: [
      {
        id: 'task-1',
        title: 'Lock in primary venue contract',
        deadline: '6 Months Prior',
        priority: 'high',
        category: 'venue',
        isCompleted: false,
        source: 'timeline',
      },
    ],
    vendorTaskStatus: {},
    isFallbackPlan: false,
    generatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // Test 1: Copilot renders
  it('1. Copilot renders: displays header, subtitle, welcome message, and input form', () => {
    render(
      <VeyraCopilot
        eventContext={sampleEventContext}
        currentPlan={sampleCurrentPlan}
        onApplyPlanChanges={vi.fn()}
        isOpen={true}
        onToggleOpen={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: /Veyra Copilot/i })).toBeInTheDocument();
    expect(screen.getByText(/Ask me to change your plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Hello! I'm your Veyra Copilot/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ask Veyra Copilot to modify your plan/i)).toBeInTheDocument();
  });

  // Test 2: Suggested prompt works
  it('2. Suggested prompt works: clicking a suggested prompt submits it to Copilot', async () => {
    const mockResponse: CopilotResponse = {
      message: "I've adjusted your plan to fit the new ₹6 lakh budget.",
      requiresConfirmation: true,
      affectedSections: ['budget'],
      changes: {
        budget: {
          total: 600000,
          currency: 'INR',
          categories: [
            { name: 'Venue & Staging', amount: 250000, percentage: 42, reason: 'Reduced venue' },
            { name: 'Catering & Dining', amount: 250000, percentage: 42, reason: 'Reduced catering' },
            { name: 'Photo & Video', amount: 40000, percentage: 6, reason: 'Reduced photo' },
          ],
          contingency: {
            amount: 60000,
            percentage: 10,
          },
        },
      },
    };

    vi.spyOn(eventService, 'callCopilot').mockResolvedValueOnce({
      response: mockResponse,
      isFallback: false,
    });

    render(
      <VeyraCopilot
        eventContext={sampleEventContext}
        currentPlan={sampleCurrentPlan}
        onApplyPlanChanges={vi.fn()}
        isOpen={true}
        onToggleOpen={vi.fn()}
      />
    );

    const promptBtn = screen.getByRole('button', { name: /"Reduce my budget to ₹6 lakh"/i });
    expect(promptBtn).toBeInTheDocument();

    fireEvent.click(promptBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/Reduce my budget to ₹6 lakh/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/I've adjusted your plan to fit the new ₹6 lakh budget/i)).toBeInTheDocument();
    });
  });

  // Test 3: User can submit a message
  it('3. User can submit a message: entering a prompt triggers Copilot API call', async () => {
    const mockResponse: CopilotResponse = {
      message: "I've added the Mehendi Ceremony into your plan.",
      requiresConfirmation: true,
      affectedSections: ['timeline'],
      changes: {
        timeline: [
          { task: 'Mehendi Ceremony and live music', deadline: '1 Day Prior', priority: 'high', category: 'ceremony' },
          ...sampleCurrentPlan.timeline,
        ],
      },
    };

    const spy = vi.spyOn(eventService, 'callCopilot').mockResolvedValueOnce({
      response: mockResponse,
      isFallback: false,
    });

    render(
      <VeyraCopilot
        eventContext={sampleEventContext}
        currentPlan={sampleCurrentPlan}
        onApplyPlanChanges={vi.fn()}
        isOpen={true}
        onToggleOpen={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/Ask Veyra Copilot to modify your plan/i);
    fireEvent.change(input, { target: { value: 'Add a mehendi ceremony' } });

    const submitBtn = screen.getByLabelText(/Send prompt to Veyra Copilot/i);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('Add a mehendi ceremony', sampleCurrentPlan, sampleEventContext);
      expect(screen.getByText(/I've added the Mehendi Ceremony into your plan/i)).toBeInTheDocument();
    });
  });

  // Test 4: Loading state appears
  it('4. Loading state appears: displays "Veyra is rethinking your plan..." while processing', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    vi.spyOn(eventService, 'callCopilot').mockReturnValueOnce(promise as any);

    render(
      <VeyraCopilot
        eventContext={sampleEventContext}
        currentPlan={sampleCurrentPlan}
        onApplyPlanChanges={vi.fn()}
        isOpen={true}
        onToggleOpen={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/Ask Veyra Copilot to modify your plan/i);
    fireEvent.change(input, { target: { value: 'Make the event more intimate' } });
    fireEvent.click(screen.getByLabelText(/Send prompt to Veyra Copilot/i));

    expect(screen.getByText(/Veyra is rethinking your plan\.\.\./i)).toBeInTheDocument();

    // Resolve promise
    resolvePromise!({
      response: {
        message: 'Updated to an intimate setting',
        requiresConfirmation: false,
        affectedSections: ['ideas'],
        changes: {},
      },
      isFallback: false,
    });

    await waitFor(() => {
      expect(screen.queryByText(/Veyra is rethinking your plan\.\.\./i)).not.toBeInTheDocument();
      expect(screen.getByText(/Updated to an intimate setting/i)).toBeInTheDocument();
    });
  });

  // Test 5: Successful response renders
  it('5. Successful response renders: displays Copilot response message', async () => {
    const mockResponse: CopilotResponse = {
      message: 'Decoration expenses reduced by 15% across all floral arrangements.',
      requiresConfirmation: true,
      affectedSections: ['budget'],
      changes: {},
    };

    vi.spyOn(eventService, 'callCopilot').mockResolvedValueOnce({
      response: mockResponse,
      isFallback: false,
    });

    render(
      <VeyraCopilot
        eventContext={sampleEventContext}
        currentPlan={sampleCurrentPlan}
        onApplyPlanChanges={vi.fn()}
        isOpen={true}
        onToggleOpen={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/Ask Veyra Copilot to modify your plan/i);
    fireEvent.change(input, { target: { value: 'Reduce decoration costs' } });
    fireEvent.click(screen.getByLabelText(/Send prompt to Veyra Copilot/i));

    await waitFor(() => {
      expect(screen.getByText(/Decoration expenses reduced by 15%/i)).toBeInTheDocument();
    });
  });

  // Test 6: Change preview renders
  it('6. Change preview renders: displays PLAN CHANGES with diff metrics and Apply/Cancel buttons', async () => {
    const mockResponse: CopilotResponse = {
      message: "I've re-balanced your plan for the ₹600,000 budget.",
      requiresConfirmation: true,
      affectedSections: ['budget'],
      changes: {
        budget: {
          total: 600000,
          currency: 'INR',
          categories: [
            { name: 'Venue & Staging', amount: 250000, percentage: 42, reason: 'Updated venue' },
            { name: 'Catering & Dining', amount: 250000, percentage: 42, reason: 'Updated dining' },
            { name: 'Photo & Video', amount: 40000, percentage: 6, reason: 'Updated photo' },
          ],
          contingency: {
            amount: 60000,
            percentage: 10,
          },
        },
      },
    };

    vi.spyOn(eventService, 'callCopilot').mockResolvedValueOnce({
      response: mockResponse,
      isFallback: false,
    });

    render(
      <VeyraCopilot
        eventContext={sampleEventContext}
        currentPlan={sampleCurrentPlan}
        onApplyPlanChanges={vi.fn()}
        isOpen={true}
        onToggleOpen={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/Ask Veyra Copilot to modify your plan/i);
    fireEvent.change(input, { target: { value: 'Reduce budget to 6 lakh' } });
    fireEvent.click(screen.getByLabelText(/Send prompt to Veyra Copilot/i));

    await waitFor(() => {
      expect(screen.getByText(/PLAN CHANGES/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Budget/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Apply Changes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });
  });

  // Test 7: Apply Changes updates dashboard
  it('7. Apply Changes updates dashboard: clicking Apply Changes merges changes into active dashboard', async () => {
    const mockResponse: CopilotResponse = {
      message: 'Plan adjusted to ₹600,000.',
      requiresConfirmation: true,
      affectedSections: ['budget'],
      changes: {
        budget: {
          total: 600000,
          currency: 'INR',
          categories: [
            { name: 'Venue & Staging', amount: 250000, percentage: 42, reason: 'Recalibrated venue' },
            { name: 'Catering & Dining', amount: 250000, percentage: 42, reason: 'Recalibrated dining' },
            { name: 'Photo & Video', amount: 40000, percentage: 6, reason: 'Recalibrated photo' },
          ],
          contingency: {
            amount: 60000,
            percentage: 10,
          },
        },
      },
    };

    vi.spyOn(eventService, 'callCopilot').mockResolvedValueOnce({
      response: mockResponse,
      isFallback: false,
    });

    render(
      <PlanningDashboard
        data={sampleDashboardData}
        onBackToHome={vi.fn()}
        onStartNewPlan={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/Ask Veyra Copilot to modify your plan/i);
    fireEvent.change(input, { target: { value: 'Reduce budget to 600000' } });
    fireEvent.click(screen.getByLabelText(/Send prompt to Veyra Copilot/i));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Apply Changes/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Apply Changes/i }));

    // Verify dashboard reflects new ₹6,00,000 budget immediately without page reload
    await waitFor(() => {
      expect(screen.getAllByText(/6,00,000/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/✓ Changes Applied/i)).toBeInTheDocument();
    });
  });

  // Test 8: Cancel preserves existing plan
  it('8. Cancel preserves existing plan: clicking Cancel dismisses changes without updating dashboard', async () => {
    const mockResponse: CopilotResponse = {
      message: 'Proposed budget reduction to 500000.',
      requiresConfirmation: true,
      affectedSections: ['budget'],
      changes: {
        budget: {
          total: 500000,
          currency: 'INR',
          categories: [
            { name: 'Venue & Staging', amount: 200000, percentage: 40, reason: 'Venue' },
          ],
          contingency: { amount: 50000, percentage: 10 },
        },
      },
    };

    vi.spyOn(eventService, 'callCopilot').mockResolvedValueOnce({
      response: mockResponse,
      isFallback: false,
    });

    render(
      <PlanningDashboard
        data={sampleDashboardData}
        onBackToHome={vi.fn()}
        onStartNewPlan={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/Ask Veyra Copilot to modify your plan/i);
    fireEvent.change(input, { target: { value: 'Cut budget to 5 lakh' } });
    fireEvent.click(screen.getByLabelText(/Send prompt to Veyra Copilot/i));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    await waitFor(() => {
      expect(screen.getByText(/Cancelled/i)).toBeInTheDocument();
      // Original 800,000 budget remains untouched
      expect(screen.getAllByText(/8,00,000/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  // Test 9: API failure shows recovery state
  it('9. API failure shows recovery state: displays "I couldn\'t update your plan right now." with Try Again and Keep Current Plan', async () => {
    vi.spyOn(eventService, 'callCopilot').mockRejectedValueOnce(
      new Error('Network offline or backend timeout')
    );

    render(
      <VeyraCopilot
        eventContext={sampleEventContext}
        currentPlan={sampleCurrentPlan}
        onApplyPlanChanges={vi.fn()}
        isOpen={true}
        onToggleOpen={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/Ask Veyra Copilot to modify your plan/i);
    fireEvent.change(input, { target: { value: 'Add fireworks' } });
    fireEvent.click(screen.getByLabelText(/Send prompt to Veyra Copilot/i));

    await waitFor(() => {
      expect(screen.getByText(/I couldn't update your plan right now/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Keep Current Plan/i })).toBeInTheDocument();
    });
  });

  // Test 10: Missing item can become a task
  it('10. Missing item can become a task: clicking "Add to Tasks" converts Copilot missing item to local task', async () => {
    const mockResponse: CopilotResponse = {
      message: 'Audit complete. Flagged missing items.',
      requiresConfirmation: false,
      affectedSections: ['missingItems'],
      changes: {
        missingItems: ['Arrange transportation for elderly guests'],
      },
    };

    vi.spyOn(eventService, 'callCopilot').mockResolvedValueOnce({
      response: mockResponse,
      isFallback: false,
    });

    render(
      <PlanningDashboard
        data={sampleDashboardData}
        onBackToHome={vi.fn()}
        onStartNewPlan={vi.fn()}
      />
    );

    const input = screen.getByLabelText(/Ask Veyra Copilot to modify your plan/i);
    fireEvent.change(input, { target: { value: 'What am I still missing?' } });
    fireEvent.click(screen.getByLabelText(/Send prompt to Veyra Copilot/i));

    await waitFor(() => {
      expect(screen.getAllByText(/Arrange transportation for elderly guests/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByRole('button', { name: /Add to Tasks/i }).length).toBeGreaterThanOrEqual(1);
    });

    const addBtns = screen.getAllByRole('button', { name: /Add to Tasks/i });
    fireEvent.click(addBtns[0]);

    await waitFor(() => {
      expect(screen.getByText(/Added/i)).toBeInTheDocument();
    });
  });
});
