'use client';

import { useWheelStore } from '../stores/wheelStore';
import { Trash2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export function HistoryPanel() {
  const { history, clearHistory } = useWheelStore();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

    return date.toLocaleDateString();
  };

  const exportHistory = () => {
    const csv = [
      'Winner,Type,Game Mode,Timestamp,Date',
      ...history.map((h) =>
        [
          h.winner,
          h.isElimination ? 'Elimination' : 'Win',
          h.gameMode || 'first-win',
          h.timestamp,
          new Date(h.timestamp).toISOString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gamewheel-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${history.length} results to CSV`);
  };

  const handleClearHistory = () => {
    if (history.length === 0) return;
    clearHistory();
    toast.success('History cleared');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          History ({history.length})
        </h2>
        {history.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={exportHistory}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Export as CSV"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearHistory}
              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900
                       rounded-lg transition-colors"
              title="Clear history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {history.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-gradient-to-r
                       from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750
                       rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center
                           text-white font-bold text-sm shadow-md ${
                    result.isElimination
                      ? 'bg-gradient-to-br from-red-500 to-orange-600'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}
                >
                  {result.isElimination ? '❌' : index + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {result.winner}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(result.timestamp)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {result.isElimination && (
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800
                                 dark:text-red-200 text-xs font-semibold rounded-full">
                    Eliminated
                  </span>
                )}
                {index === 0 && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800
                                 dark:text-green-200 text-xs font-semibold rounded-full">
                    Latest
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {history.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-4xl mb-2">📜</p>
            <p>No spins yet. Try spinning the wheel!</p>
          </div>
        )}
      </div>

      {history.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Showing last {Math.min(history.length, 50)} results
          </p>
        </div>
      )}
    </div>
  );
}
