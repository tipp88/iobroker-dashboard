import { useState } from 'react';
import type { SensorDevice, SensorType } from '../../../types/devices';
import { StateValidator } from '../StateValidator';
import { ROOMS } from '../../../config/devices.config';
import { cn } from '../../../utils/cn';

interface SensorDeviceFormProps {
  initialDevice?: SensorDevice;
  onSubmit: (device: SensorDevice) => void;
  onCancel: () => void;
}

const SENSOR_TYPES: { value: SensorType; label: string; defaultUnit: string }[] = [
  { value: 'temperature', label: 'Temperature', defaultUnit: '°C' },
  { value: 'humidity', label: 'Humidity', defaultUnit: '%' },
  { value: 'pressure', label: 'Pressure', defaultUnit: 'hPa' },
  { value: 'light', label: 'Light', defaultUnit: 'lux' },
];

export const SensorDeviceForm = ({ initialDevice, onSubmit, onCancel }: SensorDeviceFormProps) => {
  const [formData, setFormData] = useState<Partial<SensorDevice>>({
    id: initialDevice?.id || '',
    name: initialDevice?.name || '',
    room: initialDevice?.room || '',
    type: 'sensor',
    sensorType: initialDevice?.sensorType || 'temperature',
    unit: initialDevice?.unit || '°C',
    icon: initialDevice?.icon || 'sensors',
    isUserAdded: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSensorTypeChange = (sensorType: SensorType) => {
    const sensorConfig = SENSOR_TYPES.find((s) => s.value === sensorType);
    setFormData({
      ...formData,
      sensorType,
      unit: sensorConfig?.defaultUnit || formData.unit,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.id?.trim()) {
      newErrors.id = 'State ID is required';
    }
    if (!formData.name?.trim()) {
      newErrors.name = 'Device name is required';
    }
    if (!formData.room?.trim()) {
      newErrors.room = 'Room is required';
    }
    if (!formData.sensorType) {
      newErrors.sensorType = 'Sensor type is required';
    }
    if (!formData.unit?.trim()) {
      newErrors.unit = 'Unit is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData as SensorDevice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Device Name */}
      <div className="space-y-2">
        <label className="text-body text-text-secondary font-medium">
          Device Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            setErrors({ ...errors, name: '' });
          }}
          placeholder="e.g. Living Room Temperature"
          className={cn(
            'w-full px-3 py-2 bg-neutral-surface2 border rounded-lg',
            'text-text-primary text-body',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
            'transition-all',
            errors.name ? 'border-red-500' : 'border-stroke-default'
          )}
        />
        {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
      </div>

      {/* State ID */}
      <StateValidator
        stateId={formData.id || ''}
        onStateIdChange={(value) => {
          setFormData({ ...formData, id: value });
          setErrors({ ...errors, id: '' });
        }}
        label="State ID"
        required
        placeholder="e.g. hm-rpc.0.ABC123.1.TEMPERATURE"
      />
      {errors.id && <p className="text-sm text-red-400 mt-1">{errors.id}</p>}

      {/* Room */}
      <div className="space-y-2">
        <label className="text-body text-text-secondary font-medium">
          Room <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.room}
          onChange={(e) => {
            setFormData({ ...formData, room: e.target.value });
            setErrors({ ...errors, room: '' });
          }}
          className={cn(
            'w-full px-3 py-2 bg-neutral-surface2 border rounded-lg',
            'text-text-primary text-body',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
            'transition-all',
            errors.room ? 'border-red-500' : 'border-stroke-default'
          )}
        >
          <option value="">Select a room</option>
          {Object.entries(ROOMS).map(([key, room]) => (
            <option key={key} value={key}>
              {room.name}
            </option>
          ))}
        </select>
        {errors.room && <p className="text-sm text-red-400">{errors.room}</p>}
      </div>

      {/* Sensor Type */}
      <div className="space-y-2">
        <label className="text-body text-text-secondary font-medium">
          Sensor Type <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.sensorType}
          onChange={(e) => {
            handleSensorTypeChange(e.target.value as SensorType);
            setErrors({ ...errors, sensorType: '' });
          }}
          className={cn(
            'w-full px-3 py-2 bg-neutral-surface2 border rounded-lg',
            'text-text-primary text-body',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
            'transition-all',
            errors.sensorType ? 'border-red-500' : 'border-stroke-default'
          )}
        >
          {SENSOR_TYPES.map((sensor) => (
            <option key={sensor.value} value={sensor.value}>
              {sensor.label}
            </option>
          ))}
        </select>
        {errors.sensorType && <p className="text-sm text-red-400">{errors.sensorType}</p>}
      </div>

      {/* Unit */}
      <div className="space-y-2">
        <label className="text-body text-text-secondary font-medium">
          Unit <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.unit}
          onChange={(e) => {
            setFormData({ ...formData, unit: e.target.value });
            setErrors({ ...errors, unit: '' });
          }}
          placeholder="e.g. °C, %, hPa, lux"
          className={cn(
            'w-full px-3 py-2 bg-neutral-surface2 border rounded-lg',
            'text-text-primary text-body',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
            'transition-all',
            errors.unit ? 'border-red-500' : 'border-stroke-default'
          )}
        />
        {errors.unit && <p className="text-sm text-red-400">{errors.unit}</p>}
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <label className="text-body text-text-secondary font-medium">Icon (optional)</label>
        <input
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="e.g. sensors, thermostat, humidity"
          className="w-full px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        />
        <p className="text-xs text-text-secondary">
          Material Symbols icon name (default: sensors)
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-neutral-surface2 text-text-primary rounded-lg font-medium hover:bg-neutral-surface3 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
        >
          {initialDevice ? 'Update' : 'Add'} Device
        </button>
      </div>
    </form>
  );
};
