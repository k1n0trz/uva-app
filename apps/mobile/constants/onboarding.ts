/**
 * Conversational onboarding questions.
 * Source of truth: design-handoff prototype OB_QUESTIONS (UVA App.dc.html) +
 * ficha técnica §8.3 (preguntas iniciales de la asistente) and §8.4 (catálogo de
 * productos). Order and copy match the prototype so the built flow stays
 * pixel/word-faithful.
 */
import { ASSISTANT_NAME } from './brand';

export type OnboardingQuestionType = 'input' | 'chips' | 'products' | 'summary';

export type OnboardingQuestion = {
  key: string;
  q: string;
  type: OnboardingQuestionType;
  placeholder?: string;
  options?: string[];
  /** Optional questions can be skipped without penalizing the flow (ficha §8.2). */
  optional?: boolean;
};

export const OB_QUESTIONS: OnboardingQuestion[] = [
  { key: 'name', q: '¿Cómo quieres que te llame?', type: 'input', placeholder: 'Tu nombre', optional: true },
  {
    key: 'focus',
    q: '¿Qué te gustaría trabajar primero?',
    type: 'chips',
    options: ['Registro menstrual', 'Uso de copa o disco', 'Piso pélvico', 'Solo quiero explorar'],
  },
  {
    key: 'status',
    q: '¿Actualmente menstruas?',
    type: 'chips',
    options: [
      'Sí, menstruo',
      'Mi ciclo es irregular',
      'Estoy embarazada',
      'Estoy en posparto',
      'Perimenopausia o menopausia',
      'No menstruo actualmente',
      'Prefiero no responder',
    ],
  },
  { key: 'lastPeriod', q: '¿Cuándo comenzó tu último periodo?', type: 'input', placeholder: 'Fecha o "no lo recuerdo"', optional: true },
  {
    key: 'duration',
    q: '¿Cuántos días suele durar tu menstruación?',
    type: 'chips',
    options: ['2-3 días', '4-5 días', '6-7 días', 'No lo sé'],
    optional: true,
  },
  { key: 'products', q: '¿Qué productos UVA tienes actualmente?', type: 'products' },
  {
    key: 'abrilStyle',
    q: `¿Cómo prefieres que ${ASSISTANT_NAME} te responda?`,
    type: 'chips',
    options: ['Breve', 'Paso a paso', 'Cercana', 'Más técnica'],
    optional: true,
  },
  {
    key: 'reminders',
    q: '¿Qué tan discretos deben ser tus recordatorios?',
    type: 'chips',
    options: ['Normal', 'Discreto', 'Muy discreto'],
    optional: true,
  },
  {
    key: 'routineTime',
    q: '¿En qué momento prefieres tus rutinas?',
    type: 'chips',
    options: ['Mañana', 'Tarde', 'Noche', 'Varía'],
    optional: true,
  },
  { key: 'summary', q: 'Resumen', type: 'summary' },
];

/** Product chips for the onboarding step. "No tengo productos UVA" is a first-class,
 *  non-blocking answer (brief §8 / ficha §8.4). The full catalog with search lives
 *  in the dedicated "Mis productos" selection screen (Fase 6). */
export const ONBOARDING_PRODUCT_CHIPS = [
  'Copa Menstrual',
  'Disco Menstrual',
  'Panties Menstruales',
  'Kit Cuídate',
  'Bolas Kegel UVA',
  'No tengo productos UVA',
] as const;

export const NO_PRODUCTS_CHIP = 'No tengo productos UVA';

/** Human labels for the editable summary rows (excludes 'summary'). */
export const OB_SUMMARY_LABELS: Record<string, string> = {
  name: '¿Cómo te llamas?',
  focus: 'Enfoque principal',
  status: 'Situación menstrual',
  lastPeriod: 'Último periodo',
  duration: 'Duración',
  products: 'Tus productos UVA',
  abrilStyle: `Estilo de ${ASSISTANT_NAME}`,
  reminders: 'Recordatorios',
  routineTime: 'Momento de rutinas',
};
