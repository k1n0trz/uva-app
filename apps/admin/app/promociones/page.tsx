'use client';

import { useState } from 'react';
import { Badge, Button, Card, Field, PageHeader, RuleNotice, inputClass } from '@/components/ui';
import { MOCK_PROMOS, SEGMENTS, type Promo, type Segment } from '@/lib/mockData';

const emptyPromo = (): Promo => ({
  id: `pr${Date.now()}`,
  title: '',
  startDate: '',
  endDate: '',
  segment: 'Todas',
  url: '',
  active: false,
});

export default function PromocionesPage() {
  const [promos, setPromos] = useState<Promo[]>(MOCK_PROMOS);
  const [editing, setEditing] = useState<Promo | null>(null);

  const save = () => {
    if (!editing) return;
    setPromos((prev) => {
      const exists = prev.some((p) => p.id === editing.id);
      return exists ? prev.map((p) => (p.id === editing.id ? editing : p)) : [editing, ...prev];
    });
    setEditing(null);
  };

  const canSave = !!editing?.title.trim() && !!editing?.startDate && !!editing?.endDate;
  // A promo that ends before it starts would silently never run.
  const datesValid = !editing?.startDate || !editing?.endDate || editing.startDate <= editing.endDate;

  return (
    <>
      <PageHeader
        title="Promociones"
        subtitle="Crea y programa promociones segmentadas."
        action={<Button onClick={() => setEditing(emptyPromo())}>+ Nueva promoción</Button>}
      />

      <div className="mb-5">
        <RuleNotice>
          La segmentación usa datos declarados y de comportamiento, nunca síntomas ni contenido de conversaciones
          (ficha §17.4). Y una promoción nunca aparece dentro de Modo Rescate.
        </RuleNotice>
      </div>

      <div className="flex flex-col gap-2.5">
        {promos.map((promo) => (
          <Card key={promo.id} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-ink">{promo.title}</span>
                <Badge tone={promo.active ? 'success' : 'neutral'}>{promo.active ? 'Activa' : 'Inactiva'}</Badge>
              </div>
              <p className="mt-1 text-[12px] text-ink-secondary">
                {promo.startDate} → {promo.endDate} · {promo.segment}
              </p>
              {promo.url ? <p className="mt-0.5 truncate text-[11px] text-ink-faint">{promo.url}</p> : null}
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" onClick={() => setEditing(promo)}>
                Editar
              </Button>
              <Button
                variant={promo.active ? 'danger' : 'primary'}
                onClick={() =>
                  setPromos((prev) => prev.map((p) => (p.id === promo.id ? { ...p, active: !p.active } : p)))
                }
              >
                {promo.active ? 'Desactivar' : 'Activar'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {editing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Editar promoción"
        >
          <div className="w-full max-w-[520px] rounded-3xl bg-white p-6">
            <h2 className="mb-4 text-[18px] font-extrabold text-ink">
              {promos.some((p) => p.id === editing.id) ? 'Editar promoción' : 'Nueva promoción'}
            </h2>

            <div className="flex flex-col gap-3">
              <Field label="Título">
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className={inputClass}
                  autoFocus
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Inicio">
                  <input
                    type="date"
                    value={editing.startDate}
                    onChange={(e) => setEditing({ ...editing, startDate: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Fin">
                  <input
                    type="date"
                    value={editing.endDate}
                    onChange={(e) => setEditing({ ...editing, endDate: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>

              {!datesValid ? (
                <p className="text-[12px] font-semibold text-danger">
                  La fecha de fin es anterior a la de inicio: la promoción nunca se mostraría.
                </p>
              ) : null}

              <Field label="Segmento" hint="Basado en lo que la usuaria declaró y en su actividad, no en sus síntomas.">
                <select
                  value={editing.segment}
                  onChange={(e) => setEditing({ ...editing, segment: e.target.value as Segment })}
                  className={inputClass}
                >
                  {SEGMENTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="URL" hint="Interna (una ruta de la app) o externa (la tienda).">
                <input
                  value={editing.url}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  placeholder="https://copauva.com/…"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button disabled={!canSave || !datesValid} onClick={save}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
