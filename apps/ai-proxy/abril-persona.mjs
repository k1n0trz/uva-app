/**
 * Abril's brain: personality + non-negotiable health limits.
 *
 * This is the "orquestador de IA" of ficha §19, in miniature. The LLM is
 * powerful but not trusted on its own — the safety rules live HERE, on the
 * server, not in the prompt alone and never in the app. Codex's production
 * backend must preserve every rule in this file.
 *
 * Sources: ficha §6.2 (personalidad), §25.4 (límites de salud), §18.2 (lo que
 * nunca se infiere), §17.4 (reglas comerciales), §11.2 (voz).
 */

/**
 * System prompt. The personality is warm and specific; the limits are stated as
 * hard rules, not suggestions. Written in Spanish because Abril thinks and
 * speaks in Colombian Spanish.
 */
export const ABRIL_SYSTEM_PROMPT = `Eres Abril, la acompañante de UVA App, una plataforma de bienestar femenino.

QUIÉN ERES
- Hablas como una amiga informada y cálida, sin infantilizar y sin sonar clínica.
- Tono: cercano, elegante, directo, respetuoso. Español de Colombia.
- Acompañas a la usuaria antes, durante y después de su menstruación, y en el cuidado de su piso pélvico.
- Reconoces la incertidumbre. No afirmas lo que no puedes comprobar. Prefieres "podría" a "es".

LÍMITES DE SALUD (INQUEBRANTABLES)
- NO diagnosticas. Nunca nombras ni sugieres enfermedades o condiciones.
- NO reemplazas a un profesional de salud ni a fisioterapia de piso pélvico.
- NO prometes prevenir el embarazo ni confirmas fertilidad u ovulación. La predicción del ciclo es un rango aproximado, nunca un método anticonceptivo.
- NO infieres embarazo, orientación sexual, actividad sexual, infertilidad, problemas de pareja, capacidad económica ni estado emocional clínico.
- Ante dolor intenso o persistente, sangrado preocupante o señales de alerta: no minimizas, sugieres pausar el uso y consultar a un profesional. Con calma, sin alarmar.
- No recomiendas ejercicios de Kegel con peso si la persona reporta dolor, presión, dificultad para relajar, embarazo o posparto: eso lo decide la evaluación de la app, no tú.

CÓMO RESPONDES
- Breve por defecto. Cada respuesta termina en algo útil: un siguiente paso, un registro, una opción.
- Explicas el porqué cuando propones una rutina o un producto.
- No conviertes la conversación en una venta. Primero ayudas; lo comercial es opcional, se explica y nunca se insiste. Jamás muestras nada comercial cuando la persona está angustiada o con dolor.
- Si no sabes algo o cae fuera de tu alcance, lo dices y sugieres a quién acudir.
- No usas emojis en exceso. No usas lenguaje vulgar. No juzgas.

Responde solo como Abril, en el idioma de la usuaria (español), sin prefacios como "Como IA".`;

/** Lowercase and strip diacritics, so "cólico" and "colico" match the same
 *  rule regardless of how the accent arrived over the wire. This is the safety
 *  path — it must not hinge on encoding. */
function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Lightweight intent classification. Drives Abril's avatar state and the
 * safety routing. This runs BEFORE the LLM so a pain signal is handled even if
 * the model somehow ignored the prompt.
 */
export function classifyIntent(text) {
  const t = normalize(text);
  // "no puedo" alone is too broad (e.g. "no puedo quedar embarazada"); scope it
  // to the actual rescue situation.
  if (/dolor|duele|colico|molestia|sangrado|no (puedo|logro) (retirar|sacar|quitar)|me manche/.test(t)) {
    return { intent: 'dolor', warn: true };
  }
  if (/rutina|respirac|relajac|kegel|ejercicio/.test(t)) return { intent: 'rutina', warn: false };
  if (/periodo|regla|menstrua|ciclo|cuando llega/.test(t)) return { intent: 'periodo', warn: false };
  return { intent: null, warn: false };
}

/** Patterns the assistant must never produce. Backstop after the LLM, in case
 *  the model slips despite the prompt. Not a substitute for the prompt — a net. */
const FORBIDDEN_OUTPUT = [
  /\best[aá]s embarazada\b/i,
  /\btienes (endometriosis|sop|s[ií]ndrome de ovario|una infecci[oó]n|vaginismo)\b/i,
  /\b(previene|evita|protege contra) el embarazo\b/i,
  /\b(garantiza|asegura) (que no|tu) (quedes|fertilidad|embaraz)/i,
];

export const PROFESSIONAL_REFERRAL =
  'Si el dolor es intenso o persistente, pausa el uso y consulta a un profesional de salud.';

/**
 * Post-check the model's output. If it crossed a hard line, replace it with a
 * safe, honest fallback rather than shipping the unsafe text.
 */
export function filterOutput(text, intent) {
  const crossed = FORBIDDEN_OUTPUT.some((re) => re.test(normalize(text)) || re.test(text));
  if (crossed) {
    return {
      text: 'Prefiero no aventurar eso: no puedo diagnosticar ni confirmarlo. Si te preocupa, lo mejor es consultarlo con un profesional de salud. ¿Quieres que te acompañe con un registro o una rutina mientras tanto?',
      replaced: true,
    };
  }
  // On a pain intent, make sure the referral is present even if the model omitted it.
  if (intent === 'dolor' && !/profesional/i.test(text)) {
    return { text: `${text}\n\n${PROFESSIONAL_REFERRAL}`, replaced: false };
  }
  return { text, replaced: false };
}

/** Map intent → Abril's avatar state, so her face matches the conversation. */
export function avatarStateForIntent(intent) {
  if (intent === 'dolor') return 'concerned';
  if (intent === 'rutina') return 'guiding';
  return 'speaking';
}
