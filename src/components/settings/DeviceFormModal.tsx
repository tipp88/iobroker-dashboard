import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Device } from '../../types/devices';

interface DeviceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (device: Device) => void;
  mode: 'add' | 'edit';
  deviceType: 'climate' | 'sensors' | 'switches' | 'shutters';
  initialDevice?: Device;
  children: React.ReactNode;
}

export const DeviceFormModal = ({
  isOpen,
  onClose,
  mode,
  deviceType,
  children,
}: DeviceFormModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const deviceTypeLabels = {
    climate: 'Climate Device',
    sensors: 'Sensor Device',
    switches: 'Switch Device',
    shutters: 'Shutter Device',
  };

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
    >
      <div className="bg-neutral-surface1 rounded-xl shadow-card border border-stroke-default w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stroke-subtle">
          <h2 className="text-h1 text-text-primary font-bold">
            {mode === 'add' ? 'Add' : 'Edit'} {deviceTypeLabels[deviceType]}
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
};
