/**
 * Pelvic floor & wellbeing routines.
 *
 * ⚠️ CONTENIDO PENDIENTE DE VALIDACIÓN CLÍNICA por un profesional de piso
 * pélvico (ficha §33, §15.5, §25.4). Placeholders con el tono correcto — no son
 * guía clínica final.
 *
 * Core principle (ficha §15.1): do NOT assume every user needs strengthening.
 * Some need awareness, coordination or relaxation. Owning Bolas Kegel UVA does
 * not, by itself, enable the weighted levels.
 *
 * Language rules (brief §15):
 *   - "rutina completada", never "contracción perfecta".
 *   - Never claim the app detected a correct contraction — it cannot.
 */

import type { ImageSourcePropType } from 'react-native';

export type Routine = {
  id: string;
  name: string;
  desc: string;
  durationLabel: string;
  durationSec: number;
  icon: ImageSourcePropType;
  /** Kegel levels require the eligibility gate; general routines never do. */
  requiresKegel?: boolean;
  level?: 1 | 2 | 3;
};

/** Available to every eligible user, with or without any UVA product (ficha §15.3). */
export const GENERAL_ROUTINES: Routine[] = [
  {
    id: 'r1',
    name: 'Conciencia corporal',
    desc: 'Escanea y reconoce',
    durationLabel: '4 min',
    durationSec: 240,
    icon: require('../assets/routines/routine-conciencia.png'),
  },
  {
    id: 'r2',
    name: 'Respiración y relajación',
    desc: 'Respiración 4-7-8',
    durationLabel: '3 min',
    durationSec: 180,
    icon: require('../assets/routines/routine-respiracion.png'),
  },
  {
    id: 'r3',
    name: 'Coordinación',
    desc: 'Contrae y suelta con ritmo',
    durationLabel: '5 min',
    durationSec: 300,
    icon: require('../assets/routines/routine-coordinacion.png'),
  },
  {
    id: 'r4',
    name: 'Fortalecimiento inicial',
    desc: 'Series base sin bolas',
    durationLabel: '6 min',
    durationSec: 360,
    icon: require('../assets/routines/routine-fortalecimiento.png'),
  },
  {
    id: 'r5',
    name: 'Resistencia',
    desc: 'Series de mantenimiento',
    durationLabel: '8 min',
    durationSec: 480,
    icon: require('../assets/routines/routine-resistencia.png'),
  },
];

/** Only shown once the eligibility gate passes (ficha §15.4). */
export const KEGEL_LEVELS: Routine[] = [
  {
    id: 'kegel1',
    name: 'Nivel 1 · Iniciación',
    desc: 'Reconocimiento y control básico',
    durationLabel: '5 min',
    durationSec: 300,
    icon: require('../assets/routines/routine-fortalecimiento.png'),
    requiresKegel: true,
    level: 1,
  },
  {
    id: 'kegel2',
    name: 'Nivel 2 · Progresión',
    desc: 'Series con mayor resistencia',
    durationLabel: '7 min',
    durationSec: 420,
    icon: require('../assets/routines/routine-coordinacion.png'),
    requiresKegel: true,
    level: 2,
  },
  {
    id: 'kegel3',
    name: 'Nivel 3 · Mantenimiento',
    desc: 'Rutina de mantenimiento',
    durationLabel: '9 min',
    durationSec: 540,
    icon: require('../assets/routines/routine-resistencia.png'),
    requiresKegel: true,
    level: 3,
  },
];

export const ALL_ROUTINES = [...GENERAL_ROUTINES, ...KEGEL_LEVELS];

export function findRoutine(id: string): Routine | undefined {
  return ALL_ROUTINES.find((r) => r.id === id);
}

// ---------------------------------------------------------------------------
// Kegel eligibility intake (ficha §15.2)
// ---------------------------------------------------------------------------

export type IntakeKey =
  | 'owns'
  | 'goal'
  | 'experience'
  | 'identify'
  | 'leaks'
  | 'pain'
  | 'relax'
  | 'pregnancy'
  | 'professional';

export type IntakeQuestion = {
  key: IntakeKey;
  q: string;
  options: string[];
  /** Explains why we ask — the app should be explicable (ficha §18.5). */
  why?: string;
};

export const KEGEL_INTAKE: IntakeQuestion[] = [
  {
    key: 'owns',
    q: '¿Tienes Bolas Kegel UVA?',
    options: ['Sí', 'No'],
    why: 'Las rutinas con peso solo aparecen si las tienes. Sin ellas hay una ruta completa igual de válida.',
  },
  {
    key: 'goal',
    q: '¿Cuál es tu objetivo?',
    options: ['Fortalecer', 'Prevenir escapes', 'Recuperación posparto', 'Solo explorar'],
  },
  {
    key: 'experience',
    q: '¿Has hecho estos ejercicios antes?',
    options: ['Sí', 'No', 'No lo sé'],
  },
  {
    key: 'identify',
    q: '¿Puedes identificar cuándo contraes y cuándo relajas?',
    options: ['Sí', 'Más o menos', 'No'],
    why: 'Si aún no lo identificas, conviene empezar por conciencia y coordinación.',
  },
  {
    key: 'leaks',
    q: '¿Tienes escapes al toser, correr o saltar?',
    options: ['No', 'A veces', 'Con frecuencia'],
  },
  {
    key: 'pain',
    q: '¿Sientes dolor, presión o pesadez pélvica?',
    options: ['No', 'A veces', 'Sí'],
    why: 'Con dolor o presión no se recomienda usar peso.',
  },
  {
    key: 'relax',
    q: '¿Te cuesta relajar el piso pélvico?',
    options: ['No', 'A veces', 'Sí'],
    why: 'Si cuesta relajar, fortalecer puede empeorarlo. Primero trabajamos relajación.',
  },
  {
    key: 'pregnancy',
    q: '¿Estás embarazada o en posparto?',
    options: ['No', 'Embarazada', 'Posparto'],
    why: 'Estas etapas necesitan una ruta validada por un profesional.',
  },
  {
    key: 'professional',
    q: '¿Un profesional te ha desaconsejado estos ejercicios?',
    options: ['No', 'Sí', 'No lo sé'],
  },
];

// ---------------------------------------------------------------------------
// Post-routine self-assessment (brief §15 / ficha §15.4)
// ---------------------------------------------------------------------------

export type EvalKey = 'comfort' | 'control' | 'pain';

export const EVAL_QUESTIONS: { key: EvalKey; q: string; options: string[] }[] = [
  { key: 'comfort', q: '¿Qué tan cómoda te sentiste?', options: ['Cómoda', 'Neutral', 'Incómoda'] },
  { key: 'control', q: '¿Sentiste control durante la rutina?', options: ['Sí', 'Parcial', 'No'] },
  { key: 'pain', q: '¿Hubo dolor o presión?', options: ['No', 'Un poco', 'Sí'] },
];

export const PAIN_WARNING =
  'Notamos molestia o dolor. Te recomendamos pausar esta rutina y, si persiste, consultar a un profesional de piso pélvico.';
