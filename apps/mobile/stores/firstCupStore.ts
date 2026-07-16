import { create } from 'zustand';
import { CUP_STAGES } from '../constants/firstCup';

export type StageState = {
  done: boolean;
  expanded: boolean;
};

type FirstCupStore = {
  stages: StageState[];
  toggleExpanded: (index: number) => void;
  markDone: (index: number) => void;
  /** Repeating a stage is always allowed — nothing is one-shot (brief §13). */
  markUndone: (index: number) => void;
  progressPct: () => number;
  reset: () => void;
};

// Mock starting point: 5 of 14 stages done (~40%), matching the prototype's demo.
const initialStages = (): StageState[] => CUP_STAGES.map((_, i) => ({ done: i < 5, expanded: false }));

export const useFirstCupStore = create<FirstCupStore>((set, get) => ({
  stages: initialStages(),

  toggleExpanded: (index) =>
    set((s) => ({
      stages: s.stages.map((st, i) => (i === index ? { ...st, expanded: !st.expanded } : st)),
    })),

  markDone: (index) =>
    set((s) => ({ stages: s.stages.map((st, i) => (i === index ? { ...st, done: true } : st)) })),

  markUndone: (index) =>
    set((s) => ({ stages: s.stages.map((st, i) => (i === index ? { ...st, done: false } : st)) })),

  progressPct: () => {
    const { stages } = get();
    return Math.round((stages.filter((s) => s.done).length / stages.length) * 100);
  },

  reset: () => set({ stages: initialStages() }),
}));
