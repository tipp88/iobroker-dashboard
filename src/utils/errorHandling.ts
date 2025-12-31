export class ConfigValidationError extends Error {
  errors: string[];
  constructor(errors: string[]) {
    super(`Configuration validation failed: ${errors.join(', ')}`);
    this.name = 'ConfigValidationError';
    this.errors = errors;
  }
}

export class StateValidationError extends Error {
  stateId: string;
  constructor(stateId: string, message: string) {
    super(`State validation failed for ${stateId}: ${message}`);
    this.name = 'StateValidationError';
    this.stateId = stateId;
  }
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};
