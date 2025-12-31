import { useState } from 'react';
import type { ClimateDevice } from '../../../types/devices';
import { StateValidator } from '../StateValidator';
import { ROOMS } from '../../../config/devices.config';
import { cn } from '../../../utils/cn';

interface ClimateDeviceFormProps {
  initialDevice?: ClimateDevice;
  onSubmit: (device: ClimateDevice) => void;
  onCancel: () => void;
}

export const ClimateDeviceForm = ({
  initialDevice,
  onSubmit,
  onCancel,
}: ClimateDeviceFormProps) => {
  const [formData, setFormData] = useState<Partial<ClimateDevice>>({
    id: initialDevice?.id || '',
    name: initialDevice?.name || '',
    room: initialDevice?.room || '',
    type: 'climate',
    capabilities: initialDevice?.capabilities || ['temperature', 'heating'],
    states: {
      currentTemp: initialDevice?.states?.currentTemp || '',
      targetTemp: initialDevice?.states?.targetTemp || '',
      mode: initialDevice?.states?.mode || '',
    },
    config: {
      minTemp: initialDevice?.config?.minTemp || 15,
      maxTemp: initialDevice?.config?.maxTemp || 30,
      step: initialDevice?.config?.step || 0.5,
      unit: initialDevice?.config?.unit || '°C',
    },
    icon: initialDevice?.icon || 'thermostat',
    isUserAdded: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.id?.trim()) {
      newErrors.id = 'Device ID is required';
    }
    if (!formData.name?.trim()) {
      newErrors.name = 'Device name is required';
    }
    if (!formData.room?.trim()) {
      newErrors.room = 'Room is required';
    }
    if (!formData.states?.currentTemp?.trim()) {
      newErrors.currentTemp = 'Current temperature state ID is required';
    }
    if (!formData.states?.targetTemp?.trim()) {
      newErrors.targetTemp = 'Target temperature state ID is required';
    }
    if (!formData.config?.minTemp && formData.config?.minTemp !== 0) {
      newErrors.minTemp = 'Minimum temperature is required';
    }
    if (!formData.config?.maxTemp) {
      newErrors.maxTemp = 'Maximum temperature is required';
    }
    if (
      formData.config?.minTemp &&
      formData.config?.maxTemp &&
      formData.config.minTemp >= formData.config.maxTemp
    ) {
      newErrors.maxTemp = 'Maximum temperature must be greater than minimum';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Set ID from target temp state if not provided
    if (!formData.id) {
      formData.id = formData.states!.targetTemp;
    }

    onSubmit(formData as ClimateDevice);
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
          placeholder="e.g. Living Room Thermostat"
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

      {/* Current Temperature State ID */}
      <StateValidator
        stateId={formData.states?.currentTemp || ''}
        onStateIdChange={(value) => {
          setFormData({
            ...formData,
            states: { ...formData.states!, currentTemp: value },
          });
          setErrors({ ...errors, currentTemp: '' });
        }}
        label="Current Temperature State ID"
        required
        placeholder="e.g. hm-rpc.0.ABC123.1.ACTUAL_TEMPERATURE"
      />
      {errors.currentTemp && <p className="text-sm text-red-400 mt-1">{errors.currentTemp}</p>}

      {/* Target Temperature State ID */}
      <StateValidator
        stateId={formData.states?.targetTemp || ''}
        onStateIdChange={(value) => {
          setFormData({
            ...formData,
            states: { ...formData.states!, targetTemp: value },
            id: value || formData.id,
          });
          setErrors({ ...errors, targetTemp: '' });
        }}
        label="Target Temperature State ID"
        required
        placeholder="e.g. hm-rpc.0.ABC123.1.SET_TEMPERATURE"
      />
      {errors.targetTemp && <p className="text-sm text-red-400 mt-1">{errors.targetTemp}</p>}

      {/* Mode State ID (optional) */}
      <StateValidator
        stateId={formData.states?.mode || ''}
        onStateIdChange={(value) => {
          setFormData({
            ...formData,
            states: { ...formData.states!, mode: value },
          });
        }}
        label="Mode State ID (optional)"
        required={false}
        placeholder="e.g. hm-rpc.0.ABC123.1.CONTROL_MODE"
      />

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

      {/* Configuration */}
      <div className="space-y-4 p-4 bg-neutral-surface2 rounded-lg">
        <h3 className="text-body font-medium text-text-primary">Temperature Configuration</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Min Temp */}
          <div className="space-y-2">
            <label className="text-body text-text-secondary font-medium">
              Min Temp <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.config?.minTemp}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  config: { ...formData.config!, minTemp: parseFloat(e.target.value) },
                });
                setErrors({ ...errors, minTemp: '' });
              }}
              className={cn(
                'w-full px-3 py-2 bg-neutral-surface1 border rounded-lg',
                'text-text-primary text-body',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                'transition-all',
                errors.minTemp ? 'border-red-500' : 'border-stroke-default'
              )}
            />
            {errors.minTemp && <p className="text-sm text-red-400">{errors.minTemp}</p>}
          </div>

          {/* Max Temp */}
          <div className="space-y-2">
            <label className="text-body text-text-secondary font-medium">
              Max Temp <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.config?.maxTemp}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  config: { ...formData.config!, maxTemp: parseFloat(e.target.value) },
                });
                setErrors({ ...errors, maxTemp: '' });
              }}
              className={cn(
                'w-full px-3 py-2 bg-neutral-surface1 border rounded-lg',
                'text-text-primary text-body',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                'transition-all',
                errors.maxTemp ? 'border-red-500' : 'border-stroke-default'
              )}
            />
            {errors.maxTemp && <p className="text-sm text-red-400">{errors.maxTemp}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Step */}
          <div className="space-y-2">
            <label className="text-body text-text-secondary font-medium">Step</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={formData.config?.step}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  config: { ...formData.config!, step: parseFloat(e.target.value) || 0.5 },
                })
              }
              className="w-full px-3 py-2 bg-neutral-surface1 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <label className="text-body text-text-secondary font-medium">Unit</label>
            <select
              value={formData.config?.unit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  config: { ...formData.config!, unit: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-neutral-surface1 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            >
              <option value="°C">°C</option>
              <option value="°F">°F</option>
            </select>
          </div>
        </div>
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <label className="text-body text-text-secondary font-medium">Icon (optional)</label>
        <input
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="e.g. thermostat, ac_unit, heat"
          className="w-full px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        />
        <p className="text-xs text-text-secondary">
          Material Symbols icon name (default: thermostat)
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
