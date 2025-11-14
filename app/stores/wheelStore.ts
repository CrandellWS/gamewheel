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
      targetWinnerId: null,
      settings: {
        removeWinners: true,
        soundEnabled: true,
        spinDuration: 4000,
        confettiEnabled: true,
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

        if (activeEntries.length === 0 || state.isSpinning) {
          return;
        }

        // Select winner BEFORE spinning starts
        const winner = selectWinner(activeEntries);

        set({ isSpinning: true, winner: null, targetWinnerId: winner.id });

        // Capture spin duration at start to prevent timing desync if settings change
        const spinDuration = state.settings.spinDuration;

        // Simulate spinning delay
        await new Promise((resolve) =>
          setTimeout(resolve, spinDuration)
        );

        set((state) => ({
          isSpinning: false,
          winner: winner.name,
          history: [
            {
              id: Date.now().toString(),
              winner: winner.name,
              timestamp: Date.now(),
            },
            ...state.history,
          ].slice(0, 50), // Keep last 50 results
          // Don't auto-remove winner - let user decide
        }));
      },

      confirmWinner: () => {
        set((state) => {
          // CRITICAL FIX: Use targetWinnerId instead of name to handle duplicates
          const winnerEntry = state.entries.find((e) => e.id === state.targetWinnerId);
          return {
            winner: null,
            targetWinnerId: null,
            entries: state.settings.removeWinners && winnerEntry
              ? state.entries.map((e) =>
                  e.id === winnerEntry.id ? { ...e, removed: true } : e
                )
              : state.entries,
          };
        });
      },

      dismissWinner: () => {
        set({ winner: null, targetWinnerId: null });
      },

      resetWheel: () => {
        set((state) => ({
          entries: state.entries.map((e) => ({ ...e, removed: false })),
          winner: null,
          targetWinnerId: null,
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
      name: 'wheel-of-names-storage',
      partialize: (state) => ({
        entries: state.entries,
        history: state.history,
        settings: state.settings,
      }),
    }
  )
);
