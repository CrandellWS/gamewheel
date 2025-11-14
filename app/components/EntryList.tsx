'use client';

import { useState } from 'react';
import { useWheelStore } from '../stores/wheelStore';
import { Plus, Trash2, Edit2, Check, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BulkAddModal } from './BulkAddModal';
import toast from 'react-hot-toast';

export function EntryList() {
  const { entries, addEntry, removeEntry, updateEntry, resetWheel, settings } =
    useWheelStore();

  const [newEntryName, setNewEntryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  const activeEntries = entries.filter((e) => !e.removed);
  const removedEntries = entries.filter((e) => e.removed);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntryName.trim()) {
      addEntry(newEntryName);
      setNewEntryName('');
      toast.success(`Added "${newEntryName}"`);
    }
  };

  const handleBulkAdd = (names: string[]) => {
    names.forEach((name) => addEntry(name));
    toast.success(`Added ${names.length} entries`);
  };

  const handleRemoveEntry = (id: string, name: string) => {
    removeEntry(id);
    toast.success(`Removed "${name}"`);
  };

  const handleResetWheel = () => {
    resetWheel();
    toast.success('All entries restored');
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      updateEntry(id, { name: editValue.trim() });
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleColorChange = (id: string, color: string) => {
    updateEntry(id, { color });
  };

  const handleWeightChange = (id: string, weight: number) => {
    updateEntry(id, { weight: Math.max(1, Math.min(10, weight)) });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {settings.terminology} ({activeEntries.length})
        </h2>
        {removedEntries.length > 0 && (
          <button
            onClick={handleResetWheel}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-100
                     dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300
                     rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800
                     transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </button>
        )}
      </div>

      {/* Add Entry Form */}
      <form onSubmit={handleAddEntry} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newEntryName}
            onChange={(e) => setNewEntryName(e.target.value)}
            placeholder="Enter name..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600
                     rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
            maxLength={30}
          />
          <button
            type="submit"
            disabled={!newEntryName.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg
                     hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
      </form>

      <button
        onClick={() => setShowBulkAdd(true)}
        className="w-full mb-4 px-4 py-2 text-sm border-2 border-dashed
                 border-gray-300 dark:border-gray-600 rounded-lg
                 hover:border-indigo-500 dark:hover:border-indigo-400
                 transition-colors text-gray-600 dark:text-gray-400
                 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
      >
        📝 Bulk Add (paste multiple names)
      </button>

      {/* Entry List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {activeEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700
                       rounded-lg group hover:shadow-md transition-shadow"
            >
              {/* Color Picker */}
              <input
                type="color"
                value={entry.color}
                onChange={(e) => handleColorChange(entry.id, e.target.value)}
                className="w-12 h-12 sm:w-10 sm:h-10 rounded cursor-pointer border-2
                         border-gray-300 dark:border-gray-600 flex-shrink-0"
                title="Change color"
              />

              {/* Name */}
              {editingId === entry.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-2 py-1 border border-indigo-500 rounded
                             dark:bg-gray-600 dark:text-white"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(entry.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <button
                    onClick={() => saveEdit(entry.id)}
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white flex-1">
                    {entry.name}
                  </span>

                  {/* Weight - Always visible on mobile, hover on desktop */}
                  <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100
                                transition-opacity">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Weight:</span>
                    <input
                      type="number"
                      value={entry.weight}
                      onChange={(e) =>
                        handleWeightChange(entry.id, parseInt(e.target.value))
                      }
                      min="1"
                      max="10"
                      className="w-14 px-2 py-1 text-center border rounded
                               dark:bg-gray-600 dark:border-gray-500 text-sm
                               focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      title="Probability weight (1-10). Higher = more likely to win"
                    />
                  </div>
                </div>
              )}

              {/* Actions - Always visible on mobile, hover on desktop */}
              {editingId !== entry.id && (
                <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100
                              transition-opacity">
                  <button
                    onClick={() => startEditing(entry.id, entry.name)}
                    className="p-2 sm:p-1.5 text-blue-600 hover:bg-blue-100
                             dark:hover:bg-blue-900 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveEntry(entry.id, entry.name)}
                    className="p-2 sm:p-1.5 text-red-600 hover:bg-red-100
                             dark:hover:bg-red-900 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {activeEntries.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No {settings.terminology.toLowerCase()} yet. Add some above!</p>
          </div>
        )}
      </div>

      {/* Removed Entries */}
      {removedEntries.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Removed ({removedEntries.length})
          </p>
          <div className="space-y-1">
            {removedEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700
                         rounded text-sm opacity-60"
              >
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-700 dark:text-gray-300 line-through">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      <AnimatePresence>
        {showBulkAdd && (
          <BulkAddModal
            onClose={() => setShowBulkAdd(false)}
            onAdd={handleBulkAdd}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
