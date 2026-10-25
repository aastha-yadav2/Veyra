import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { WizardProgress } from './WizardProgress';
import { EventTypeStep } from './EventTypeStep';
import { EventDetailsStep } from './EventDetailsStep';
import { BudgetStep } from './BudgetStep';
import { PreferencesStep } from './PreferencesStep';
import { GeneratePlanStep } from './GeneratePlanStep';
import { eventService } from '../../services/event.service';
import type { 
  EventCategory, 
  EventCreationFormData, 
  FullPlanningDashboardData, 
  DashboardTask 
} from '../../types/event';

interface EventWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: EventCategory;
  onPlanGenerated: (data: FullPlanningDashboardData) => void;
}

export const EventWizard: React.FC<EventWizardProps> = ({
  isOpen,
  onClose,
  initialCategory = 'wedding',
  onPlanGenerated,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<EventCreationFormData>({
    eventType: initialCategory,
    eventName: '',
    date: '',
    location: '',
    guestCount: 150,
    budget: 600000,
    currency: 'INR',
    style: 'Elegant Minimal',
    preferences: ['Vegetarian food', 'Minimal decoration'],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const stepTitles = [
    'Event Type',
    'Event Details',
    'Budget & Currency',
    'Style & Preferences',
    'Review & Generate',
  ];

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.eventName.trim()) {
      errors.eventName = 'Event name is required';
    } else if (formData.eventName.trim().length < 2) {
      errors.eventName = 'Event name must be at least 2 characters';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    } else {
      const parsedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(parsedDate.getTime())) {
        errors.date = 'Invalid date format';
      } else if (parsedDate < today) {
        errors.date = 'Event date cannot be in the past';
      }
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (!formData.guestCount || formData.guestCount <= 0 || !Number.isInteger(formData.guestCount)) {
      errors.guestCount = 'Guest count must be a positive integer';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.budget || formData.budget <= 0) {
      errors.budget = 'Budget must be greater than zero';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 2) {
      if (!validateStep2()) return;
    }
    if (currentStep === 3) {
      if (!validateStep3()) return;
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setGenerationError(null);
    }
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setGenerationError(null);

    try {
      const result = await eventService.generatePlanFromBackend(formData);
      const rawPlan = result.plan;

      // Map timeline items to interactive DashboardTasks
      const tasks: DashboardTask[] = rawPlan.timeline.map((item, idx) => ({
        id: `task-t-${idx + 1}`,
        title: item.task,
        deadline: item.deadline,
        priority: item.priority,
        category: item.category,
        isCompleted: false,
        source: 'timeline',
      }));

      const fullDashboardData: FullPlanningDashboardData = {
        eventDetails: formData,
        rawPlan,
        tasks,
        vendorTaskStatus: {},
        isFallbackPlan: result.isFallback,
        generatedAt: new Date().toISOString(),
      };

      onPlanGenerated(fullDashboardData);
      onClose();
    } catch (err) {
      setGenerationError(
        err instanceof Error ? err.message : 'An error occurred while generating your plan'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Your Event Blueprint"
      subtitle="Follow the step-by-step assistant to architect an AI-powered plan."
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Progress Tracker */}
        <WizardProgress
          currentStep={currentStep}
          totalSteps={5}
          stepTitles={stepTitles}
        />

        {/* Step Views */}
        <div className="min-h-[280px]">
          {currentStep === 1 && (
            <EventTypeStep
              selectedType={formData.eventType}
              onSelect={(type) => handleFieldChange('eventType', type)}
            />
          )}

          {currentStep === 2 && (
            <EventDetailsStep
              eventName={formData.eventName}
              date={formData.date}
              location={formData.location}
              guestCount={formData.guestCount}
              errors={validationErrors}
              onChange={handleFieldChange}
            />
          )}

          {currentStep === 3 && (
            <BudgetStep
              budget={formData.budget}
              currency={formData.currency}
              errors={validationErrors}
              onChange={handleFieldChange}
            />
          )}

          {currentStep === 4 && (
            <PreferencesStep
              style={formData.style}
              preferences={formData.preferences}
              onChangeStyle={(s) => handleFieldChange('style', s)}
              onAddPreference={(p) =>
                setFormData((prev) => ({
                  ...prev,
                  preferences: [...prev.preferences, p],
                }))
              }
              onRemovePreference={(idx) =>
                setFormData((prev) => ({
                  ...prev,
                  preferences: prev.preferences.filter((_, i) => i !== idx),
                }))
              }
            />
          )}

          {currentStep === 5 && (
            <GeneratePlanStep
              formData={formData}
              isLoading={isLoading}
              onGenerate={handleGeneratePlan}
              error={generationError}
              onRetry={handleGeneratePlan}
              onEdit={() => setCurrentStep(2)}
            />
          )}
        </div>

        {/* Navigation Action Buttons */}
        {!isLoading && (
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            {currentStep > 1 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
            )}

            {currentStep < 5 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
