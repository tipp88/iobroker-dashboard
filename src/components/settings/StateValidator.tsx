import { useState } from 'react';
import { iobrokerClient } from '../../api/iobroker';
import type { DeviceValidationResult } from '../../types/userConfig';
import { cn } from '../../utils/cn';

interface StateValidatorProps {
  stateId: string;
  onStateIdChange: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

export const StateValidator = ({
  stateId,
  onStateIdChange,
  label = 'State ID',
  required = false,
  placeholder = 'e.g. hm-rpc.0.ABC123.1.TEMPERATURE',
}: StateValidatorProps) => {
  const [validationResult, setValidationResult] = useState<DeviceValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleTest = async () => {
    if (!stateId.trim()) {
      setValidationResult({
        isValid: false,
        stateId,
        error: 'State ID is required',
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await iobrokerClient.validateState(stateId);
      setValidationResult(result);
    } catch (error) {
      setValidationResult({
        isValid: false,
        stateId,
        error: error instanceof Error ? error.message : 'Validation failed',
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (value: string) => {
    onStateIdChange(value);
    // Clear validation result when input changes
    setValidationResult(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-body text-text-secondary font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={stateId}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'flex-1 px-3 py-2 bg-neutral-surface2 border rounded-lg',
            'text-text-primary text-body',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
            'transition-all',
            validationResult?.isValid === true
              ? 'border-green-500'
              : validationResult?.isValid === false
              ? 'border-red-500'
              : 'border-stroke-default'
          )}
        />

        <button
          onClick={handleTest}
          disabled={isValidating || !stateId.trim()}
          className={cn(
            'px-4 py-2 rounded-lg text-body font-medium transition-all',
            'bg-cyan-500 text-white hover:bg-cyan-600',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center gap-2'
          )}
        >
          {isValidating ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Testing
            </>
          ) : (
            'Test'
          )}
        </button>
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div
          className={cn(
            'px-3 py-2 rounded-lg text-sm flex items-start gap-2',
            validationResult.isValid
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          )}
        >
          {validationResult.isValid ? (
            <>
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="font-medium">Valid state</div>
                {validationResult.value !== undefined && validationResult.value !== null && (
                  <div className="text-xs opacity-80 mt-1">
                    Current value: {String(validationResult.value)}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="font-medium">Invalid state</div>
                {validationResult.error && (
                  <div className="text-xs opacity-80 mt-1">{validationResult.error}</div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
