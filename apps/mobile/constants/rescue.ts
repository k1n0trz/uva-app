/**
 * Modo Rescate — situations and guidance.
 *
 * ⚠️ CONTENIDO PENDIENTE DE VALIDACIÓN CLÍNICA.
 * Copy is adapted from the design-handoff prototype (RESCUE_OPTIONS) and ficha
 * técnica §14. The ficha requires this content to be reviewed and approved by a
 * pelvic-floor professional before production (§25.4: "El contenido sensible
 * debe tener propietario y aprobación profesional"). Treat these strings as
 * placeholders pending that sign-off, not as final medical guidance.
 *
 * Rules baked in here (ficha §14):
 *   - Short, calm, actionable steps. Never a diagnosis.
 *   - `warn: true` surfaces a "stop and consult a professional" notice.
 *   - No ads or promos anywhere in this flow.
 */

export type RescueOption = {
  id: string;
  label: string;
  /** Brief, calm, actionable steps. */
  tip: string;
  /** Shows the professional-consultation warning. */
  warn: boolean;
};

export const RESCUE_OPTIONS: RescueOption[] = [
  {
    id: 'no-abre',
    label: 'Mi copa no abre',
    tip: 'Gira suavemente la base de la copa o desliza un dedo por el borde para romper el sello de vacío y permitir que se expanda.',
    warn: false,
  },
  {
    id: 'filtra',
    label: 'Tengo filtraciones',
    tip: 'Verifica que la copa esté completamente abierta y bien centrada. Si continúa, prueba un doblez distinto.',
    warn: false,
  },
  {
    id: 'no-retira',
    label: 'No puedo retirar la copa',
    tip: 'Relaja el piso pélvico, respira con calma y puja suavemente. Pellizca la base para liberar el sello antes de retirar — no jales solo del tallo.',
    warn: true,
  },
  {
    id: 'no-se',
    label: 'No sé si está bien puesta',
    tip: 'Pasa un dedo alrededor de la base: no deberías sentir pliegues ni la copa colapsada.',
    warn: false,
  },
  {
    id: 'manche',
    label: 'Me manché',
    tip: 'Puede pasar mientras aprendes, y no significa que lo estés haciendo mal. Considera usar una panty menstrual como respaldo los primeros ciclos.',
    warn: false,
  },
  {
    id: 'colicos',
    label: 'Tengo cólicos',
    tip: 'Una almohadilla térmica y una rutina de respiración pueden ayudarte a estar más cómoda.',
    warn: true,
  },
  {
    id: 'olvide-limpiar',
    label: 'Olvidé limpiar mi copa',
    tip: 'Lávala ahora con agua y jabón íntimo suave antes de tu próximo uso.',
    warn: false,
  },
  {
    id: 'no-se-cual',
    label: 'No sé si usar copa, disco o panty',
    tip: 'Depende de tu comodidad, tu flujo y tu día. Puedes escribirme y lo revisamos juntas — sin presión por comprar nada.',
    warn: false,
  },
  {
    id: 'dolor',
    label: 'Siento dolor o incomodidad',
    tip: 'Retira la copa con calma y no fuerces. El dolor no es parte normal del proceso.',
    warn: true,
  },
  {
    id: 'otro',
    label: 'Otro problema',
    tip: 'Cuéntamelo con tus palabras y lo vemos juntas.',
    warn: false,
  },
];

/** Shown when `warn` is true. Deliberately non-diagnostic (ficha §25.4). */
export const RESCUE_WARNING =
  'Si el dolor es intenso o persistente, pausa el uso y consulta a un profesional de salud.';
