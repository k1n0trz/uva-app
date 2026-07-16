import { findProduct } from '../constants/products';
import type { Memory } from '../constants/memory';
import { useCheckinStore } from '../stores/checkinStore';
import { useMemoryStore } from '../stores/memoryStore';
import { useMyProductsStore } from '../stores/myProductsStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useRoutinesStore } from '../stores/routinesStore';

/**
 * Builds the memory list from what the app ACTUALLY holds.
 *
 * Two principles:
 *
 * 1. Derived, not duplicated. If she corrects "tu ciclo dura 5 días", she's
 *    correcting the fact the app really uses — not a copy that drifts.
 *
 * 2. Nothing is invented. An inference only appears when the data supports it
 *    (ficha §18.4: "No debe fingir personalización profunda"). With an empty
 *    app this list is short, and that's the honest answer.
 */
export function useMemories(): Memory[] {
  const answers = useOnboardingStore((s) => s.answers);
  const ownedIds = useMyProductsStore((s) => s.ownedIds)();
  const checkins = useCheckinStore((s) => s.byDate);
  const sessions = useRoutinesStore((s) => s.sessions);
  const intake = useRoutinesStore((s) => s.intake);
  const { deletedIds, overrides } = useMemoryStore();

  const facts: Memory[] = [];

  // ---- Declared: she told us directly ----
  if (answers.name.trim()) {
    facts.push({
      id: 'name',
      source: 'declarado',
      text: `Quieres que te llame ${answers.name.trim()}.`,
      why: 'Para hablarte por tu nombre.',
      editable: true,
    });
  }
  if (answers.focus) {
    facts.push({
      id: 'focus',
      source: 'declarado',
      text: `Quieres trabajar primero: ${answers.focus.toLowerCase()}.`,
      why: 'Para decidir qué te propongo en Hoy.',
      editable: true,
    });
  }
  if (answers.status) {
    facts.push({
      id: 'status',
      source: 'declarado',
      text: `Tu situación menstrual: ${answers.status.toLowerCase()}.`,
      why: 'Define si estimo tu periodo y cómo adapto la app.',
      editable: true,
    });
  }
  if (answers.duration) {
    facts.push({
      id: 'duration',
      source: 'declarado',
      text: `Tu menstruación suele durar ${answers.duration.toLowerCase()}.`,
      why: 'Entra en la estimación de tu próximo periodo.',
      editable: true,
    });
  }
  if (answers.abrilStyle) {
    facts.push({
      id: 'abrilStyle',
      source: 'declarado',
      text: `Prefieres que te responda de forma ${answers.abrilStyle.toLowerCase()}.`,
      why: 'Ajusta el largo y el tono de mis respuestas.',
      editable: true,
    });
  }
  if (answers.reminders) {
    facts.push({
      id: 'reminders',
      source: 'declarado',
      text: `Tus recordatorios deben ser: ${answers.reminders.toLowerCase()}.`,
      why: 'Define cuánto detalle muestro en las notificaciones.',
      editable: true,
    });
  }
  if (answers.routineTime) {
    facts.push({
      id: 'routineTime',
      source: 'declarado',
      text: `Prefieres tus rutinas en la ${answers.routineTime.toLowerCase()}.`,
      why: 'Para proponerte rutinas a una hora que te sirva.',
      editable: true,
    });
  }

  const ownedNames = ownedIds.map((id) => findProduct(id)?.name).filter(Boolean) as string[];
  if (ownedNames.length > 0) {
    facts.push({
      id: 'products',
      source: 'declarado',
      text: `Tienes: ${ownedNames.join(', ')}.`,
      why: 'Para mostrarte las guías y rutinas de lo que realmente tienes.',
      editable: false,
    });
  }

  if (intake.pain || intake.relax || intake.pregnancy) {
    facts.push({
      id: 'kegel-intake',
      source: 'declarado',
      text: 'Respondiste la evaluación de piso pélvico.',
      why: 'Define qué rutinas es seguro proponerte. Sin esto no habilito las que usan peso.',
      editable: false,
    });
  }

  // ---- Inferred: only when the data actually supports it ----
  const entries = Object.values(checkins);

  if (entries.length >= 2) {
    const counts: Record<string, number> = {};
    for (const c of entries) for (const s of c.symptoms) counts[s] = (counts[s] ?? 0) + 1;
    const [top, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] ?? [];
    if (top && top !== 'Sin síntomas' && n >= 2) {
      facts.push({
        id: 'top-symptom',
        source: 'inferido',
        text: `Sueles registrar ${top.toLowerCase()} (${n} de ${entries.length} registros).`,
        why: 'Lo uso para anticiparte lo que puede venir. Si me equivoqué, bórralo.',
        editable: false,
      });
    }

    const products = entries.map((c) => c.product).filter((p): p is NonNullable<typeof p> => !!p && p !== 'Ninguno');
    if (products.length >= 2) {
      const pc: Record<string, number> = {};
      for (const p of products) pc[p] = (pc[p] ?? 0) + 1;
      const [topProduct] = Object.entries(pc).sort((a, b) => b[1] - a[1])[0] ?? [];
      if (topProduct) {
        facts.push({
          id: 'top-product',
          source: 'inferido',
          text: `Sueles usar ${topProduct.toLowerCase()} durante tu periodo.`,
          why: 'Lo uso para recordarte tenerlo a mano. Si me equivoqué, bórralo.',
          editable: false,
        });
      }
    }
  }

  if (sessions.length >= 2) {
    const rc: Record<string, number> = {};
    for (const s of sessions) rc[s.routineName] = (rc[s.routineName] ?? 0) + 1;
    const [topRoutine, n] = Object.entries(rc).sort((a, b) => b[1] - a[1])[0] ?? [];
    if (topRoutine && n >= 2) {
      facts.push({
        id: 'top-routine',
        source: 'inferido',
        text: `La rutina que más completas es "${topRoutine}".`,
        why: 'Por eso te la propongo primero. Si prefieres otra, bórralo.',
        editable: false,
      });
    }
  }

  return facts
    .filter((f) => !deletedIds.includes(f.id))
    .map((f) => (overrides[f.id] ? { ...f, text: overrides[f.id] } : f));
}
