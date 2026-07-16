import { create } from 'zustand';
import {
  computeEligibility,
  unlockedLevels,
  type Eligibility,
  type IntakeAnswers,
  type IntakeKey,
  type RoutineEval,
  type SessionRecord,
} from '../lib/kegelRules';

export type { Eligibility, IntakeAnswers, RoutineEval, SessionRecord };
export { computeEligibility, nextLevelHint } from '../lib/kegelRules';

type RoutinesStore = {
  intake: IntakeAnswers;
  intakeCompleted: boolean;
  sessions: SessionRecord[];

  setIntakeAnswer: (key: IntakeKey, value: string) => void;
  completeIntake: () => void;
  resetIntake: () => void;
  recordSession: (record: SessionRecord) => void;

  eligibility: () => Eligibility;
  /** Which weighted levels are open right now. */
  unlockedLevels: () => number[];
};

/** State only — the safety rules live in lib/kegelRules.ts so they stay pure and testable. */
export const useRoutinesStore = create<RoutinesStore>((set, get) => ({
  intake: {},
  intakeCompleted: false,
  sessions: [],

  setIntakeAnswer: (key, value) => set((s) => ({ intake: { ...s.intake, [key]: value } })),
  completeIntake: () => set({ intakeCompleted: true }),
  resetIntake: () => set({ intake: {}, intakeCompleted: false }),
  recordSession: (record) => set((s) => ({ sessions: [...s.sessions, record] })),

  eligibility: () => computeEligibility(get().intake),
  unlockedLevels: () => unlockedLevels(get().intake, get().sessions),
}));
