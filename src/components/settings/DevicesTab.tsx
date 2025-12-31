import { useState } from 'react';
import { useUserConfigStore } from '../../store/userConfigStore';
import { DeviceFormModal } from './DeviceFormModal';
import { ClimateDeviceForm } from './forms/ClimateDeviceForm';
import { SensorDeviceForm } from './forms/SensorDeviceForm';
import { SwitchDeviceForm } from './forms/SwitchDeviceForm';
import { ShutterDeviceForm } from './forms/ShutterDeviceForm';
import type { Device, ClimateDevice, SensorDevice, SwitchDevice, ShutterDevice } from '../../types/devices';
import { cn } from '../../utils/cn';

type DeviceTabType = 'climate' | 'sensors' | 'switches' | 'shutters';

export const DevicesTab = () => {
  const { userDevices, addDevice, removeDevice, duplicateDevice } = useUserConfigStore();
  const [activeDeviceTab, setActiveDeviceTab] = useState<DeviceTabType>('climate');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const deviceTabs: Array<{ id: DeviceTabType; label: string; icon: string }> = [
    { id: 'climate', label: 'Climate', icon: '🌡️' },
    { id: 'sensors', label: 'Sensors', icon: '📊' },
    { id: 'switches', label: 'Switches', icon: '🔌' },
    { id: 'shutters', label: 'Shutters', icon: '🪟' },
  ];

  const handleAddDevice = () => {
    setEditingDevice(null);
    setIsFormOpen(true);
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setIsFormOpen(true);
  };

  const handleSaveDevice = (device: Device) => {
    addDevice(activeDeviceTab, device);
    setIsFormOpen(false);
    setEditingDevice(null);
  };

  const handleDeleteDevice = (deviceId: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      removeDevice(activeDeviceTab, deviceId);
    }
  };

  const handleDuplicateDevice = (deviceId: string) => {
    duplicateDevice(activeDeviceTab, deviceId);
  };

  // Filter devices by search query
  const filteredDevices = userDevices[activeDeviceTab].filter((device) =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Device Type Tabs */}
      <div className="flex gap-2 border-b border-stroke-subtle">
        {deviceTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveDeviceTab(tab.id)}
            className={cn(
              'px-4 py-2 text-body font-medium transition-all relative',
              activeDeviceTab === tab.id
                ? 'text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            {activeDeviceTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
            )}
          </button>
        ))}
      </div>

      {/* Search and Add */}
      <div className="flex gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search devices..."
          className="flex-1 px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary text-body focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        />
        <button
          onClick={handleAddDevice}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Device
        </button>
      </div>

      {/* Device List */}
      <div className="space-y-3">
        {filteredDevices.length === 0 ? (
          <div className="text-center py-12 bg-neutral-surface2 rounded-lg border border-stroke-subtle">
            <p className="text-text-secondary">
              {searchQuery
                ? 'No devices match your search'
                : `No ${activeDeviceTab} devices added yet`}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddDevice}
                className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
              >
                Add Your First Device
              </button>
            )}
          </div>
        ) : (
          filteredDevices.map((device) => (
            <div
              key={device.id}
              className="p-4 bg-neutral-surface2 rounded-lg border border-stroke-default hover:border-stroke-subtle transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-body font-medium text-text-primary">{device.name}</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    State: <code className="text-cyan-400">{device.id}</code>
                  </p>
                  <p className="text-sm text-text-secondary">
                    Room: {device.room}
                  </p>
                  {device.icon && (
                    <p className="text-sm text-text-secondary">
                      Icon: {device.icon}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditDevice(device)}
                    className="px-3 py-1.5 text-sm bg-neutral-surface3 text-text-primary rounded hover:bg-neutral-surface1 transition-colors"
                    title="Edit device"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDuplicateDevice(device.id)}
                    className="px-3 py-1.5 text-sm bg-neutral-surface3 text-text-primary rounded hover:bg-neutral-surface1 transition-colors"
                    title="Duplicate device"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDeleteDevice(device.id)}
                    className="px-3 py-1.5 text-sm bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                    title="Delete device"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Device Form Modal */}
      {isFormOpen && (
        <DeviceFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingDevice(null);
          }}
          onSave={handleSaveDevice}
          mode={editingDevice ? 'edit' : 'add'}
          deviceType={activeDeviceTab}
          initialDevice={editingDevice || undefined}
        >
          {activeDeviceTab === 'climate' && (
            <ClimateDeviceForm
              initialDevice={editingDevice as ClimateDevice}
              onSubmit={handleSaveDevice}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingDevice(null);
              }}
            />
          )}
          {activeDeviceTab === 'sensors' && (
            <SensorDeviceForm
              initialDevice={editingDevice as SensorDevice}
              onSubmit={handleSaveDevice}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingDevice(null);
              }}
            />
          )}
          {activeDeviceTab === 'switches' && (
            <SwitchDeviceForm
              initialDevice={editingDevice as SwitchDevice}
              onSubmit={handleSaveDevice}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingDevice(null);
              }}
            />
          )}
          {activeDeviceTab === 'shutters' && (
            <ShutterDeviceForm
              initialDevice={editingDevice as ShutterDevice}
              onSubmit={handleSaveDevice}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingDevice(null);
              }}
            />
          )}
        </DeviceFormModal>
      )}
    </div>
  );
};
