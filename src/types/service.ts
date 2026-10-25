/**
 * Veyra Service Layer Contracts
 * Defines request and response structures for decoupled backend communication.
 */

import type { EventCategory } from './event';

export interface ServiceResponse<T> {
  data: T | null;
  error: ServiceError | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  timestamp: string;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface CreateEventDraftInput {
  title: string;
  category: EventCategory;
  guestCount: number;
  targetBudget?: number;
  location?: string;
  preferredVibe?: string;
}

export interface EventPlanFilter {
  category?: EventCategory;
  searchQuery?: string;
}
