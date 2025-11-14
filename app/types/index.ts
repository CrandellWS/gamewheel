export interface Entry {
  id: string;
  name: string;
  color: string;
  weight: number;
  removed: boolean;
}

export interface SpinResult {
  id: string;
  winner: string;
  timestamp: number;
}

export interface WheelSettings {
  removeWinners: boolean;
  soundEnabled: boolean;
  spinDuration: number;
  confettiEnabled: boolean;
}

export interface WheelStore {
  entries: Entry[];
  history: SpinResult[];
  isSpinning: boolean;
  winner: string | null;
  targetWinnerId: string | null;
  settings: WheelSettings;

  // Entry management
  addEntry: (name: string, color?: string) => void;
  removeEntry: (id: string) => void;
  updateEntry: (id: string, updates: Partial<Entry>) => void;
  bulkAddEntries: (names: string[]) => void;

  // Wheel actions
  spin: () => Promise<void>;
  confirmWinner: () => void;
  dismissWinner: () => void;
  resetWheel: () => void;
  clearHistory: () => void;

  // Settings
  updateSettings: (settings: Partial<WheelSettings>) => void;

  // Import/Export
  exportWheel: () => string;
  importWheel: (data: string) => boolean;
}

export const DEFAULT_COLORS = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#A855F7', // Purple
];
