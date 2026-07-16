import { create } from 'zustand';
import type { EnergyOption, FlowOption, MoodOption, PainOption, ProductOption } from '../constants/checkin';
import { NO_SYMPTOMS } from '../constants/checkin';

export type CheckIn = {
  flow: FlowOption | null;
  pain: PainOption | null;
  energy: EnergyOption | null;
  mood: MoodOption | null;
  symptoms: string[];
  product: ProductOption | null;
  note: string;
};

export const EMPTY_CHECKIN: CheckIn = {
  flow: null,
  pain: null,
  energy: null,
  mood: null,
  symptoms: [],
  product: null,
  note: '',
};

/** A check-in counts as "registered" once the user recorded anything at all —
 *  partial logging is valid (brief §10: estado "registro parcial"). */
export function isEmptyCheckIn(c: CheckIn): boolean {
  return (
    !c.flow && !c.pain && !c.energy && !c.mood && c.symptoms.length === 0 && !c.product && c.note.trim() === ''
  );
}

/** True when the user gave a few signals but not the full picture. */
export function isPartialCheckIn(c: CheckIn): boolean {
  if (isEmptyCheckIn(c)) return false;
  return !c.flow || !c.pain || !c.energy || !c.mood;
}

type CheckinStore = {
  /** Saved check-ins keyed by ISO date (mock persistence; real one is Codex's backend). */
  byDate: Record<string, CheckIn>;
  /** The check-in currently being edited in the sheet. */
  draft: CheckIn;

  openDraftFor: (isoDate: string) => void;
  setDraftField: <K extends keyof CheckIn>(key: K, value: CheckIn[K]) => void;
  toggleDraftSymptom: (symptom: string) => void;
  saveDraft: (isoDate: string) => void;
  resetDraft: () => void;
};

export const useCheckinStore = create<CheckinStore>((set, get) => ({
  byDate: {},
  draft: EMPTY_CHECKIN,

  // Editing an existing check-in preloads it (brief §10: estado "edición").
  openDraftFor: (isoDate) => set({ draft: get().byDate[isoDate] ?? EMPTY_CHECKIN }),

  setDraftField: (key, value) => set((s) => ({ draft: { ...s.draft, [key]: value } })),

  // "Sin síntomas" is mutually exclusive with any real symptom.
  toggleDraftSymptom: (symptom) =>
    set((s) => {
      const list = s.draft.symptoms;
      const has = list.includes(symptom);
      let next: string[];
      if (symptom === NO_SYMPTOMS) {
        next = has ? [] : [symptom];
      } else {
        next = has ? list.filter((x) => x !== symptom) : [...list.filter((x) => x !== NO_SYMPTOMS), symptom];
      }
      return { draft: { ...s.draft, symptoms: next } };
    }),

  saveDraft: (isoDate) => set((s) => ({ byDate: { ...s.byDate, [isoDate]: s.draft } })),

  resetDraft: () => set({ draft: EMPTY_CHECKIN }),
}));
