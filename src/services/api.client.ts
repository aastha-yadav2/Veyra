/**
 * Veyra API Client Adapter
 * 
 * Provides a clean boundary between the UI and backend services.
 * Features:
 * - Decoupled HTTP transport
 * - Safe environment variable access without leaking private tokens
 * - Standardized ServiceResponse<T> envelope
 */

import type { ServiceResponse, ServiceError } from '../types/service';

export interface RequestConfig {
  useMock?: boolean;
  mockDelayMs?: number;
  shouldSimulateError?: boolean;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly isMockEnabled: boolean;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    this.isMockEnabled = import.meta.env.VITE_ENABLE_MOCK_SERVICES === 'true';
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public isUsingMock(): boolean {
    return this.isMockEnabled;
  }

  /**
   * Performs an HTTP POST request to backend API
   */
  public async post<T>(endpoint: string, body: unknown): Promise<ServiceResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }

        const errorMsg =
          errorData && typeof errorData === 'object' && 'error' in errorData
            ? (errorData as { error: { message: string } }).error.message
            : `Server returned status ${response.status}`;

        return {
          data: null,
          error: {
            code: `HTTP_${response.status}`,
            message: errorMsg,
          },
          status: 'error',
          timestamp: new Date().toISOString(),
        };
      }

      const data = (await response.json()) as T;
      return {
        data,
        error: null,
        status: 'success',
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      return {
        data: null,
        error: {
          code: 'NETWORK_ERROR',
          message: err instanceof Error ? err.message : 'Failed to connect to backend service',
        },
        status: 'error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Helper to wrap data into a standardized ServiceResponse with optional simulated latency.
   */
  public async wrapMockResponse<T>(
    dataProducer: () => T,
    config: RequestConfig = {}
  ): Promise<ServiceResponse<T>> {
    const delay = config.mockDelayMs ?? 400;

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    if (config.shouldSimulateError) {
      const error: ServiceError = {
        code: 'SIMULATED_BACKEND_ERROR',
        message: 'The event intelligence engine experienced a simulated hiccup. Please try again.',
        details: { hint: 'Toggle mock error state off in testing controls.' },
      };

      return {
        data: null,
        error,
        status: 'error',
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const data = dataProducer();
      return {
        data,
        error: null,
        status: 'success',
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      const error: ServiceError = {
        code: 'CLIENT_EXECUTION_ERROR',
        message: err instanceof Error ? err.message : 'Unknown execution failure',
      };
      return {
        data: null,
        error,
        status: 'error',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const apiClient = new ApiClient();
