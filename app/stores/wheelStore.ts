import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Entry, SpinResult, WheelStore, DEFAULT_COLORS } from '../types';

const getRandomColor = (): string => {
  return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
};

const selectWinner = (entries: Entry[]): Entry => {
  const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
  let random = Math.random() * totalWeight;

  for (const entry of entries) {
    random -= entry.weight;
    if (random <= 0) {
      return entry;
    }
  }

  return entries[0];
};

// Get compass positions for multi-winner selection
const getCompassPositions = (numberOfWinners: 1 | 3 | 4 | 8): number[] => {
  // Positions are in degrees from North (0 degrees = top of wheel)
  switch (numberOfWinners) {
    case 1:
      return [0]; // North only
    case 3:
      // North, East, South, West (actually 4 positions as per requirement)
      return [0, 90, 180, 270];
    case 4:
      // 4 cardinal directions
      return [0, 90, 180, 270];
    case 8:
      // All 8 compass positions
      return [0, 45, 90, 135, 180, 225, 270, 315];
    default:
      return [0];
  }
};

// Select winners at compass positions
const selectMultipleWinners = (
  entries: Entry[],
  numberOfWinners: 1 | 3 | 4 | 8,
  primaryWinnerId: string
): Entry[] => {
  if (entries.length === 0) return [];

  const positions = getCompassPositions(numberOfWinners);

  // Find the index of the primary winner
  const primaryIndex = entries.findIndex(e => e.id === primaryWinnerId);
  if (primaryIndex === -1) return [entries[0]];

  const numEntries = entries.length;
  const degreesPerSegment = 360 / numEntries;

  const winners: Entry[] = [];
  const winnerIds = new Set<string>();

  // For each compass position, find the nearest entry
  for (const compassAngle of positions) {
    // Calculate which entry index is closest to this compass position
    // The primary winner is at position 0 (North)
    // Other entries are offset from the primary winner
    const offsetDegrees = compassAngle;
    const offsetSegments = Math.round(offsetDegrees / degreesPerSegment);
    const winnerIndex = (primaryIndex + offsetSegments) % numEntries;

    const winnerEntry = entries[winnerIndex];

    // Only add if we haven't already selected this entry
    // This can happen when there are fewer entries than winner slots
    if (!winnerIds.has(winnerEntry.id)) {
      winners.push(winnerEntry);
      winnerIds.add(winnerEntry.id);
    }
  }

  return winners;
};

export const useWheelStore = create<WheelStore>()(
  persist(
    (set, get) => ({
      entries: [
        { id: '1', name: 'Alice', color: '#EF4444', weight: 1, removed: false },
        { id: '2', name: 'Bob', color: '#F59E0B', weight: 1, removed: false },
        { id: '3', name: 'Charlie', color: '#10B981', weight: 1, removed: false },
        { id: '4', name: 'Diana', color: '#3B82F6', weight: 1, removed: false },
        { id: '5', name: 'Eve', color: '#8B5CF6', weight: 1, removed: false },
        { id: '6', name: 'Frank', color: '#EC4899', weight: 1, removed: false },
      ],
      history: [],
      isSpinning: false,
      winner: null,
      winners: [],
      targetWinnerId: null,
      targetWinnerIds: [],
      isWaitingConfirmation: false,
      settings: {
        removeWinners: true,
        soundEnabled: true,
        spinDuration: 4000,
        confettiEnabled: true,
        gameMode: 'first-win',
        terminology: 'Contestants',
        numberOfWinners: 1,
        chatIntegration: {
          enabled: false,
          minimumFee: 1.0,
          platforms: {
            twitch: false,
            discord: false,
            youtube: false,
          },
          webhookUrl: '',
        },
      },

      addEntry: (name: string, color?: string) => {
        if (!name.trim()) return;

        set((state) => ({
          entries: [
            ...state.entries,
            {
              id: Date.now().toString() + Math.random(),
              name: name.trim(),
              color: color || getRandomColor(),
              weight: 1,
              removed: false,
            },
          ],
        }));
      },

      removeEntry: (id: string) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },

      updateEntry: (id: string, updates: Partial<Entry>) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));
      },

      bulkAddEntries: (names: string[]) => {
        const newEntries = names
          .filter((name) => name.trim())
          .map((name) => ({
            id: Date.now().toString() + Math.random(),
            name: name.trim(),
            color: getRandomColor(),
            weight: 1,
            removed: false,
          }));

        set((state) => ({
          entries: [...state.entries, ...newEntries],
        }));
      },

      spin: async () => {
        const state = get();
        const activeEntries = state.entries.filter((e) => !e.removed);

        // Prevent spinning if waiting for confirmation, already spinning, or no entries
        if (activeEntries.length === 0 || state.isSpinning || state.isWaitingConfirmation) {
          return;
        }

        // Select primary winner BEFORE spinning starts
        const primaryWinner = selectWinner(activeEntries);
        const isLastRemainingMode = state.settings.gameMode === 'last-remaining';

        // Select all winners based on compass positions
        const allWinners = selectMultipleWinners(
          activeEntries,
          state.settings.numberOfWinners,
          primaryWinner.id
        );

        set({
          isSpinning: true,
          winner: null,
          winners: [],
          targetWinnerId: primaryWinner.id,
          targetWinnerIds: allWinners.map(w => w.id),
          isWaitingConfirmation: false,
        });

        // Capture spin duration at start to prevent timing desync if settings change
        const spinDuration = state.settings.spinDuration;

        // Simulate spinning delay
        await new Promise((resolve) =>
          setTimeout(resolve, spinDuration)
        );

        const winnerNames = allWinners.map(w => w.name);

        set((state) => ({
          isSpinning: false,
          winner: primaryWinner.name,
          winners: winnerNames,
          isWaitingConfirmation: true,
          history: [
            {
              id: Date.now().toString(),
              winner: primaryWinner.name,
              winners: winnerNames,
              timestamp: Date.now(),
              isElimination: isLastRemainingMode,
              gameMode: state.settings.gameMode,
              numberOfWinners: state.settings.numberOfWinners,
            },
            ...state.history,
          ].slice(0, 50), // Keep last 50 results
          // Don't auto-remove winners - let user decide
        }));
      },

      confirmWinner: () => {
        set((state) => {
          const isLastRemainingMode = state.settings.gameMode === 'last-remaining';

          // In last-remaining mode, always remove the selected entries (elimination)
          // In first-win mode, respect the removeWinners setting
          const shouldRemove = isLastRemainingMode || state.settings.removeWinners;

          // Get all winner IDs to remove
          const winnerIdsToRemove = new Set(state.targetWinnerIds);

          return {
            winner: null,
            winners: [],
            targetWinnerId: null,
            targetWinnerIds: [],
            isWaitingConfirmation: false,
            entries: shouldRemove
              ? state.entries.map((e) =>
                  winnerIdsToRemove.has(e.id) ? { ...e, removed: true } : e
                )
              : state.entries,
          };
        });
      },

      dismissWinner: () => {
        set({
          winner: null,
          winners: [],
          targetWinnerId: null,
          targetWinnerIds: [],
          isWaitingConfirmation: false
        });
      },

      resetWheel: () => {
        set((state) => ({
          entries: state.entries.map((e) => ({ ...e, removed: false })),
          winner: null,
          winners: [],
          targetWinnerId: null,
          targetWinnerIds: [],
          isWaitingConfirmation: false,
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      exportWheel: () => {
        const state = get();
        const data = {
          entries: state.entries,
          settings: state.settings,
          exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(data, null, 2);
      },

      importWheel: (data: string) => {
        try {
          const parsed = JSON.parse(data);

          if (!parsed.entries || !Array.isArray(parsed.entries)) {
            return false;
          }

          set({
            entries: parsed.entries,
            settings: parsed.settings || get().settings,
            history: [],
            winner: null,
            isSpinning: false,
          });

          return true;
        } catch (error) {
          console.error('Failed to import wheel:', error);
          return false;
        }
      },
    }),
    {
      name: 'gamewheel-storage',
      partialize: (state) => ({
        entries: state.entries,
        history: state.history,
        settings: state.settings,
      }),
    }
  )
);
