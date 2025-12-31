import { useState, useEffect } from 'react';

interface ExistingPanel {
  name: string;
  icon?: string;
  label?: string;
  function?: string;
  states: Record<string, any>;
}

export const useExistingPanels = () => {
  const [existingPanels, setExistingPanels] = useState<Record<string, ExistingPanel>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPanels = async () => {
      try {
        // Try to load from the config API or direct import
        // For now, we'll use a placeholder - in production this would fetch from todo.json
        // You can replace this with actual fetch logic

        // Note: This hook is currently unused.
        // We use existingPanels.config.ts directly instead.
        setExistingPanels({});
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load existing panels:', err);
        setError(err instanceof Error ? err.message : 'Failed to load panels');
        setIsLoading(false);
      }
    };

    loadPanels();
  }, []);

  return { existingPanels, isLoading, error };
};
