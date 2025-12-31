import { useState, useCallback } from 'react';
import { iobrokerClient } from '../api/iobroker';
import type { DeviceValidationResult } from '../types/userConfig';

export const useStateValidation = () => {
  const [validationResults, setValidationResults] = useState<
    Record<string, DeviceValidationResult>
  >({});
  const [isValidating, setIsValidating] = useState<Record<string, boolean>>({});

  const validateState = useCallback(async (stateId: string): Promise<DeviceValidationResult> => {
    // Set loading state
    setIsValidating((prev) => ({ ...prev, [stateId]: true }));

    try {
      const result = await iobrokerClient.validateState(stateId);

      // Store result
      setValidationResults((prev) => ({ ...prev, [stateId]: result }));

      // Clear loading state
      setIsValidating((prev) => ({ ...prev, [stateId]: false }));

      return result;
    } catch (error) {
      const errorResult: DeviceValidationResult = {
        isValid: false,
        stateId,
        error: error instanceof Error ? error.message : 'Validation failed',
      };

      setValidationResults((prev) => ({ ...prev, [stateId]: errorResult }));
      setIsValidating((prev) => ({ ...prev, [stateId]: false }));

      return errorResult;
    }
  }, []);

  const validateMultipleStates = useCallback(async (stateIds: string[]): Promise<DeviceValidationResult[]> => {
    // Set loading state for all
    const loadingState = stateIds.reduce((acc, id) => ({ ...acc, [id]: true }), {});
    setIsValidating((prev) => ({ ...prev, ...loadingState }));

    try {
      const results = await iobrokerClient.validateMultipleStates(stateIds);

      // Store all results
      const resultsMap = results.reduce(
        (acc, result) => ({ ...acc, [result.stateId]: result }),
        {}
      );
      setValidationResults((prev) => ({ ...prev, ...resultsMap }));

      // Clear loading state
      const clearedState = stateIds.reduce((acc, id) => ({ ...acc, [id]: false }), {});
      setIsValidating((prev) => ({ ...prev, ...clearedState }));

      return results;
    } catch (error) {
      const clearedState = stateIds.reduce((acc, id) => ({ ...acc, [id]: false }), {});
      setIsValidating((prev) => ({ ...prev, ...clearedState }));
      throw error;
    }
  }, []);

  const clearValidation = useCallback((stateId: string) => {
    setValidationResults((prev) => {
      const { [stateId]: removed, ...rest } = prev;
      return rest;
    });
    setIsValidating((prev) => {
      const { [stateId]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllValidations = useCallback(() => {
    setValidationResults({});
    setIsValidating({});
  }, []);

  return {
    validateState,
    validateMultipleStates,
    validationResults,
    isValidating,
    clearValidation,
    clearAllValidations,
  };
};
