import type { Device, ClimateDevice, SensorDevice, ShutterDevice } from '../types/devices';

/**
 * Validate device configuration before saving
 */
export const validateDevice = (device: Partial<Device>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Common validation
  if (!device.id || device.id.trim() === '') {
    errors.push('Device ID is required');
  }

  if (!device.name || device.name.trim() === '') {
    errors.push('Device name is required');
  }

  if (!device.room || device.room.trim() === '') {
    errors.push('Room is required');
  }

  if (!device.type) {
    errors.push('Device type is required');
  }

  // Type-specific validation
  if (device.type === 'climate') {
    const climate = device as Partial<ClimateDevice>;
    if (!climate.states?.currentTemp) {
      errors.push('Current temperature state ID is required');
    }
    if (!climate.states?.targetTemp) {
      errors.push('Target temperature state ID is required');
    }
    if (!climate.config?.minTemp && climate.config?.minTemp !== 0) {
      errors.push('Minimum temperature is required');
    }
    if (!climate.config?.maxTemp) {
      errors.push('Maximum temperature is required');
    }
    if (climate.config?.minTemp && climate.config?.maxTemp && climate.config.minTemp >= climate.config.maxTemp) {
      errors.push('Maximum temperature must be greater than minimum temperature');
    }
  }

  if (device.type === 'sensor') {
    const sensor = device as Partial<SensorDevice>;
    if (!sensor.sensorType) {
      errors.push('Sensor type is required');
    }
  }

  if (device.type === 'shutter') {
    const shutter = device as Partial<ShutterDevice>;
    if (!shutter.states?.level) {
      errors.push('Level state ID is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeString = (str: string): string => {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate state ID format (basic validation)
 */
export const isValidStateIdFormat = (stateId: string): boolean => {
  // State IDs should follow patterns like:
  // hm-rpc.0.ABC123.1.TEMPERATURE
  // 0_userdata.0.path.to.state
  // shelly.0.DEVICE#0.Switch
  const stateIdPattern = /^[a-zA-Z0-9_.-]+(\.[a-zA-Z0-9_-]+)+$/;
  return stateIdPattern.test(stateId);
};
