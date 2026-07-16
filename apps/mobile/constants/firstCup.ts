/**
 * Modo Primera Copa — guided stages.
 *
 * ⚠️ CONTENIDO PENDIENTE DE VALIDACIÓN CLÍNICA (same as rescue.ts).
 *
 * Stages follow the design-handoff prototype (CUP_STAGES, 14 stages) which is a
 * more granular expansion of the 9 stages in ficha técnica §13.2. The prototype
 * is the visual/flow source of truth, so we keep its 14.
 *
 * ficha §13.3: guidance must not extrapolate one cup model's instructions to
 * another without UVA validating them. When the user hasn't declared her model,
 * show general guidance and ask her to check the packaging.
 */

export type CupStage = {
  name: string;
  text: string;
};

export const CUP_STAGES: CupStage[] = [
  { name: 'Antes de comenzar', text: 'Respira, ve con calma y recuerda que puedes repetir cualquier paso las veces que necesites.' },
  { name: 'Conocer la copa', text: 'Observa su forma, el tallo y los agujeros de ventilación antes de usarla.' },
  { name: 'Preparación y limpieza', text: 'Lava tus manos y esteriliza la copa antes del primer uso.' },
  { name: 'Selección de doblez', text: 'Prueba el doblez en U o en C. Quédate con el que te resulte más cómodo — no hay uno correcto.' },
  { name: 'Posición corporal', text: 'De pie con una pierna elevada, sentada o en cuclillas. Elige la que te dé más espacio y menos tensión.' },
  { name: 'Inserción', text: 'Inserta con calma, en ángulo hacia la parte baja de la espalda. Si sientes resistencia, no fuerces.' },
  { name: 'Comprobación de apertura', text: 'Gira suavemente la base o pasa un dedo alrededor para confirmar que se abrió por completo.' },
  { name: 'Uso y tiempo', text: 'Según tu flujo, puede usarse varias horas. Revisa las indicaciones de tu producto.' },
  { name: 'Retiro', text: 'Relaja, pellizca la base para liberar el sello y retira con calma. No jales únicamente del tallo.' },
  { name: 'Limpieza', text: 'Enjuaga con agua y jabón íntimo suave entre usos.' },
  { name: 'Almacenamiento', text: 'Guárdala seca y limpia en su bolsa transpirable.' },
  { name: 'Evaluación de la experiencia', text: 'Registra cómo te sentiste. Eso me ayuda a ajustar lo que te propongo la próxima vez.' },
  { name: 'Problemas frecuentes', text: 'Las filtraciones o la dificultad al retirar son comunes al inicio y suelen mejorar con la práctica.' },
  { name: 'Preparación para el siguiente ciclo', text: 'Ya tienes práctica. El siguiente ciclo suele sentirse bastante más fácil.' },
];
