/**
 * Kegel safety rules — pure logic, no state, no UI.
 *
 * Kept separate so it can be tested directly and so the backend can mirror it
 * exactly (ficha §15.4 makes the server the real authority; the client must not
 * be the only thing standing between a user and an unsafe routine).
 *
 * The two rules that matter:
 *   1. Weighted levels never unlock by purchase — only by explicit, complete,
 *      exclusion-free answers (§15.4).
 *   2. Progression never comes from a single session or elapsed days — it comes
 *      from adherence plus a pain-free self-assessment (brief §15).
 *
 * Both FAIL CLOSED: missing data is never treated as a pass.
 */

export type IntakeKey = 'owns' | 'goal' | 'experience' | 'identify' | 'leaks' | 'pain' | 'relax' | 'pregnancy' | 'professional';
export type EvalKey = 'comfort' | 'control' | 'pain';

export type IntakeAnswers = Partial<Record<IntakeKey, string>>;
export type RoutineEval = Partial<Record<EvalKey, string>>;

export type SessionRecord = {
  routineId: string;
  routineName: string;
  at: number;
  evaluation: RoutineEval;
};

export type Eligibility = {
  /** Owns the balls. Necessary but NOT sufficient. */
  owns: boolean;
  /** Every safety question has an explicit answer. */
  complete: boolean;
  /** owns + complete + no exclusion signals. */
  eligible: boolean;
  reasons: string[];
};

/** Must be answered explicitly before any weighted level opens. */
export const SAFETY_KEYS: IntakeKey[] = ['pain', 'relax', 'pregnancy', 'professional', 'identify'];

/** Sessions of a level required before the next one can open — adherence, not one lucky run. */
export const MIN_SESSIONS_TO_ADVANCE = 2;

export function computeEligibility(a: IntakeAnswers): Eligibility {
  const owns = a.owns === 'Sí';
  const complete = SAFETY_KEYS.every((k) => !!a[k]);
  const reasons: string[] = [];

  // Note the `!== 'No'` shape: only an explicit "No" clears each signal.
  // Checking for known-bad values instead would let an unanswered question pass.
  if (a.pain && a.pain !== 'No') {
    reasons.push('Reportaste dolor, presión o pesadez pélvica. Con esas señales no se recomienda usar peso.');
  }
  if (a.relax && a.relax !== 'No') {
    reasons.push('Te cuesta relajar el piso pélvico. Fortalecer antes de relajar puede empeorarlo.');
  }
  if (a.pregnancy && a.pregnancy !== 'No') {
    reasons.push('El embarazo y el posparto necesitan una ruta validada por un profesional.');
  }
  if (a.professional && a.professional !== 'No') {
    reasons.push('Un profesional te desaconsejó estos ejercicios, o no estás segura. Su indicación va primero.');
  }
  if (a.identify === 'No') {
    reasons.push('Aún no identificas cuándo contraes y relajas. Ese es el punto de partida, antes del peso.');
  }

  return { owns, complete, eligible: owns && complete && reasons.length === 0, reasons };
}

export function levelCleared(sessions: SessionRecord[], level: number): boolean {
  const forLevel = sessions.filter((s) => s.routineId === `kegel${level}`);
  if (forLevel.length < MIN_SESSIONS_TO_ADVANCE) return false;
  const last = forLevel[forLevel.length - 1];
  return last.evaluation.pain === 'No' && last.evaluation.control === 'Sí' && last.evaluation.comfort !== 'Incómoda';
}

/** Weighted levels open right now, given the intake and session history. */
export function unlockedLevels(intake: IntakeAnswers, sessions: SessionRecord[]): number[] {
  if (!computeEligibility(intake).eligible) return [];
  const open = [1];
  if (levelCleared(sessions, 1)) open.push(2);
  if (open.includes(2) && levelCleared(sessions, 2)) open.push(3);
  return open;
}

/** Why the next level is still closed — progression must be explicable. */
export function nextLevelHint(level: number): string {
  return `Completa al menos ${MIN_SESSIONS_TO_ADVANCE} sesiones del Nivel ${level - 1} sin dolor y sintiendo control para abrir este nivel.`;
}
