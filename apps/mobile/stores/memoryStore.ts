import { create } from 'zustand';

/**
 * User control over memory (ficha §19.4 / brief §18).
 *
 * The facts themselves are DERIVED from real app state (see hooks/useMemories),
 * not stored here — storing a second copy would let the two drift and she'd be
 * correcting a fact the app doesn't actually use. This store only holds what she
 * has done ABOUT those facts: turned memory off, corrected one, deleted one.
 */
type MemoryStore = {
  active: boolean;
  /** Ids she deleted. Kept so a derived fact doesn't silently reappear. */
  deletedIds: string[];
  /** Corrections to declared facts — her wording wins over ours. */
  overrides: Record<string, string>;

  setActive: (active: boolean) => void;
  deleteMemory: (id: string) => void;
  overrideMemory: (id: string, text: string) => void;
  restoreAll: () => void;
};

export const useMemoryStore = create<MemoryStore>((set) => ({
  active: true,
  deletedIds: [],
  overrides: {},

  setActive: (active) => set({ active }),
  deleteMemory: (id) => set((s) => ({ deletedIds: [...new Set([...s.deletedIds, id])] })),
  overrideMemory: (id, text) => set((s) => ({ overrides: { ...s.overrides, [id]: text } })),
  restoreAll: () => set({ deletedIds: [], overrides: {} }),
}));
