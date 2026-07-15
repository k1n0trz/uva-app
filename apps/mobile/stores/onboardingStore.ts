import { create } from 'zustand';
import { NO_PRODUCTS_CHIP } from '../constants/onboarding';

export type OnboardingAnswers = {
  name: string;
  focus: string;
  status: string;
  lastPeriod: string;
  duration: string;
  products: string[];
  veraStyle: string;
  reminders: string;
  routineTime: string;
};

const EMPTY_ANSWERS: OnboardingAnswers = {
  name: '',
  focus: '',
  status: '',
  lastPeriod: '',
  duration: '',
  products: [],
  veraStyle: '',
  reminders: '',
  routineTime: '',
};

type OnboardingStore = {
  answers: OnboardingAnswers;
  step: number;
  voiceOn: boolean;
  consentGeneral: boolean;
  consentSensitive: boolean;

  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  toggleProduct: (product: string) => void;
  setStep: (step: number) => void;
  setVoiceOn: (on: boolean) => void;
  toggleVoice: () => void;
  setConsentGeneral: (value: boolean) => void;
  setConsentSensitive: (value: boolean) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  answers: EMPTY_ANSWERS,
  step: 0,
  voiceOn: false,
  consentGeneral: false,
  consentSensitive: false,

  setAnswer: (key, value) => set((s) => ({ answers: { ...s.answers, [key]: value } })),

  // "No tengo productos UVA" is mutually exclusive with any real product.
  toggleProduct: (product) =>
    set((s) => {
      const list = s.answers.products;
      const has = list.includes(product);
      let next: string[];
      if (product === NO_PRODUCTS_CHIP) {
        next = has ? [] : [product];
      } else {
        next = has ? list.filter((p) => p !== product) : [...list.filter((p) => p !== NO_PRODUCTS_CHIP), product];
      }
      return { answers: { ...s.answers, products: next } };
    }),

  setStep: (step) => set({ step }),
  setVoiceOn: (voiceOn) => set({ voiceOn }),
  toggleVoice: () => set((s) => ({ voiceOn: !s.voiceOn })),
  setConsentGeneral: (consentGeneral) => set({ consentGeneral }),
  setConsentSensitive: (consentSensitive) => set({ consentSensitive }),
  reset: () => set({ answers: EMPTY_ANSWERS, step: 0, voiceOn: false, consentGeneral: false, consentSensitive: false }),
}));
