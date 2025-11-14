'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Zap, List, History, Settings, Keyboard } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
  onLoadSample: () => void;
}

export function WelcomeModal({ onClose, onLoadSample }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Zap className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
      title: 'Welcome to GameWheel! 🎡',
      description: 'A free, open-source random selection spinner with game modes and advanced features.',
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">✅</div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Completely Free</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No ads, no tracking, no subscriptions
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">🎮</div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Multiple Game Modes</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                First Win or Last Remaining (elimination) modes
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">💬</div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Chat Integration</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Accept entries from Twitch, Discord, YouTube
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <List className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
      title: 'Managing Entries',
      description: 'Add and customize your wheel entries.',
      content: (
        <div className="space-y-3 text-left">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              ➕ Add Single Entry
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Type a name and click "Add" or press Enter
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              📝 Bulk Add
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Paste multiple names at once - great for class lists or teams
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              🎨 Customize
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Change colors, adjust weights (probability), edit names
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: <Keyboard className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
      title: 'Keyboard Shortcuts',
      description: 'Master the shortcuts for faster workflow.',
      content: (
        <div className="space-y-2">
          {[
            { key: 'Space / Enter', action: 'Spin the wheel' },
            { key: 'S', action: 'Open settings' },
            { key: 'D', action: 'Toggle dark mode' },
            { key: '?', action: 'Show shortcuts help' },
            { key: 'Esc', action: 'Close modals' },
          ].map((shortcut) => (
            <div key={shortcut.key} className="flex justify-between items-center p-2
                                             bg-gray-50 dark:bg-gray-700 rounded">
              <kbd className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded border
                           border-gray-300 dark:border-gray-600 font-mono text-sm
                           font-semibold">
                {shortcut.key}
              </kbd>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {shortcut.action}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <Settings className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />,
      title: 'Advanced Features',
      description: 'Customize your experience.',
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50
                       dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              ⚙️ Settings
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remove winners, adjust spin duration, toggle sound/confetti
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-green-50 to-teal-50
                       dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              💾 Export/Import
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Save your wheel config as JSON, share with others
            </p>
          </div>
          <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50
                       dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
            <p className="font-semibold text-gray-900 dark:text-white mb-1">
              📊 History Export
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export spin results as CSV for record-keeping
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleLoadSample = () => {
    onLoadSample();
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center
                 z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full
                 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg
                     transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center text-center">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {currentStepData.icon}
            </motion.div>
            <h2 className="text-2xl font-bold mt-4">
              {currentStepData.title}
            </h2>
            <p className="text-indigo-100 mt-1">
              {currentStepData.description}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-white'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStepData.content}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 space-y-3">
          {currentStep === 0 && (
            <button
              onClick={handleLoadSample}
              className="w-full px-4 py-3 border-2 border-indigo-600 text-indigo-600
                       dark:text-indigo-400 dark:border-indigo-400 rounded-lg
                       hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                       transition-colors font-medium"
            >
              🎲 Load Sample Data (Quick Start)
            </button>
          )}

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600
                         rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                         transition-colors text-gray-700 dark:text-gray-300 font-medium"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg
                       hover:bg-indigo-700 transition-colors font-medium"
            >
              {currentStep === steps.length - 1 ? "Let's Go! 🚀" : 'Next'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700
                     dark:hover:text-gray-300 transition-colors"
          >
            Skip tutorial
          </button>
        </div>
      </motion.div>
    </div>
  );
}
