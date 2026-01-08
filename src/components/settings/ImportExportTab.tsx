import { useState, useRef } from 'react';
import { useUserConfigStore } from '../../store/userConfigStore';
import { configApi } from '../../api/configApi';
import { useDeviceImport } from '../../hooks/useDeviceImport';
import { cn } from '../../utils/cn';

type ImportMode = 'merge' | 'replace';

export const ImportExportTab = () => {
  const { exportConfig, importConfig, userDevices, userControlPanels, userLinks } = useUserConfigStore();
  const { importFromFile, importFromText, isImporting, importError, clearError } = useDeviceImport();

  const [exportPreview, setExportPreview] = useState('');
  const [importText, setImportText] = useState('');
  const [importMode, setImportMode] = useState<ImportMode>('replace');
  const [importSuccess, setImportSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Count total items
  const totalDevices =
    userDevices.climate.length +
    userDevices.sensors.length +
    userDevices.switches.length +
    userDevices.shutters.length;
  const totalPanels = Object.keys(userControlPanels).length;
  const totalLinks = userLinks.length;

  const handleExportDevices = () => {
    const config = { userDevices };
    const jsonString = JSON.stringify(config, null, 2);
    setExportPreview(jsonString);
    configApi.exportToFile(config, 'iobroker-devices.json');
  };

  const handleExportPanels = () => {
    const config = { userControlPanels };
    const jsonString = JSON.stringify(config, null, 2);
    setExportPreview(jsonString);
    configApi.exportToFile(config, 'iobroker-panels.json');
  };

  const handleExportAll = () => {
    const config = exportConfig();
    const jsonString = JSON.stringify(config, null, 2);
    setExportPreview(jsonString);
    configApi.exportToFile(config, 'iobroker-config.json');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    clearError();
    setImportSuccess(false);

    const config = await importFromFile(file);
    if (config) {
      setImportText(JSON.stringify(config, null, 2));
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportFromText = () => {
    clearError();
    setImportSuccess(false);

    const config = importFromText(importText);
    if (!config) return;

    if (importMode === 'replace') {
      importConfig(config);
    } else {
      // Merge mode - preserve existing and add new
      const mergedDevices = {
        climate: [...userDevices.climate, ...(config.userDevices?.climate || [])],
        sensors: [...userDevices.sensors, ...(config.userDevices?.sensors || [])],
        switches: [...userDevices.switches, ...(config.userDevices?.switches || [])],
        shutters: [...userDevices.shutters, ...(config.userDevices?.shutters || [])],
      };

      const mergedPanels = {
        ...userControlPanels,
        ...(config.userControlPanels || {}),
      };

      const mergedLinks = [...userLinks];
      (config.userLinks || []).forEach((link) => {
        if (!mergedLinks.some((existing) => existing.id === link.id)) {
          mergedLinks.push(link);
        }
      });

      importConfig({
        userDevices: mergedDevices,
        userControlPanels: mergedPanels,
        userLinks: mergedLinks,
      });
    }

    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Export Section */}
      <div className="space-y-4">
        <h3 className="text-h2 text-text-primary font-bold">Export Configuration</h3>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleExportDevices}
            disabled={totalDevices === 0}
            className={cn(
              'px-4 py-3 rounded-lg font-medium transition-colors flex flex-col items-center gap-2',
              totalDevices === 0
                ? 'bg-neutral-surface2 text-text-secondary cursor-not-allowed'
                : 'bg-cyan-500 text-white hover:bg-cyan-600'
            )}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            <span>Export Devices</span>
            <span className="text-xs opacity-80">({totalDevices} items)</span>
          </button>

          <button
            onClick={handleExportPanels}
            disabled={totalPanels === 0}
            className={cn(
              'px-4 py-3 rounded-lg font-medium transition-colors flex flex-col items-center gap-2',
              totalPanels === 0
                ? 'bg-neutral-surface2 text-text-secondary cursor-not-allowed'
                : 'bg-cyan-500 text-white hover:bg-cyan-600'
            )}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            <span>Export Panels</span>
            <span className="text-xs opacity-80">({totalPanels} items)</span>
          </button>

          <button
            onClick={handleExportAll}
            disabled={totalDevices === 0 && totalPanels === 0 && totalLinks === 0}
            className={cn(
              'px-4 py-3 rounded-lg font-medium transition-colors flex flex-col items-center gap-2',
              totalDevices === 0 && totalPanels === 0 && totalLinks === 0
                ? 'bg-neutral-surface2 text-text-secondary cursor-not-allowed'
                : 'bg-cyan-500 text-white hover:bg-cyan-600'
            )}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            <span>Export All</span>
            <span className="text-xs opacity-80">({totalDevices + totalPanels + totalLinks} items)</span>
          </button>
        </div>

        {exportPreview && (
          <div className="space-y-2">
            <label className="text-body text-text-secondary font-medium">Export Preview</label>
            <textarea
              value={exportPreview}
              readOnly
              rows={8}
              className="w-full px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary text-sm font-mono resize-none focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-stroke-subtle"></div>

      {/* Import Section */}
      <div className="space-y-4">
        <h3 className="text-h2 text-text-primary font-bold">Import Configuration</h3>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-body text-text-secondary font-medium">Upload JSON File</label>
          <div
            className="border-2 border-dashed border-stroke-default rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <svg
              className="w-12 h-12 mx-auto text-text-secondary mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-text-primary font-medium">Choose file or drag and drop</p>
            <p className="text-sm text-text-secondary mt-1">JSON files only</p>
          </div>
        </div>

        {/* Or paste JSON */}
        <div className="space-y-2">
          <label className="text-body text-text-secondary font-medium">Or Paste JSON</label>
          <textarea
            value={importText}
            onChange={(e) => {
              setImportText(e.target.value);
              clearError();
            }}
            placeholder='{"userDevices": {...}, "userControlPanels": {...}, "userLinks": [...]}'
            rows={8}
            className="w-full px-3 py-2 bg-neutral-surface2 border border-stroke-default rounded-lg text-text-primary text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          />
        </div>

        {/* Import Mode */}
        <div className="space-y-2">
          <label className="text-body text-text-secondary font-medium">Import Mode</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="replace"
                checked={importMode === 'replace'}
                onChange={(e) => setImportMode(e.target.value as ImportMode)}
                className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-text-primary">Replace existing</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="merge"
                checked={importMode === 'merge'}
                onChange={(e) => setImportMode(e.target.value as ImportMode)}
                className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-text-primary">Merge with existing</span>
            </label>
          </div>
        </div>

        {/* Import Button */}
        <button
          onClick={handleImportFromText}
          disabled={!importText.trim() || isImporting}
          className={cn(
            'w-full px-4 py-3 rounded-lg font-medium transition-colors',
            !importText.trim() || isImporting
              ? 'bg-neutral-surface2 text-text-secondary cursor-not-allowed'
              : 'bg-cyan-500 text-white hover:bg-cyan-600'
          )}
        >
          {isImporting ? 'Importing...' : 'Import Configuration'}
        </button>

        {/* Error Message */}
        {importError && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-medium text-red-400">Import Failed</p>
              <p className="text-sm text-red-400/80 mt-1">{importError}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {importSuccess && (
          <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="font-medium text-green-400">Configuration imported successfully!</p>
          </div>
        )}
      </div>
    </div>
  );
};
