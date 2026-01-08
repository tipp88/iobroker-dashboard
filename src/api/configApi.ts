import type { TodoJsonStructure } from '../types/userConfig';

class ConfigApi {
  /**
   * Load configuration from todo.json
   * Note: In production, this would be an API endpoint
   */
  async loadConfig(): Promise<TodoJsonStructure> {
    try {
      // Try to load from the public folder or backend API
      const response = await fetch('/config/todo.json');
      if (!response.ok) {
        throw new Error('Failed to load configuration');
      }
      return response.json();
    } catch (error) {
      console.warn('Could not load todo.json from server:', error);
      // Fallback to localStorage backup if available
      const backup = localStorage.getItem('todo-json-backup');
      if (backup) {
        return JSON.parse(backup);
      }
      throw error;
    }
  }

  /**
   * Save configuration
   * Note: This requires a backend endpoint to write to the file system
   * For now, we persist to localStorage only
   */
  async saveConfig(config: TodoJsonStructure): Promise<void> {
    try {
      // In a real implementation, this would call a backend API
      // POST /api/config/save
      console.warn('File system save not implemented - using localStorage only');
      localStorage.setItem('todo-json-backup', JSON.stringify(config, null, 2));

      // TODO: Implement actual file write via backend API
      // await fetch('/api/config/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(config)
      // });
    } catch (error) {
      console.error('Failed to save configuration:', error);
      throw error;
    }
  }

  /**
   * Export configuration to a downloadable JSON file
   */
  exportToFile(
    config: Partial<TodoJsonStructure>,
    filename: string = 'iobroker-config.json'
  ): void {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import configuration from a JSON file
   */
  async importFromFile(file: File): Promise<Partial<TodoJsonStructure>> {
    try {
      const text = await file.text();
      const config = JSON.parse(text);
      return config;
    } catch (error) {
      throw new Error('Invalid JSON file');
    }
  }

  /**
   * Validate configuration structure
   */
  validateConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate userDevices structure
    if (config.userDevices) {
      if (!config.userDevices.climate || !Array.isArray(config.userDevices.climate)) {
        errors.push('Invalid userDevices.climate structure - expected array');
      }
      if (!config.userDevices.sensors || !Array.isArray(config.userDevices.sensors)) {
        errors.push('Invalid userDevices.sensors structure - expected array');
      }
      if (!config.userDevices.switches || !Array.isArray(config.userDevices.switches)) {
        errors.push('Invalid userDevices.switches structure - expected array');
      }
      if (!config.userDevices.shutters || !Array.isArray(config.userDevices.shutters)) {
        errors.push('Invalid userDevices.shutters structure - expected array');
      }
    }

    // Validate userControlPanels structure
    if (config.userControlPanels) {
      if (typeof config.userControlPanels !== 'object') {
        errors.push('Invalid userControlPanels structure - expected object');
      }
    }

    // Validate userLinks structure
    if (config.userLinks) {
      if (!Array.isArray(config.userLinks)) {
        errors.push('Invalid userLinks structure - expected array');
      } else {
        config.userLinks.forEach((link: any, index: number) => {
          if (typeof link.id !== 'string' || link.id.trim() === '') {
            errors.push(`Invalid userLinks[${index}].id - expected non-empty string`);
          }
          if (typeof link.name !== 'string' || link.name.trim() === '') {
            errors.push(`Invalid userLinks[${index}].name - expected non-empty string`);
          }
          if (typeof link.url !== 'string' || link.url.trim() === '') {
            errors.push(`Invalid userLinks[${index}].url - expected non-empty string`);
          }
          if (typeof link.iconKey !== 'string' || link.iconKey.trim() === '') {
            errors.push(`Invalid userLinks[${index}].iconKey - expected non-empty string`);
          }
        });
      }
    }

    // Validate userPanelOrder structure
    if (config.userPanelOrder) {
      if (typeof config.userPanelOrder !== 'object') {
        errors.push('Invalid userPanelOrder structure - expected object');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Load shared links configuration
   */
  async loadLinks(): Promise<any[] | null> {
    try {
      const response = await fetch('/config/links.json');
      if (!response.ok) {
        return null;
      }
      return response.json();
    } catch {
      return null;
    }
  }

  /**
   * Save shared links configuration
   */
  async saveLinks(links: any[]): Promise<boolean> {
    try {
      const response = await fetch('/config/links.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(links),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const configApi = new ConfigApi();
