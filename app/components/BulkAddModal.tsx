'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload } from 'lucide-react';

interface BulkAddModalProps {
  onClose: () => void;
  onAdd: (names: string[]) => void;
}

export function BulkAddModal({ onClose, onAdd }: BulkAddModalProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Please enter at least one name');
      return;
    }

    // Parse names - support comma, newline, or semicolon separation
    const names = text
      .split(/[\n,;]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length === 0) {
      setError('No valid names found');
      return;
    }

    if (names.length > 100) {
      setError('Maximum 100 names allowed at once');
      return;
    }

    onAdd(names);
    onClose();
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((clipText) => {
      setText(clipText);
    }).catch(() => {
      setError('Could not access clipboard');
    });
  };

  const exampleNames = `Alice
Bob
Charlie
David
Emma`;

  const insertExample = () => {
    setText(exampleNames);
    setError('');
  };

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
                 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200
                      dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bulk Add Entries
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add multiple names at once
              </p>
            </div>
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
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Paste names (one per line, or comma/semicolon separated)
            </label>
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError('');
              }}
              placeholder="Alice&#10;Bob&#10;Charlie&#10;&#10;or&#10;&#10;Alice, Bob, Charlie"
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600
                       rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       dark:bg-gray-700 dark:text-white resize-none font-mono text-sm
                       min-h-[200px]"
              autoFocus
            />

            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={handlePaste}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600
                         rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                         transition-colors text-gray-700 dark:text-gray-300"
              >
                📋 Paste from Clipboard
              </button>
              <button
                type="button"
                onClick={insertExample}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600
                         rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                         transition-colors text-gray-700 dark:text-gray-300"
              >
                📝 Insert Example
              </button>
            </div>

            <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg
                          border border-indigo-200 dark:border-indigo-800">
              <p className="text-xs text-indigo-900 dark:text-indigo-200">
                <strong>💡 Tip:</strong> You can paste from Excel, Google Sheets, or any text source.
                The app will automatically detect and separate names.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600
                       rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-colors text-gray-700 dark:text-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg
                       hover:bg-indigo-700 transition-colors font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!text.trim()}
            >
              Add {text.trim() && text.split(/[\n,;]/).filter(n => n.trim()).length > 0
                ? `(${text.split(/[\n,;]/).filter(n => n.trim()).length})`
                : ''} Names
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
