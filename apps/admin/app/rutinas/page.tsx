'use client';

import { useState } from 'react';
import { Badge, Button, Card, Field, PageHeader, RuleNotice, inputClass } from '@/components/ui';
import { MOCK_ROUTINES, type AdminRoutine } from '@/lib/mockData';

export default function RutinasPage() {
  const [routines, setRoutines] = useState<AdminRoutine[]>(MOCK_ROUTINES);
  const [editing, setEditing] = useState<AdminRoutine | null>(null);

  const save = () => {
    if (!editing) return;
    setRoutines((prev) => prev.map((r) => (r.id === editing.id ? editing : r)));
    setEditing(null);
  };

  const move = (index: number, dir: -1 | 1) => {
    if (!editing) return;
    const steps = [...editing.steps];
    const target = index + dir;
    if (target < 0 || target >= steps.length) return;
    [steps[index], steps[target]] = [steps[target], steps[index]];
    setEditing({ ...editing, steps });
  };

  const general = routines.filter((r) => !r.requiresKegel);
  const kegel = routines.filter((r) => r.requiresKegel);

  return (
    <>
      <PageHeader title="Rutinas" subtitle="Contenido, pasos y publicación." />

      <div className="mb-5">
        <RuleNotice>
          <strong className="font-bold">La elegibilidad no se edita aquí.</strong> Quién puede hacer las rutinas con
          peso lo deciden las reglas de seguridad (evaluación inicial, señales de exclusión y autoevaluación), no una
          casilla del panel. Publicar un nivel no se lo abre a nadie que no cumpla los criterios — ficha §15.4: &quot;No
          se desbloquea por compra; se desbloquea por criterios funcionales&quot;.
        </RuleNotice>
      </div>

      <div className="mb-4">
        <RuleNotice>
          ⚠️ El contenido de piso pélvico y Bolas Kegel está <strong className="font-bold">pendiente de validación
          por un profesional</strong> antes de producción (ficha §33). Lo que hay hoy son textos provisionales.
        </RuleNotice>
      </div>

      <h2 className="mb-2 mt-6 text-[14px] font-bold text-ink">Rutinas generales</h2>
      <p className="mb-2.5 text-[12px] text-ink-secondary">Disponibles para todas las usuarias, con o sin productos.</p>
      <div className="mb-6 flex flex-col gap-2.5">
        {general.map((r) => (
          <RoutineRow key={r.id} routine={r} onEdit={() => setEditing(r)} onTogglePublish={() =>
            setRoutines((prev) => prev.map((x) => (x.id === r.id ? { ...x, published: !x.published } : x)))
          } />
        ))}
      </div>

      <h2 className="mb-2 text-[14px] font-bold text-ink">Rutinas con Bolas Kegel UVA</h2>
      <p className="mb-2.5 text-[12px] text-ink-secondary">
        Solo llegan a usuarias que pasan la evaluación y avanzan por autoevaluación.
      </p>
      <div className="flex flex-col gap-2.5">
        {kegel.map((r) => (
          <RoutineRow key={r.id} routine={r} onEdit={() => setEditing(r)} onTogglePublish={() =>
            setRoutines((prev) => prev.map((x) => (x.id === r.id ? { ...x, published: !x.published } : x)))
          } />
        ))}
      </div>

      {editing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Editar rutina"
        >
          <div className="w-full max-w-[520px] rounded-3xl bg-white p-6">
            <h2 className="mb-4 text-[18px] font-extrabold text-ink">Editar rutina</h2>

            <div className="flex flex-col gap-3">
              <Field label="Nombre">
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label="Duración sugerida (minutos)" hint="Es una sugerencia: la usuaria puede terminar cuando quiera.">
                <input
                  type="number"
                  min={1}
                  value={editing.durationMin}
                  onChange={(e) => setEditing({ ...editing, durationMin: Number(e.target.value) || 1 })}
                  className={inputClass}
                />
              </Field>

              <div>
                <span className="mb-1.5 block text-[12px] font-semibold text-ink-secondary">Pasos</span>
                <div className="flex flex-col gap-2">
                  {editing.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={step}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            steps: editing.steps.map((s, si) => (si === i ? e.target.value : s)),
                          })
                        }
                        className={inputClass}
                      />
                      <button
                        type="button"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label={`Subir paso ${i + 1}`}
                        className="min-h-[38px] cursor-pointer rounded-lg border border-border px-2 text-[12px] disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(i, 1)}
                        disabled={i === editing.steps.length - 1}
                        aria-label={`Bajar paso ${i + 1}`}
                        className="min-h-[38px] cursor-pointer rounded-lg border border-border px-2 text-[12px] disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, steps: editing.steps.filter((_, si) => si !== i) })}
                        aria-label={`Eliminar paso ${i + 1}`}
                        className="min-h-[38px] cursor-pointer rounded-lg border border-danger-border px-2 text-[12px] text-danger"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <Button variant="outline" onClick={() => setEditing({ ...editing, steps: [...editing.steps, ''] })}>
                    + Agregar paso
                  </Button>
                </div>
              </div>

              <Field
                label="Clips de Abril"
                hint="Se asocian cuando existan los clips 3D pre-renderizados (Fase 9)."
              >
                <input disabled placeholder="Aún no hay clips disponibles" className={`${inputClass} opacity-60`} />
              </Field>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button disabled={!editing.name.trim()} onClick={save}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function RoutineRow({
  routine,
  onEdit,
  onTogglePublish,
}: {
  routine: AdminRoutine;
  onEdit: () => void;
  onTogglePublish: () => void;
}) {
  return (
    <Card className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold text-ink">{routine.name}</span>
          <Badge tone={routine.published ? 'success' : 'neutral'}>{routine.published ? 'Publicada' : 'Borrador'}</Badge>
          {routine.requiresKegel ? <Badge tone="primary">Requiere evaluación</Badge> : null}
        </div>
        <p className="mt-1 text-[12px] text-ink-secondary">
          {routine.durationMin} min · {routine.steps.length} paso{routine.steps.length === 1 ? '' : 's'}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="outline" onClick={onEdit}>
          Editar
        </Button>
        <Button variant={routine.published ? 'danger' : 'primary'} onClick={onTogglePublish}>
          {routine.published ? 'Despublicar' : 'Publicar'}
        </Button>
      </div>
    </Card>
  );
}
