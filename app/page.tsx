'use client';

import { useEffect, useState } from 'react';
import { Wheel } from './components/Wheel';
import { EntryList } from './components/EntryList';
import { HistoryPanel } from './components/HistoryPanel';
import { Settings } from './components/Settings';
import { WelcomeModal } from './components/WelcomeModal';
import { useWheelStore } from './stores/wheelStore';
import { Moon, Sun, Settings as SettingsIcon, Github, Keyboard } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const { spin, entries, addEntry } = useWheelStore();
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('gamewheel-visited');
    const hasEntries = entries.length > 0;

    if (!hasVisited && !hasEntries) {
      setShowWelcome(true);
      localStorage.setItem('gamewheel-visited', 'true');
    }
  }, [entries.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'enter':
          e.preventDefault();
          spin();
          break;
        case 's':
          setShowSettings(true);
          break;
        case 'd':
          setDarkMode((prev) => !prev);
          break;
        case '?':
          setShowKeyboardHelp((prev) => !prev);
          break;
        case 'escape':
          setShowSettings(false);
          setShowKeyboardHelp(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [spin]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load sample data
  const loadSampleData = () => {
    const sampleNames = [
      'Alice',
      'Bob',
      'Charlie',
      'Diana',
      'Emma',
      'Frank',
      'Grace',
      'Henry',
    ];
    sampleNames.forEach((name) => addEntry(name));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100
                  dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? '#374151' : '#fff',
            color: darkMode ? '#fff' : '#000',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200
                       dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🎡</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                GameWheel
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Open Source • Free Forever
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors"
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <a
              href="https://github.com/crandellws/gamewheel"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors"
              title="View on GitHub"
            >
              <Github className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </a>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors"
              title="Toggle dark mode (D)"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                       transition-colors"
              title="Settings (S)"
            >
              <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wheel - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6
                         border border-gray-200 dark:border-gray-700">
              <Wheel />

              {/* Quick Instructions */}
              <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg
                           border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm text-indigo-900 dark:text-indigo-200 text-center">
                  💡 <strong>Quick Tip:</strong> Press <kbd className="px-2 py-1 bg-white
                  dark:bg-gray-700 rounded border border-indigo-300 dark:border-indigo-700
                  text-xs font-mono">Space</kbd> to spin the wheel!
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Entry List and History */}
          <div className="space-y-6">
            <EntryList />
            <HistoryPanel />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border
                       border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">🎮</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Game Modes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              First Win or Last Remaining elimination mode for competitive gameplay
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border
                       border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Chat Integration
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Accept entries from Twitch, Discord, and YouTube via webhooks
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border
                       border-gray-200 dark:border-gray-700">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Fully Customizable
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Custom terminology, colors, weights, and dark mode support
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600
                      dark:text-gray-400">
          <p>
            Made with ❤️ by Bill Crandell •{' '}
            <a
              href="https://github.com/crandellws/gamewheel"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Source on GitHub
            </a>
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      </AnimatePresence>

      {/* Keyboard Help Modal */}
      <AnimatePresence>
        {showKeyboardHelp && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center
                     z-50 p-4"
            onClick={() => setShowKeyboardHelp(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { key: 'Space / Enter', action: 'Spin the wheel' },
                  { key: 'S', action: 'Open settings' },
                  { key: 'D', action: 'Toggle dark mode' },
                  { key: '?', action: 'Show this help' },
                  { key: 'Esc', action: 'Close modals' },
                ].map((shortcut) => (
                  <div key={shortcut.key} className="flex justify-between items-center">
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded border
                                 border-gray-300 dark:border-gray-600 font-mono text-xs">
                      {shortcut.key}
                    </kbd>
                    <span className="text-gray-600 dark:text-gray-400">
                      {shortcut.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeModal
            onClose={() => setShowWelcome(false)}
            onLoadSample={loadSampleData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
