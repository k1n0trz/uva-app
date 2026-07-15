import { create } from 'zustand';

/**
 * Development-only scenario switcher, ported 1:1 from the prototype's
 * `<select>` at the top of UVA App.dc.html. Lets us demo every state
 * (new user, no products, first cup, Kegel-eligible, irregular cycle,
 * mic denied, offline) before any of it is backed by a real account.
 */
export const SCENARIOS = [
  { id: 'laura', label: 'Laura (demo completa)' },
  { id: 'newUser', label: 'Usuaria nueva' },
  { id: 'noProducts', label: 'Sin productos UVA' },
  { id: 'firstCup', label: 'Primera usuaria de copa' },
  { id: 'kegel', label: 'Con Bolas Kegel' },
  { id: 'irregular', label: 'Ciclo irregular' },
  { id: 'micDenied', label: 'Micrófono denegado' },
  { id: 'offline', label: 'Sin conexión' },
] as const;

export type ScenarioId = (typeof SCENARIOS)[number]['id'];

type ScenarioStore = {
  scenario: ScenarioId;
  setScenario: (scenario: ScenarioId) => void;
};

export const useScenarioStore = create<ScenarioStore>((set) => ({
  scenario: 'laura',
  setScenario: (scenario) => set({ scenario }),
}));

/** Derived flags used throughout the app — mirrors renderVals() in the prototype. */
export function scenarioFlags(scenario: ScenarioId) {
  return {
    hasProducts: scenario !== 'noProducts' && scenario !== 'newUser',
    hasCup: scenario === 'firstCup' || scenario === 'laura',
    hasKegelBalls: scenario === 'kegel' || scenario === 'laura',
    cycleIrregular: scenario === 'irregular',
    micDenied: scenario === 'micDenied',
    isOffline: scenario === 'offline',
    isNewUser: scenario === 'newUser',
  };
}

export function useScenarioFlags() {
  const scenario = useScenarioStore((s) => s.scenario);
  return { scenario, ...scenarioFlags(scenario) };
}
