/**
 * What Abril remembers.
 *
 * Two hard rules from the ficha:
 *
 * §18.1/§19.4 — memory stores STRUCTURED FACTS, not whole conversations kept
 * forever. Each fact carries its source and can be corrected or deleted.
 *
 * §18.2 — things Abril must NEVER infer silently. This list is not decoration:
 * if a future recommendation engine starts deriving any of these, it's a bug,
 * not a feature.
 */
export const NEVER_INFER = [
  'diagnósticos',
  'embarazo',
  'orientación sexual',
  'actividad sexual',
  'infertilidad',
  'problemas de pareja',
  'capacidad económica',
  'estado emocional clínico',
] as const;

/**
 * Where a fact came from.
 * - `declarado`: she told us. Editable, and we can quote it back with confidence.
 * - `inferido`: we derived it from her activity. Must be labeled as such and
 *   always be wrong-able — she gets the last word (§18.5 explicabilidad).
 */
export type MemorySource = 'declarado' | 'inferido';

export type Memory = {
  id: string;
  source: MemorySource;
  /** The fact, in her language. */
  text: string;
  /** Why the app keeps it — every fact must justify itself (ficha §18.5). */
  why: string;
  /** Declared facts can be corrected in place; inferred ones are deleted, not edited. */
  editable: boolean;
};

export const MEMORY_SOURCE_LABELS: Record<MemorySource, string> = {
  declarado: 'Lo dijiste tú',
  inferido: 'Lo deduje yo',
};

export const MEMORY_EXPLAINER =
  'Esto es todo lo que recuerdo de ti. Lo que dijiste tú lo puedes corregir; lo que deduje yo lo puedes borrar si me equivoqué. Nada de esto se usa para publicidad fuera de la app.';
