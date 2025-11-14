'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useWheelStore } from '../stores/wheelStore';
import { Trophy, TrendingUp } from 'lucide-react';

export function LadderDisplay() {
  const { entries, ladderPositions, settings, fullTiltWinner, isSpinning } = useWheelStore();

  // Only show in Full Tilt mode
  if (settings.gameMode !== 'full-tilt') {
    return null;
  }

  const ladderHeight = settings.ladderHeight;
  const activeEntries = entries.filter((e) => !e.removed);

  // Get players sorted by ladder position (highest first)
  const playersOnLadder = activeEntries
    .map((entry) => ({
      ...entry,
      position: ladderPositions[entry.id] || 0,
    }))
    .filter((player) => player.position > 0)
    .sort((a, b) => b.position - a.position);

  // Create array of rungs from top to bottom
  const rungs = Array.from({ length: ladderHeight }, (_, i) => ladderHeight - i);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-2 border-indigo-200 dark:border-indigo-800"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Ladder Progress
          </h2>
          {fullTiltWinner && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400"
            >
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-bold">WINNER!</span>
            </motion.div>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          First to reach rung {ladderHeight} wins!
        </p>
      </div>

      {/* Ladder Visualization */}
      <div className="relative">
        {/* Ladder Rungs */}
        <div className="space-y-3">
          {rungs.map((rung) => {
            const playersOnThisRung = playersOnLadder.filter((p) => p.position === rung);
            const isTopRung = rung === ladderHeight;
            const isWinningRung = fullTiltWinner && isTopRung;

            return (
              <motion.div
                key={rung}
                className={`relative rounded-xl border-2 transition-all ${
                  isTopRung
                    ? 'border-yellow-400 dark:border-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
                } ${isWinningRung ? 'ring-4 ring-yellow-400 dark:ring-yellow-500' : ''}`}
                animate={
                  isWinningRung
                    ? {
                        scale: [1, 1.02, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(250, 204, 21, 0)',
                          '0 0 20px 5px rgba(250, 204, 21, 0.5)',
                          '0 0 0 0 rgba(250, 204, 21, 0)',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: isWinningRung ? Infinity : 0 }}
              >
                {/* Rung Number */}
                <div className="absolute -left-10 top-1/2 -translate-y-1/2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isTopRung
                        ? 'bg-yellow-400 dark:bg-yellow-500 text-yellow-900'
                        : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    {rung}
                  </div>
                </div>

                {/* Top Rung Trophy Indicator */}
                {isTopRung && (
                  <div className="absolute -right-10 top-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Trophy className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
                    </motion.div>
                  </div>
                )}

                {/* Players on this rung */}
                <div className="min-h-[60px] p-3 flex items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    {playersOnThisRung.length > 0 ? (
                      <div className="flex flex-wrap gap-2 justify-center w-full">
                        {playersOnThisRung.map((player) => (
                          <motion.div
                            key={player.id}
                            initial={{ scale: 0, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm shadow-lg ${
                              isWinningRung
                                ? 'bg-yellow-400 dark:bg-yellow-500 text-yellow-900 ring-2 ring-yellow-600'
                                : ''
                            }`}
                            style={{
                              backgroundColor: isWinningRung ? undefined : player.color,
                              color: isWinningRung ? undefined : '#ffffff',
                            }}
                          >
                            {player.name}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-400 dark:text-gray-500 text-sm italic"
                      >
                        Empty
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Ladder Rails */}
        <div className="absolute top-0 bottom-0 left-14 w-1 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full" />
        <div className="absolute top-0 bottom-0 right-14 w-1 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full" />
      </div>

      {/* Players Not Yet on Ladder */}
      {activeEntries.filter((e) => !ladderPositions[e.id] || ladderPositions[e.id] === 0).length >
        0 && (
        <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Waiting to Climb ({activeEntries.filter((e) => !ladderPositions[e.id] || ladderPositions[e.id] === 0).length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeEntries
              .filter((e) => !ladderPositions[e.id] || ladderPositions[e.id] === 0)
              .map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-white"
                  style={{ backgroundColor: entry.color }}
                >
                  {entry.name}
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Winner Celebration */}
      <AnimatePresence>
        {fullTiltWinner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="mt-6 p-4 bg-gradient-to-r from-yellow-400 to-amber-400 dark:from-yellow-500 dark:to-amber-500 rounded-xl shadow-2xl"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-4xl mb-2"
              >
                🎉
              </motion.div>
              <p className="text-xl font-bold text-yellow-900 mb-1">CHAMPION!</p>
              <p className="text-lg font-semibold text-yellow-900">{fullTiltWinner}</p>
              <p className="text-sm text-yellow-800 mt-1">Reached the top of the ladder!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {playersOnLadder.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Climbing</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {playersOnLadder.length > 0 ? Math.max(...playersOnLadder.map((p) => p.position)) : 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Highest Rung</div>
        </div>
      </div>
    </motion.div>
  );
}
