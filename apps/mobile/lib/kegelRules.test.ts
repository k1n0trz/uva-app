/**
 * Safety rules for the weighted Kegel levels.
 *
 * These aren't ordinary unit tests — they encode health constraints from the
 * ficha técnica (§15.4/§15.5). If one fails, the app is proposing a routine to
 * someone it shouldn't. Codex's backend must satisfy the same table.
 *
 * Run: npm run test:rules
 */
import assert from 'node:assert/strict';
import { computeEligibility, unlockedLevels, type IntakeAnswers, type SessionRecord } from './kegelRules.ts';

const CLEAN: IntakeAnswers = {
  owns: 'Sí',
  goal: 'Fortalecer',
  experience: 'Sí',
  identify: 'Sí',
  leaks: 'No',
  pain: 'No',
  relax: 'No',
  pregnancy: 'No',
  professional: 'No',
};

const GOOD_EVAL = { pain: 'No', control: 'Sí', comfort: 'Cómoda' };
const session = (routineId: string, evaluation: Record<string, string>): SessionRecord => ({
  routineId,
  routineName: routineId,
  at: Date.now(),
  evaluation,
});

const cases: { name: string; got: number[]; want: number[] }[] = [
  // The rule the ficha calls out explicitly: buying the product unlocks nothing.
  { name: 'Solo declarar que tiene las bolas, sin evaluación', got: unlockedLevels({ owns: 'Sí' }, []), want: [] },
  { name: 'Evaluación a medias (falta "relax")', got: unlockedLevels({ ...CLEAN, relax: undefined }, []), want: [] },
  { name: 'No tiene las bolas, todo lo demás limpio', got: unlockedLevels({ ...CLEAN, owns: 'No' }, []), want: [] },

  { name: 'Evaluación limpia, 0 sesiones → solo Nivel 1', got: unlockedLevels(CLEAN, []), want: [1] },

  // Progression never comes from a single session.
  { name: 'UNA sesión buena de N1 → N2 sigue cerrado', got: unlockedLevels(CLEAN, [session('kegel1', GOOD_EVAL)]), want: [1] },
  {
    name: 'DOS sesiones buenas de N1 → N2 abre',
    got: unlockedLevels(CLEAN, [session('kegel1', GOOD_EVAL), session('kegel1', GOOD_EVAL)]),
    want: [1, 2],
  },
  {
    name: 'DOS sesiones de N1 pero la última con dolor → N2 cerrado',
    got: unlockedLevels(CLEAN, [session('kegel1', GOOD_EVAL), session('kegel1', { ...GOOD_EVAL, pain: 'Sí' })]),
    want: [1],
  },
  {
    name: 'DOS sesiones de N1 pero sin sensación de control → N2 cerrado',
    got: unlockedLevels(CLEAN, [session('kegel1', GOOD_EVAL), session('kegel1', { ...GOOD_EVAL, control: 'No' })]),
    want: [1],
  },
  {
    name: 'N1 y N2 completados bien → N3 abre',
    got: unlockedLevels(CLEAN, [
      session('kegel1', GOOD_EVAL),
      session('kegel1', GOOD_EVAL),
      session('kegel2', GOOD_EVAL),
      session('kegel2', GOOD_EVAL),
    ]),
    want: [1, 2, 3],
  },
  {
    name: 'No se puede saltar N2: sesiones de N3 sin haber abierto N2',
    got: unlockedLevels(CLEAN, [session('kegel3', GOOD_EVAL), session('kegel3', GOOD_EVAL)]),
    want: [1],
  },

  // Exclusion signals (ficha §15.5) — each one closes everything, even with history.
  {
    name: 'Embarazada, aunque tenga historial impecable',
    got: unlockedLevels({ ...CLEAN, pregnancy: 'Embarazada' }, [session('kegel1', GOOD_EVAL), session('kegel1', GOOD_EVAL)]),
    want: [],
  },
  { name: 'Posparto', got: unlockedLevels({ ...CLEAN, pregnancy: 'Posparto' }, []), want: [] },
  { name: 'Dolor o presión pélvica', got: unlockedLevels({ ...CLEAN, pain: 'Sí' }, []), want: [] },
  { name: 'Dolor solo "a veces" también excluye', got: unlockedLevels({ ...CLEAN, pain: 'A veces' }, []), want: [] },
  { name: 'Dificultad para relajar', got: unlockedLevels({ ...CLEAN, relax: 'Sí' }, []), want: [] },
  { name: 'Un profesional lo desaconsejó', got: unlockedLevels({ ...CLEAN, professional: 'Sí' }, []), want: [] },
  { name: 'No sabe si un profesional lo desaconsejó → prudencia', got: unlockedLevels({ ...CLEAN, professional: 'No lo sé' }, []), want: [] },
  { name: 'Aún no identifica contracción/relajación', got: unlockedLevels({ ...CLEAN, identify: 'No' }, []), want: [] },
];

let failed = 0;
for (const c of cases) {
  try {
    assert.deepEqual(c.got, c.want);
    console.log(`  ✓ ${c.name}`);
  } catch {
    failed++;
    console.error(`  ✗ ${c.name}\n      obtenido=[${c.got}] esperado=[${c.want}]`);
  }
}

// Excluded users must always be told why — a silent lock is not acceptable.
const excluded = computeEligibility({ ...CLEAN, pain: 'Sí' });
try {
  assert.equal(excluded.eligible, false);
  assert.ok(excluded.reasons.length > 0, 'una exclusión debe explicar el motivo');
  console.log('  ✓ Una exclusión siempre explica el motivo');
} catch (e) {
  failed++;
  console.error(`  ✗ Una exclusión siempre explica el motivo: ${(e as Error).message}`);
}

console.log(`\n${cases.length + 1 - failed}/${cases.length + 1} reglas de seguridad correctas`);
if (failed > 0) process.exit(1);
