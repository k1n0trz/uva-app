import { create } from 'zustand';
import { idBySlug } from '../constants/products';

/**
 * "Mis productos" ownership states (ficha §16.1).
 *
 * Note `no-recuerdo`: the ficha explicitly wants "No recuerdo cuál es" as a
 * first-class answer, not a gap to nag about. Same spirit as "No tengo
 * productos UVA" — never a blocker.
 */
export type OwnershipState =
  | 'lo-tengo'
  | 'lo-uso'
  | 'quiero-conocerlo'
  | 'deje-de-usarlo'
  | 'no-recuerdo';

export const OWNERSHIP_LABELS: Record<OwnershipState, string> = {
  'lo-tengo': 'Lo tengo',
  'lo-uso': 'Lo uso actualmente',
  'quiero-conocerlo': 'Quiero conocerlo',
  'deje-de-usarlo': 'Dejé de usarlo',
  'no-recuerdo': 'No recuerdo cuál es',
};

/** Only these mean she actually has it — drives "Prepárate" and routine eligibility hints. */
export const OWNED_STATES: OwnershipState[] = ['lo-tengo', 'lo-uso', 'no-recuerdo'];

type MyProductsStore = {
  /** productId -> state */
  byId: Record<string, OwnershipState>;

  setState: (productId: string, state: OwnershipState) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  owns: (productId: string) => boolean;
  ownedIds: () => string[];
};

// Seeded to match the demo persona (Laura owns a cup and the Kegel balls).
// Keyed by slug -> real Woo id, so the seed survives a catalog re-generation.
const SEED_SLUGS: Record<string, OwnershipState> = {
  'copa-menstrual-uva-2-talla-a': 'lo-uso',
  'bolas-kegel-uva': 'lo-tengo',
};

const SEED: Record<string, OwnershipState> = Object.fromEntries(
  Object.entries(SEED_SLUGS)
    .map(([slug, state]) => [idBySlug(slug), state] as const)
    .filter((entry): entry is [string, OwnershipState] => !!entry[0])
);

export const useMyProductsStore = create<MyProductsStore>((set, get) => ({
  byId: SEED,

  setState: (productId, state) => set((s) => ({ byId: { ...s.byId, [productId]: state } })),

  remove: (productId) =>
    set((s) => {
      const next = { ...s.byId };
      delete next[productId];
      return { byId: next };
    }),

  has: (productId) => !!get().byId[productId],
  owns: (productId) => {
    const state = get().byId[productId];
    return !!state && OWNED_STATES.includes(state);
  },
  ownedIds: () =>
    Object.entries(get().byId)
      .filter(([, state]) => OWNED_STATES.includes(state))
      .map(([id]) => id),
}));
