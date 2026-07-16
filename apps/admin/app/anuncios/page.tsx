'use client';

import { useState } from 'react';
import { Badge, Button, Card, Field, PageHeader, RuleNotice, inputClass } from '@/components/ui';
import { MOCK_ADS, SEGMENTS, type Ad, type Segment } from '@/lib/mockData';

const emptyAd = (): Ad => ({
  id: `ad${Date.now()}`,
  title: '',
  body: '',
  imageUrl: '',
  startDate: '',
  endDate: '',
  segment: 'Todas',
  priority: 1,
  url: '',
  active: false,
});

/** Renders the ad the way the app actually shows it, so nobody has to imagine it. */
function AdPreview({ ad }: { ad: Ad }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-content p-4">
      <p className="mb-2 text-[11px] font-semibold uppercase text-ink-secondary">Vista previa en la app</p>
      <div className="mx-auto w-[300px] rounded-2xl border border-dashed border-border bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-[9px] font-bold text-primary-dark">
            PROMO
          </span>
          <p className="flex-1 text-[13px] font-medium text-ink">{ad.title || 'Título del anuncio'}</p>
          <span className="shrink-0 text-[12px] font-bold text-primary-dark">Ver</span>
        </div>
        {ad.body ? <p className="mt-2 text-[12px] leading-4 text-ink-secondary">{ad.body}</p> : null}
        {ad.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary editor-supplied URL, not a known domain
          <img
            src={ad.imageUrl}
            alt=""
            className="mt-2.5 h-[110px] w-full rounded-xl object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
      </div>
      <p className="mt-3 text-center text-[10px] leading-4 text-ink-faint">
        Siempre etiquetado como promoción. Nunca se muestra en Modo Rescate ni durante una conversación sensible.
      </p>
    </div>
  );
}

export default function AnunciosPage() {
  const [ads, setAds] = useState<Ad[]>(MOCK_ADS);
  const [editing, setEditing] = useState<Ad | null>(null);

  const save = () => {
    if (!editing) return;
    setAds((prev) => {
      const exists = prev.some((a) => a.id === editing.id);
      return exists ? prev.map((a) => (a.id === editing.id ? editing : a)) : [editing, ...prev];
    });
    setEditing(null);
  };

  const canSave = !!editing?.title.trim() && !!editing?.startDate && !!editing?.endDate;
  const datesValid = !editing?.startDate || !editing?.endDate || editing.startDate <= editing.endDate;

  return (
    <>
      <PageHeader
        title="Anuncios"
        subtitle="Contenido promocional dentro de la app."
        action={<Button onClick={() => setEditing(emptyAd())}>+ Nuevo anuncio</Button>}
      />

      <div className="mb-5">
        <RuleNotice>
          <strong className="font-bold">Los anuncios nunca interrumpen.</strong> No aparecen en Modo Rescate ni
          durante conversaciones sensibles, y siempre van etiquetados como promoción (ficha §17.5). Esa regla la
          aplica la app: no se puede desactivar desde aquí.
        </RuleNotice>
      </div>

      <div className="flex flex-col gap-2.5">
        {ads.map((ad) => (
          <Card key={ad.id} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-ink">{ad.title}</span>
                <Badge tone={ad.active ? 'success' : 'neutral'}>{ad.active ? 'Activo' : 'Inactivo'}</Badge>
                <Badge tone="primary">Prioridad {ad.priority}</Badge>
              </div>
              <p className="mt-1 text-[12px] text-ink-secondary">
                {ad.startDate} → {ad.endDate} · {ad.segment}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" onClick={() => setEditing(ad)}>
                Editar
              </Button>
              <Button
                variant={ad.active ? 'danger' : 'primary'}
                onClick={() => setAds((prev) => prev.map((a) => (a.id === ad.id ? { ...a, active: !a.active } : a)))}
              >
                {ad.active ? 'Desactivar' : 'Activar'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {editing ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-ink/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Editar anuncio"
        >
          <div className="my-auto w-full max-w-[760px] rounded-3xl bg-white p-6">
            <h2 className="mb-4 text-[18px] font-extrabold text-ink">
              {ads.some((a) => a.id === editing.id) ? 'Editar anuncio' : 'Nuevo anuncio'}
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <Field label="Título">
                  <input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className={inputClass}
                    autoFocus
                  />
                </Field>
                <Field label="Descripción">
                  <textarea
                    value={editing.body}
                    onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                    rows={3}
                    className={`${inputClass} py-2`}
                  />
                </Field>
                <Field label="Imagen (URL)">
                  <input
                    value={editing.imageUrl}
                    onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                    placeholder="https://copauva.com/…"
                    className={inputClass}
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
                    La fecha de fin es anterior a la de inicio: el anuncio nunca se mostraría.
                  </p>
                ) : null}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Segmento">
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
                  <Field label="Prioridad" hint="Si varios anuncios aplican, gana el mayor.">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={editing.priority}
                      onChange={(e) => setEditing({ ...editing, priority: Number(e.target.value) || 1 })}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <Field label="URL">
                  <input
                    value={editing.url}
                    onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>

              <AdPreview ad={editing} />
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
