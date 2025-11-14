'use client';

import { useState } from 'react';
import { useWheelStore } from '../stores/wheelStore';
import { X, Download, Upload, Settings as SettingsIcon, Copy, Check, ExternalLink, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface SettingsProps {
  onClose: () => void;
}

const TERMINOLOGY_OPTIONS = [
  'Contestants',
  'Players',
  'Participants',
  'Members',
  'Entries',
];

export function Settings({ onClose }: SettingsProps) {
  const { settings, updateSettings, exportWheel, importWheel } =
    useWheelStore();

  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [customTerminology, setCustomTerminology] = useState('');
  const [showCustomTerminology, setShowCustomTerminology] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);
  const [customWebhookUrl, setCustomWebhookUrl] = useState(
    settings.chatIntegration.webhookUrl
  );

  // Detect if running on static hosting (GitHub Pages, etc.)
  const isStaticHosting = typeof window !== 'undefined'
    && (window.location.hostname.includes('github.io') ||
        window.location.pathname.includes('.html'));

  const builtInWebhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/chat-submit`
    : 'https://your-domain.com/api/chat-submit';

  const activeWebhookUrl = customWebhookUrl || builtInWebhookUrl;

  const handleExport = () => {
    const data = exportWheel();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gamewheel-config-${Date.now()}.json`;
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

  const handleTerminologyChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomTerminology(true);
    } else {
      setShowCustomTerminology(false);
      updateSettings({ terminology: value });
    }
  };

  const handleCustomTerminologySubmit = () => {
    if (customTerminology.trim()) {
      updateSettings({ terminology: customTerminology.trim() });
      setShowCustomTerminology(false);
      setCustomTerminology('');
      toast.success(`Terminology updated to "${customTerminology.trim()}"`);
    }
  };

  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(activeWebhookUrl);
      setCopiedWebhook(true);
      toast.success('Webhook URL copied!');
      setTimeout(() => setCopiedWebhook(false), 2000);
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const copyExampleCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedExample(true);
      toast.success('Example code copied!');
      setTimeout(() => setCopiedExample(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleSaveWebhookUrl = () => {
    updateSettings({
      chatIntegration: {
        ...settings.chatIntegration,
        webhookUrl: customWebhookUrl,
      },
    });
    toast.success('Webhook URL saved!');
  };

  const testWebhook = async () => {
    if (!activeWebhookUrl) {
      toast.error('Please configure a webhook URL first');
      return;
    }

    try {
      const response = await fetch(activeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          fee: 5.0,
          platform: 'twitch',
          userId: 'test-user-123',
        }),
      });

      if (response.ok) {
        toast.success('Webhook test successful!');
      } else {
        const data = await response.json();
        toast.error(`Webhook test failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error('Failed to connect to webhook. Make sure the URL is correct.');
    }
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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full
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
          {/* Game Mode */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Game Mode
            </h3>
            <div className="space-y-2">
              <label className="flex items-start p-4 bg-gray-50 dark:bg-gray-700
                              rounded-lg cursor-pointer hover:bg-gray-100
                              dark:hover:bg-gray-600 transition-colors border-2
                              ${settings.gameMode === 'first-win' ? 'border-indigo-500' : 'border-transparent'}">
                <input
                  type="radio"
                  name="gameMode"
                  checked={settings.gameMode === 'first-win'}
                  onChange={() => updateSettings({ gameMode: 'first-win' })}
                  className="mt-1 w-5 h-5 text-indigo-600"
                />
                <div className="ml-3">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    🎯 First Win
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Wheel spins once, first selected contestant wins. No elimination.
                  </div>
                </div>
              </label>

              <label className="flex items-start p-4 bg-gray-50 dark:bg-gray-700
                              rounded-lg cursor-pointer hover:bg-gray-100
                              dark:hover:bg-gray-600 transition-colors border-2
                              ${settings.gameMode === 'last-remaining' ? 'border-indigo-500' : 'border-transparent'}">
                <input
                  type="radio"
                  name="gameMode"
                  checked={settings.gameMode === 'last-remaining'}
                  onChange={() => updateSettings({ gameMode: 'last-remaining' })}
                  className="mt-1 w-5 h-5 text-indigo-600"
                />
                <div className="ml-3">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    🔥 Last Remaining (Elimination)
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Selected contestant is eliminated. Repeat until one remains as the ultimate winner.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Number of Winners */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Number of Winners
            </h3>
            <select
              value={settings.numberOfWinners}
              onChange={(e) =>
                updateSettings({ numberOfWinners: parseInt(e.target.value) as 1 | 3 | 4 | 8 })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                       rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       dark:bg-gray-700 dark:text-white mb-3"
            >
              <option value={1}>1 Winner (North)</option>
              <option value={3}>3 Winners (4 Cardinal Directions)</option>
              <option value={4}>4 Winners (Cardinal Directions)</option>
              <option value={8}>8 Winners (All Compass Positions)</option>
            </select>

            {/* Compass Diagram */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 font-medium">
                Selected positions:
              </p>
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  {/* Compass Circle */}
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-gray-300 dark:text-gray-600"
                    />

                    {/* Compass positions */}
                    {/* North - Always visible for 1, 3, 4, 8 */}
                    <circle
                      cx="100"
                      cy="10"
                      r="8"
                      className={settings.numberOfWinners >= 1 ? "fill-green-500" : "fill-gray-300 dark:fill-gray-600"}
                    />
                    <text x="100" y="35" textAnchor="middle" className="text-xs fill-current">N</text>

                    {/* Northeast - Only for 8 */}
                    <circle
                      cx="163.6"
                      cy="36.4"
                      r="8"
                      className={settings.numberOfWinners === 8 ? "fill-green-500" : "fill-gray-300 dark:fill-gray-600"}
                    />
                    <text x="163.6" y="30" textAnchor="middle" className="text-xs fill-current">NE</text>

                    {/* East - For 3, 4, 8 */}
                    <circle
                      cx="190"
                      cy="100"
                      r="8"
                      className={settings.numberOfWinners >= 3 ? "fill-green-500" : "fill-gray-300 dark:fill-gray-600"}
                    />
                    <text x="175" y="105" textAnchor="middle" className="text-xs fill-current">E</text>

                    {/* Southeast - Only for 8 */}
                    <circle
                      cx="163.6"
                      cy="163.6"
                      r="8"
                      className={settings.numberOfWinners === 8 ? "fill-green-500" : "fill-gray-300 dark:fill-gray-600"}
                    />
                    <text x="163.6" y="180" textAnchor="middle" className="text-xs fill-current">SE</text>

                    {/* South - For 3, 4, 8 */}
                    <circle
                      cx="100"
                      cy="190"
                      r="8"
                      className={settings.numberOfWinners >= 3 ? "fill-green-500" : "fill-gray-300 dark:fill-gray-600"}
                    />
                    <text x="100" y="175" textAnchor="middle" className="text-xs fill-current">S</text>

                    {/* Southwest - Only for 8 */}
                    <circle
                      cx="36.4"
                      cy="163.6"
                      r="8"
                      className={settings.numberOfWinners === 8 ? "fill-green-500" : "fill-gray-300 dark:fill-gray-600"}
                    />
                    <text x="36.4" y="180" textAnchor="middle" className="text-xs fill-current">SW</text>

                    {/* West - For 3, 4, 8 */}
                    <circle
                      cx="10"
                      cy="100"
                      r="8"
                      className={settings.numberOfWinners >= 3 ? "fill-green-500" : "fill-gray-300 dark:fill-gray-600"}
                    />
                    <text x="25" y="105" textAnchor="middle" className="text-xs fill-current">W</text>

                    {/* Northwest - Only for 8 */}
                    <circle
                      cx="36.4"
                      cy="36.4"
                      r="8"
                      className={settings.numberOfWinners === 8 ? "fill-green-500" : "fill-gray-300 dark:fill-gray-600"}
                    />
                    <text x="36.4" y="30" textAnchor="middle" className="text-xs fill-current">NW</text>

                    {/* Center dot */}
                    <circle cx="100" cy="100" r="4" className="fill-gray-400 dark:fill-gray-500" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 text-center">
                {settings.numberOfWinners === 1 && "Only the entry at the top (North) will be selected"}
                {settings.numberOfWinners === 3 && "Entries at North, East, South, and West will be selected (4 total)"}
                {settings.numberOfWinners === 4 && "Entries at the 4 cardinal directions will be selected"}
                {settings.numberOfWinners === 8 && "Entries at all 8 compass positions will be selected"}
              </p>
              {settings.numberOfWinners > 1 && (
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 text-center italic">
                  If there are fewer entries than winner slots, some entries may be selected multiple times
                </p>
              )}
            </div>
          </div>

          {/* Terminology */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Terminology
            </h3>
            <select
              value={showCustomTerminology ? 'custom' : settings.terminology}
              onChange={(e) => handleTerminologyChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                       rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       dark:bg-gray-700 dark:text-white"
            >
              {TERMINOLOGY_OPTIONS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
              <option value="custom">Custom...</option>
            </select>

            {showCustomTerminology && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={customTerminology}
                  onChange={(e) => setCustomTerminology(e.target.value)}
                  placeholder="Enter custom terminology"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600
                           rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                           dark:bg-gray-700 dark:text-white"
                  maxLength={20}
                />
                <button
                  onClick={handleCustomTerminologySubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg
                           hover:bg-indigo-700 transition-colors"
                >
                  Set
                </button>
              </div>
            )}
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Currently using: <span className="font-semibold">{settings.terminology}</span>
            </p>
          </div>

          {/* Wheel Behavior */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Wheel Behavior
            </h3>

            {settings.gameMode === 'first-win' && (
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
            )}

            {settings.gameMode === 'last-remaining' && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border
                            border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ℹ️ In elimination mode, selected entries are always removed
                </p>
              </div>
            )}

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

          {/* Chat Integration */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Chat Integration
            </h3>

            {/* Static Hosting Warning */}
            {isStaticHosting && (
              <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border
                            border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                      Static Hosting Detected
                    </h4>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      The built-in API route won't work on GitHub Pages or other static hosting.
                      You'll need to use a custom webhook URL from a service like Zapier, n8n,
                      webhook.site, or your own server.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <label className="flex items-center justify-between p-3 bg-gray-50
                            dark:bg-gray-700 rounded-lg cursor-pointer
                            hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <span className="text-gray-900 dark:text-white">
                Enable chat submissions
              </span>
              <input
                type="checkbox"
                checked={settings.chatIntegration.enabled}
                onChange={(e) =>
                  updateSettings({
                    chatIntegration: {
                      ...settings.chatIntegration,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="w-5 h-5 text-indigo-600 rounded focus:ring-2
                         focus:ring-indigo-500"
              />
            </label>

            {settings.chatIntegration.enabled && (
              <div className="mt-3 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700
                                  dark:text-gray-300 mb-2">
                    Minimum Fee ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={settings.chatIntegration.minimumFee}
                    onChange={(e) =>
                      updateSettings({
                        chatIntegration: {
                          ...settings.chatIntegration,
                          minimumFee: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600
                             rounded-lg focus:ring-2 focus:ring-indigo-500
                             focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700
                                  dark:text-gray-300 mb-2">
                    Enabled Platforms
                  </label>
                  <div className="space-y-2">
                    {(['twitch', 'discord', 'youtube'] as const).map((platform) => (
                      <label
                        key={platform}
                        className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800
                                 rounded-lg cursor-pointer hover:bg-gray-50
                                 dark:hover:bg-gray-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={settings.chatIntegration.platforms[platform]}
                          onChange={(e) =>
                            updateSettings({
                              chatIntegration: {
                                ...settings.chatIntegration,
                                platforms: {
                                  ...settings.chatIntegration.platforms,
                                  [platform]: e.target.checked,
                                },
                              },
                            })
                          }
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-gray-900 dark:text-white capitalize">
                          {platform}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Custom Webhook URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700
                                  dark:text-gray-300 mb-2">
                    {isStaticHosting ? 'Custom Webhook URL (Required)' : 'Custom Webhook URL (Optional)'}
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customWebhookUrl}
                        onChange={(e) => setCustomWebhookUrl(e.target.value)}
                        placeholder="https://your-webhook-service.com/endpoint"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600
                                 rounded-lg focus:ring-2 focus:ring-indigo-500
                                 focus:border-transparent dark:bg-gray-700 dark:text-white
                                 text-sm font-mono"
                      />
                      <button
                        onClick={handleSaveWebhookUrl}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg
                                 hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                    {!isStaticHosting && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Leave empty to use built-in endpoint: {builtInWebhookUrl}
                      </p>
                    )}
                  </div>
                </div>

                {/* Active Webhook Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700
                                  dark:text-gray-300 mb-2">
                    Active Webhook URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={activeWebhookUrl}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600
                               rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white
                               text-sm font-mono"
                    />
                    <button
                      onClick={copyWebhookUrl}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg
                               hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      {copiedWebhook ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Use this URL in your chat bot or integration platform
                  </p>
                </div>

                {/* Test Webhook Button */}
                <button
                  onClick={testWebhook}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg
                           hover:bg-blue-700 transition-colors flex items-center
                           justify-center gap-2"
                >
                  Test Webhook Connection
                </button>

                {/* Integration Examples */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Free Webhook Services
                  </h4>
                  <div className="space-y-2 text-sm">
                    <a
                      href="https://zapier.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700
                               rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600
                               transition-colors text-indigo-600 dark:text-indigo-400"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Zapier (Free tier available)
                    </a>
                    <a
                      href="https://n8n.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700
                               rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600
                               transition-colors text-indigo-600 dark:text-indigo-400"
                    >
                      <ExternalLink className="w-4 h-4" />
                      n8n (Self-hosted or cloud)
                    </a>
                    <a
                      href="https://webhook.site"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700
                               rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600
                               transition-colors text-indigo-600 dark:text-indigo-400"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Webhook.site (For testing)
                    </a>
                  </div>
                </div>

                {/* Example Integration Code */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Example Integration (cURL)
                  </h4>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
{`curl -X POST ${activeWebhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "PlayerName",
    "fee": 5.0,
    "platform": "twitch",
    "userId": "user123"
  }'`}
                    </pre>
                    <button
                      onClick={() => copyExampleCode(`curl -X POST ${activeWebhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "PlayerName",
    "fee": 5.0,
    "platform": "twitch",
    "userId": "user123"
  }'`)}
                      className="absolute top-2 right-2 px-3 py-1.5 bg-gray-700
                               text-white rounded text-xs hover:bg-gray-600
                               transition-colors flex items-center gap-1"
                    >
                      {copiedExample ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Adapt this example for your chat bot or webhook service
                  </p>
                </div>
              </div>
            )}
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
              GameWheel - Advanced Random Selection Spinner
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
              Built with Next.js, TypeScript, and TailwindCSS
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
              <a
                href="https://github.com/crandellws/gamewheel"
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
