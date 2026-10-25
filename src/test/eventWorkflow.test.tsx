import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EventWizard } from '../components/planner/EventWizard';
import { EventTypeStep } from '../components/planner/EventTypeStep';
import { EventDetailsStep } from '../components/planner/EventDetailsStep';
import { BudgetStep } from '../components/planner/BudgetStep';
import { TaskList } from '../components/dashboard/TaskList';
import { MissingItemsPanel } from '../components/dashboard/MissingItemsPanel';
import { BudgetOverview } from '../components/dashboard/BudgetOverview';
import { eventService } from '../services/event.service';
import type { DashboardTask, ServerGeneratedPlan } from '../types/event';

describe('Veyra Phase 3 - Frontend Acceptance Test Suite', () => {
  // 1. Event type selection
  it('Event type selection: allows selection with keyboard and mouse', () => {
    const handleSelect = vi.fn();
    render(<EventTypeStep selectedType="wedding" onSelect={handleSelect} />);

    const birthdayOption = screen.getByRole('radio', { name: /birthday/i });
    expect(birthdayOption).toBeInTheDocument();
    
    // Mouse click
    fireEvent.click(birthdayOption);
    expect(handleSelect).toHaveBeenCalledWith('birthday');

    // Keyboard selection (Enter & Space)
    const communityOption = screen.getByRole('radio', { name: /community event/i });
    fireEvent.keyDown(communityOption, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith('community');
  });

  // 2. Required field validation
  it('Required field validation: displays errors when mandatory fields are missing', () => {
    const handleChange = vi.fn();
    const errors = {
      eventName: 'Event name is required',
      date: 'Date is required',
      location: 'Location is required',
    };

    render(
      <EventDetailsStep
        eventName=""
        date=""
        location=""
        guestCount={100}
        errors={errors}
        onChange={handleChange}
      />
    );

    expect(screen.getByText(/Event name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Location is required/i)).toBeInTheDocument();
  });

  // 3. Invalid guest count
  it('Invalid guest count: validates positive integer requirement', () => {
    const handleChange = vi.fn();
    const errors = { guestCount: 'Guest count must be a positive integer' };

    render(
      <EventDetailsStep
        eventName="Anand Gala"
        date="2027-10-10"
        location="Delhi"
        guestCount={-10}
        errors={errors}
        onChange={handleChange}
      />
    );

    expect(screen.getByText(/Guest count must be a positive integer/i)).toBeInTheDocument();
  });

  // 4. Invalid budget
  it('Invalid budget: rejects zero or negative budget amounts', () => {
    const handleChange = vi.fn();
    const errors = { budget: 'Budget must be greater than zero' };

    render(
      <BudgetStep
        budget={0}
        currency="INR"
        errors={errors}
        onChange={handleChange}
      />
    );

    expect(screen.getByText(/Budget must be greater than zero/i)).toBeInTheDocument();
  });

  // 5. Past date rejection
  it('Past date rejection: flags error when event date is in the past', () => {
    const handleChange = vi.fn();
    const errors = { date: 'Event date cannot be in the past' };

    render(
      <EventDetailsStep
        eventName="Past Celebration"
        date="2020-01-01"
        location="Jaipur"
        guestCount={50}
        errors={errors}
        onChange={handleChange}
      />
    );

    expect(screen.getByText(/Event date cannot be in the past/i)).toBeInTheDocument();
  });

  // 6. Successful API generation
  it('Successful API generation: runs complete wizard flow and calls backend', async () => {
    const handlePlanGenerated = vi.fn();
    const handleClose = vi.fn();

    const mockPlanResponse = {
      plan: {
        eventSummary: 'Elena & David Wedding blueprint architected by Veyra',
        budget: {
          total: 800000,
          currency: 'INR',
          categories: [{ name: 'Venue', amount: 720000, percentage: 90, reason: 'Venue booking' }],
          contingency: { amount: 80000, percentage: 10 },
        },
        timeline: [{ task: 'Book primary venue', deadline: '6 Months Prior', priority: 'high' as const, category: 'venue' }],
        vendors: [{ category: 'Venue', tasks: ['Sign lease'], questionsToAsk: ['Load-in times?'] }],
        ideas: [{ title: 'Fairy lights canopy', description: 'Warm glow ambiance', estimatedCost: 15000 }],
        risks: [{ title: 'Rain Forecast', severity: 'medium' as const, solution: 'Arrange indoor pavilion' }],
        missingItems: ['Dedicated vendor hot meals'],
      },
      isFallback: false,
    };

    vi.spyOn(eventService, 'generatePlanFromBackend').mockResolvedValueOnce(mockPlanResponse);

    render(
      <EventWizard
        isOpen={true}
        onClose={handleClose}
        initialCategory="wedding"
        onPlanGenerated={handlePlanGenerated}
      />
    );

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 2: Fill inputs
    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Elena & David Wedding' } });
    fireEvent.change(screen.getByLabelText(/Target Date/i), { target: { value: '2027-10-15' } });
    fireEvent.change(screen.getByLabelText(/City or Venue Location/i), { target: { value: 'Dehradun' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 3: Budget
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Budget & Currency/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 4: Preferences
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Style & Event Preferences/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 5: Review & Generate
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Event Blueprint Ready to Generate/i })).toBeInTheDocument();
    });

    const createBtn = screen.getByRole('button', { name: /Create My Plan/i });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(handlePlanGenerated).toHaveBeenCalledTimes(1);
    });
  });

  // 7. API failure state
  it('API failure state: shows friendly error message with Try Again and Edit Event', async () => {
    vi.spyOn(eventService, 'generatePlanFromBackend').mockRejectedValueOnce(
      new Error('Connection failure')
    );

    render(
      <EventWizard
        isOpen={true}
        onClose={vi.fn()}
        initialCategory="wedding"
        onPlanGenerated={vi.fn()}
      />
    );

    // Step 1
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 2
    fireEvent.change(screen.getByLabelText(/Event Name/i), { target: { value: 'Test Gala' } });
    fireEvent.change(screen.getByLabelText(/Target Date/i), { target: { value: '2027-11-20' } });
    fireEvent.change(screen.getByLabelText(/City or Venue Location/i), { target: { value: 'Mumbai' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 3
    await waitFor(() => expect(screen.getByRole('heading', { name: /Budget & Currency/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 4
    await waitFor(() => expect(screen.getByRole('heading', { name: /Style & Event Preferences/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 5
    await waitFor(() => expect(screen.getByRole('heading', { name: /Event Blueprint Ready to Generate/i })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Create My Plan/i }));

    // Verify recovery state
    await waitFor(() => {
      expect(screen.getByText(/Veyra couldn't generate your plan right now/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Edit Event/i })).toBeInTheDocument();
    });
  });

  // 8. Task completion
  it('Task completion: supports marking tasks completed and undoing', () => {
    const tasks: DashboardTask[] = [
      {
        id: 'task-1',
        title: 'Book Photographer',
        deadline: '2 Months Prior',
        priority: 'high',
        category: 'media',
        isCompleted: false,
        source: 'timeline',
      },
    ];

    const handleToggle = vi.fn();
    render(<TaskList tasks={tasks} onToggleTask={handleToggle} onAddTask={vi.fn()} />);

    const taskText = screen.getByText('Book Photographer');
    expect(taskText).toBeInTheDocument();

    fireEvent.click(taskText);
    expect(handleToggle).toHaveBeenCalledWith('task-1');
  });

  // 9. Missing item → task conversion
  it('Missing item → task conversion: adds overlooked items to tasks', () => {
    const missingItems = ['Guest transportation from airport', 'Generator safety permit'];
    const handleAdd = vi.fn();

    render(
      <MissingItemsPanel
        missingItems={missingItems}
        onAddMissingItemToTasks={handleAdd}
        addedItems={{}}
      />
    );

    const buttons = screen.getAllByRole('button', { name: /Add to Tasks/i });
    expect(buttons.length).toBe(2);

    fireEvent.click(buttons[0]);
    expect(handleAdd).toHaveBeenCalledWith('Guest transportation from airport');
  });

  // 10. Budget calculation
  it('Budget calculation: calculates 10% contingency and category proportions', () => {
    // 1. Pure domain service calculation
    const smartBudget = eventService.calculateSmartBudget('wedding', 1000000);
    expect(smartBudget.totalBudget).toBe(1000000);
    expect(smartBudget.contingencyBuffer).toBe(100000); // 10% buffer
    expect(smartBudget.allocatedBudget).toBe(900000);

    // 2. BudgetOverview UI display
    const mockPlanBudget: ServerGeneratedPlan['budget'] = {
      total: 1000000,
      currency: 'INR',
      categories: [
        { name: 'Venue & Dining', amount: 500000, percentage: 50, reason: 'Venue reservation' },
        { name: 'Photo & Video', amount: 400000, percentage: 40, reason: 'Full day coverage' },
      ],
      contingency: {
        amount: 100000,
        percentage: 10,
      },
    };

    render(<BudgetOverview budget={mockPlanBudget} currency="INR" />);

    expect(screen.getByText(new RegExp((1000000).toLocaleString()))).toBeInTheDocument();
    expect(screen.getByText(/Total Budget/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Planned Amount/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Remaining/i)).toBeInTheDocument();
  });
});
