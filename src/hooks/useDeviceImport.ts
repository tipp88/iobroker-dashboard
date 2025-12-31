import { useState, useCallback } from 'react';
import { configApi } from '../api/configApi';
import type { TodoJsonStructure } from '../types/userConfig';

export const useDeviceImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const importFromFile = useCallback(async (file: File): Promise<Partial<TodoJsonStructure> | null> => {
    setIsImporting(true);
    setImportError(null);

    try {
      const config = await configApi.importFromFile(file);

      // Validate the config
      const validation = configApi.validateConfig(config);
      if (!validation.isValid) {
        setImportError(validation.errors.join(', '));
        setIsImporting(false);
        return null;
      }

      setIsImporting(false);
      return config;
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Invalid JSON file');
      setIsImporting(false);
      return null;
    }
  }, []);

  const importFromText = useCallback((jsonText: string): Partial<TodoJsonStructure> | null => {
    setImportError(null);

    try {
      const config = JSON.parse(jsonText);

      // Validate the config
      const validation = configApi.validateConfig(config);
      if (!validation.isValid) {
        setImportError(validation.errors.join(', '));
        return null;
      }

      return config;
    } catch (error) {
      setImportError('Invalid JSON format');
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setImportError(null);
  }, []);

  return {
    importFromFile,
    importFromText,
    isImporting,
    importError,
    clearError,
  };
};
