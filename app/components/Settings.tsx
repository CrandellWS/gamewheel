'use client';

import { useState } from 'react';
import { useWheelStore } from '../stores/wheelStore';
import { X, Download, Upload, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const { settings, updateSettings, exportWheel, importWheel } =
    useWheelStore();

  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExport = () => {
    const data = exportWheel();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wheel-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Wheel configuration exported!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      const success = importWheel(data);

      if (success) {
        setImportSuccess(true);
        setImportError('');
        setTimeout(() => {
          setImportSuccess(false);
          onClose();
        }, 1500);
      } else {
        setImportError('Invalid file format');
        setTimeout(() => setImportError(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center
               z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full
                 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200
                      dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg
                     transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Wheel Behavior */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Wheel Behavior
            </h3>

            <label className="flex items-center justify-between p-3 bg-gray-50
                            dark:bg-gray-700 rounded-lg cursor-pointer
                            hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <span className="text-gray-900 dark:text-white">
                Remove winners after spin
              </span>
              <input
                type="checkbox"
                checked={settings.removeWinners}
                onChange={(e) =>
                  updateSettings({ removeWinners: e.target.checked })
                }
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2
                         focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 mt-2 bg-gray-50
                            dark:bg-gray-700 rounded-lg cursor-pointer
                            hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <span className="text-gray-900 dark:text-white">
                Sound effects
              </span>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) =>
                  updateSettings({ soundEnabled: e.target.checked })
                }
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2
                         focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 mt-2 bg-gray-50
                            dark:bg-gray-700 rounded-lg cursor-pointer
                            hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <span className="text-gray-900 dark:text-white">
                Confetti animation
              </span>
              <input
                type="checkbox"
                checked={settings.confettiEnabled}
                onChange={(e) =>
                  updateSettings({ confettiEnabled: e.target.checked })
                }
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2
                         focus:ring-indigo-500"
              />
            </label>
          </div>

          {/* Spin Duration */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Spin Duration
            </h3>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <input
                type="range"
                min="2000"
                max="6000"
                step="500"
                value={settings.spinDuration}
                onChange={(e) =>
                  updateSettings({ spinDuration: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600
                            dark:text-gray-400 mt-2">
                <span>Fast (2s)</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {settings.spinDuration / 1000}s
                </span>
                <span>Slow (6s)</span>
              </div>
            </div>
          </div>

          {/* Import/Export */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Import / Export
            </h3>

            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 p-3
                       bg-indigo-600 text-white rounded-lg hover:bg-indigo-700
                       transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Export Wheel Configuration
            </button>

            <label className="mt-2 w-full flex items-center justify-center gap-2 p-3
                            border-2 border-dashed border-gray-300 dark:border-gray-600
                            rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400
                            transition-colors cursor-pointer text-gray-700
                            dark:text-gray-300 hover:text-indigo-600
                            dark:hover:text-indigo-400 font-medium">
              <Upload className="w-5 h-5" />
              Import Wheel Configuration
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            {importError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
                {importError}
              </p>
            )}

            {importSuccess && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400 text-center">
                ✓ Import successful!
              </p>
            )}
          </div>

          {/* About */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Open Source Wheel of Names
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
              Built with Next.js, TypeScript, and TailwindCSS
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
              <a
                href="https://github.com/yourusername/wheel-of-names"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
