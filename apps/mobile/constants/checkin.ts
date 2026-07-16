/**
 * Daily check-in options.
 * Data inputs come from ficha técnica §12.1 (flujo, dolor, energía, ánimo,
 * síntomas, producto, nota). The visual language (single-select rows for
 * scales, chips for multi-select) matches the design-handoff prototype.
 *
 * Keep this list short on purpose — brief §10: "Debe completarse en pocos
 * segundos".
 */

export const FLOW_OPTIONS = ['Ligero', 'Moderado', 'Abundante', 'Manchado'] as const;
export const PAIN_OPTIONS = ['Sin dolor', 'Leve', 'Moderado', 'Fuerte'] as const;
export const ENERGY_OPTIONS = ['Baja', 'Normal', 'Alta'] as const;
export const MOOD_OPTIONS = ['Tranquila', 'Sensible', 'Irritable', 'Animada'] as const;

export const SYMPTOM_OPTIONS = [
  'Cólicos',
  'Dolor de espalda',
  'Cansancio',
  'Cambios de ánimo',
  'Sensibilidad',
  'Sin síntomas',
] as const;

/** Mutually exclusive with any other symptom. */
export const NO_SYMPTOMS = 'Sin síntomas';

export const PRODUCT_OPTIONS = ['Copa', 'Disco', 'Panty', 'Toalla', 'Tampón', 'Ninguno'] as const;

export type FlowOption = (typeof FLOW_OPTIONS)[number];
export type PainOption = (typeof PAIN_OPTIONS)[number];
export type EnergyOption = (typeof ENERGY_OPTIONS)[number];
export type MoodOption = (typeof MOOD_OPTIONS)[number];
export type ProductOption = (typeof PRODUCT_OPTIONS)[number];
