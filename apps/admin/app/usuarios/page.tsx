'use client';

import { useMemo, useState } from 'react';
import { Badge, Button, Card, PageHeader, RuleNotice, inputClass } from '@/components/ui';
import { MOCK_USERS, type AdminUser, type AdminUserStatus } from '@/lib/mockData';

const STATUS_TONE = {
  Activa: 'success',
  Temporal: 'warning',
  Desactivada: 'danger',
} as const;

const FILTERS: ('Todas' | AdminUserStatus)[] = ['Todas', 'Activa', 'Temporal', 'Desactivada'];

export default function UsuariosPage() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Todas');
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [confirmText, setConfirmText] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesFilter = filter === 'Todas' || u.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [users, query, filter]);

  const toggleStatus = (id: string) =>
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Desactivada' ? 'Activa' : 'Desactivada' } : u
      )
    );

  const confirmDelete = () => {
    if (!deleting) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleting.id));
    setDeleting(null);
    setConfirmText('');
  };

  return (
    <>
      <PageHeader title="Usuarios" subtitle="Busca, filtra y administra cuentas." />

      {/* The single most important rule in this panel (ficha §22.3). Stating it
          where the team works is how it survives contact with "¿y no podemos
          ver qué síntomas reportó?". */}
      <div className="mb-5">
        <RuleNotice>
          <strong className="font-bold">Aquí no verás datos de salud.</strong> Ni ciclo, ni síntomas, ni
          conversaciones con Abril. Esta pantalla solo muestra datos administrativos. Los datos sensibles requieren
          acceso mínimo, justificado y auditado — no un listado abierto para todo el equipo.
        </RuleNotice>
      </div>

      <Card className="mb-4">
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o correo"
            aria-label="Buscar usuaria"
            className={inputClass}
          />
          <div className="flex shrink-0 gap-1.5" role="group" aria-label="Filtrar por estado">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={[
                  'min-h-[38px] cursor-pointer rounded-full border px-3 text-[12px] font-semibold transition-colors',
                  filter === f ? 'border-primary bg-primary text-white' : 'border-border bg-white text-ink',
                ].join(' ')}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase text-ink-secondary">
              <th className="border-b border-border pb-2">Usuaria</th>
              <th className="border-b border-border pb-2">Estado</th>
              <th className="border-b border-border pb-2">Productos</th>
              <th className="border-b border-border pb-2">Registro</th>
              <th className="border-b border-border pb-2">Última actividad</th>
              <th className="border-b border-border pb-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="border-b border-border py-3">
                  <div className="text-[13px] font-semibold text-ink">{u.name}</div>
                  <div className="text-[11px] text-ink-secondary">{u.email}</div>
                </td>
                <td className="border-b border-border py-3">
                  <Badge tone={STATUS_TONE[u.status]}>{u.status}</Badge>
                </td>
                {/* A count, not the list — which products she owns is hers. */}
                <td className="border-b border-border py-3 text-[13px] text-ink">{u.productCount}</td>
                <td className="border-b border-border py-3 text-[12px] text-ink-secondary">{u.signedUpAt}</td>
                <td className="border-b border-border py-3 text-[12px] text-ink-secondary">{u.lastSeenAt}</td>
                <td className="border-b border-border py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => toggleStatus(u.id)}>
                      {u.status === 'Desactivada' ? 'Reactivar' : 'Desactivar'}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setDeleting(u);
                        setConfirmText('');
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-[13px] text-ink-secondary">
            Ninguna usuaria coincide con esa búsqueda.
          </p>
        ) : null}
      </Card>

      {/* Deleting a person's account is irreversible — make it deliberate */}
      {deleting ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar eliminación"
        >
          <div className="w-full max-w-[440px] rounded-3xl bg-white p-6">
            <h2 className="text-[18px] font-extrabold text-ink">Eliminar la cuenta de {deleting.name}</h2>
            <p className="mt-2 text-[13px] leading-5 text-ink-secondary">
              Se inicia el proceso de eliminación de todos sus datos. No se puede deshacer. Queda registrado en
              auditoría quién lo hizo y cuándo.
            </p>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-[12px] font-semibold text-ink">
                Escribe ELIMINAR para confirmar:
              </span>
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className={inputClass}
                aria-label="Escribe ELIMINAR para confirmar"
                autoFocus
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleting(null)}>
                Cancelar
              </Button>
              <Button variant="danger" disabled={confirmText.trim().toUpperCase() !== 'ELIMINAR'} onClick={confirmDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
