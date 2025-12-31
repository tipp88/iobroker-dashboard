import { useState } from 'react';
import type { ShutterDevice } from '../../../types/devices';
import { StateValidator } from '../StateValidator';
import { ROOMS } from '../../../config/devices.config';
import { cn } from '../../../utils/cn';

interface ShutterDeviceFormProps {
  initialDevice?: ShutterDevice;
  onSubmit: (device: ShutterDevice) => void;
  onCancel: () => void;
}

export const ShutterDeviceForm = ({
  initialDevice,
  onSubmit,
  onCancel,
}: ShutterDeviceFormProps) => {
  const [formData, setFormData] = useState<Partial<ShutterDevice>>({
    id: initialDevice?.id || '',
    name: initialDevice?.name || '',
    room: initialDevice?.room || '',
    type: 'shutter',
    states: {
      level: initialDevice?.states?.level || '',
      working: initialDevice?.states?.working || '',
    },
    config: {
      invertLevel: initialDevice?.config?.invertLevel || false,
      step: initialDevice?.config?.step || 5,
    },
    icon: initialDevice?.icon || 'blinds',
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
    if (!formData.states?.level?.trim()) {
      newErrors.level = 'Level state ID is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Set ID from level state if not provided
    if (!formData.id) {
      formData.id = formData.states!.level;
    }

    onSubmit(formData as ShutterDevice);
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
          placeholder="e.g. Living Room Blinds"
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

      {/* Level State ID */}
      <StateValidator
        stateId={formData.states?.level || ''}
        onStateIdChange={(value) => {
          setFormData({
            ...formData,
            states: { ...formData.states!, level: value },
            id: value || formData.id,
          });
          setErrors({ ...errors, level: '' });
        }}
        label="Level State ID"
        required
        placeholder="e.g. hm-rpc.0.ABC123.1.LEVEL"
      />
      {errors.level && <p className="text-sm text-red-400 mt-1">{errors.level}</p>}

      {/* Working State ID (optional) */}
      <StateValidator
        stateId={formData.states?.working || ''}
        onStateIdChange={(value) => {
          setFormData({
            ...formData,
            states: { ...formData.states!, working: value },
          });
        }}
        label="Working State ID (optional)"
        required={false}
        placeholder="e.g. hm-rpc.0.ABC123.1.WORKING"
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
        <h3 className="text-body font-medium text-text-primary">Configuration</h3>

        {/* Invert Level */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-body text-text-secondary font-medium">Invert Level</label>
            <p className="text-xs text-text-secondary mt-1">
              Enable if 0=open, 100=closed (instead of 0=closed, 100=open)
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.config?.invertLevel || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  config: { ...formData.config!, invertLevel: e.target.checked },
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-surface3 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        {/* Step */}
        <div className="space-y-2">
          <label className="text-body text-text-secondary font-medium">Step Size</label>
          <input
            type="number"
            min="1"
            max="100"
            value={formData.config?.step || 5}
            onChange={(e) =>
              setFormData({
                ...formData,
                config: { ...formData.config!, step: parseInt(e.target.value) || 5 },
              })
            }
            className="w-full px-3 py-2 bg-neutral-surface1 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          />
          <p className="text-xs text-text-secondary">Level adjustment step (1-100)</p>
        </div>
      </div>

      {/* Icon */}
      <div className="space-y-2">
        <label className="text-body text-text-secondary font-medium">Icon (optional)</label>
        <input
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="e.g. blinds, roller_shades, window"
          className="w-full px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        />
        <p className="text-xs text-text-secondary">
          Material Symbols icon name (default: blinds)
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
