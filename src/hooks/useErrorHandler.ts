// src/hooks/useErrorHandler.ts
'use client';

import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface ErrorState {
  error: Error | null;
  message: string | null;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    message: null,
  });

  /**
   * Handle error and set error state
   */
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error('Client-side error', error);
    
    setErrorState({
      error: error instanceof Error ? error : new Error(errorMessage),
      message: customMessage || errorMessage,
    });
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setErrorState({ error: null, message: null });
  }, []);

  /**
   * Wrapper for async functions to handle errors
   */
  const withErrorHandler = useCallback(
    <T extends (...args: any[]) => Promise<any>>(fn: T) => {
      return async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
        try {
          clearError();
          return await fn(...args);
        } catch (error) {
          handleError(error);
          return undefined;
        }
      };
    },
    [handleError, clearError]
  );

  return {
    error: errorState.error,
    errorMessage: errorState.message,
    hasError: !!errorState.error,
    handleError,
    clearError,
    withErrorHandler,
  };
}

/**
 * Example usage:
 * 
 * const { error, errorMessage, handleError, clearError, withErrorHandler } = useErrorHandler();
 * 
 * // Option 1: Wrap async function
 * const fetchData = withErrorHandler(async () => {
 *   const response = await fetch('/api/data');
 *   if (!response.ok) throw new Error('Failed to fetch');
 *   return response.json();
 * });
 * 
 * // Option 2: Manual error handling
 * try {
 *   await someAsyncFunction();
 * } catch (err) {
 *   handleError(err, 'Custom error message');
 * }
 * 
 * // Display error in UI
 * {errorMessage && (
 *   <div className="error-alert">
 *     {errorMessage}
 *     <button onClick={clearError}>Dismiss</button>
 *   </div>
 * )}
 */