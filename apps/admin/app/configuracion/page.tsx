import { Card, PageHeader, RuleNotice } from '@/components/ui';

/**
 * Configuración.
 *
 * Deliberately mostly empty: everything real here (roles, integrations,
 * auditoría) depends on the backend, and a panel full of switches that don't do
 * anything is worse than an honest gap. This page states what has to exist and
 * who owns it.
 */
const PENDING = [
  {
    title: 'Roles y permisos',
    owner: 'Codex (backend)',
    detail:
      'Superadministrador, Contenido, Comercial, Soporte, Analítica y Clínico/editor experto (ficha §22.1). Con acceso mínimo por rol: Soporte y Comercial nunca ven datos de salud.',
  },
  {
    title: 'Auditoría',
    owner: 'Codex (backend)',
    detail: 'Quién cambió qué y cuándo. Todo acceso a datos sensibles queda registrado (ficha §22.2 / §25.2).',
  },
  {
    title: 'Integración con WooCommerce',
    owner: 'Codex (backend)',
    detail:
      'Sync de catálogo, precios y stock. Las credenciales viven solo en el servidor — nunca en la app ni en este panel.',
  },
  {
    title: 'Proveedores de IA y voz',
    owner: 'UVA decide · Codex conecta',
    detail: 'LLM, STT y TTS detrás de una capa reemplazable. El proveedor de voz sigue sin definir (ficha §11.3).',
  },
  {
    title: 'Onboarding y contenidos editables',
    owner: 'Codex (backend)',
    detail: 'Preguntas, opciones y lógica condicional editables sin publicar una nueva versión de la app.',
  },
];

export default function ConfiguracionPage() {
  return (
    <>
      <PageHeader title="Configuración" subtitle="Lo que falta y de quién depende." />

      <div className="mb-5">
        <RuleNotice>
          Este panel funciona con datos simulados. Nada de lo que hagas aquí toca un sistema real todavía — lo de
          abajo es lo que hace falta para que sí.
        </RuleNotice>
      </div>

      <div className="flex flex-col gap-2.5">
        {PENDING.map((item) => (
          <Card key={item.title}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[14px] font-bold text-ink">{item.title}</h2>
                <p className="mt-1 text-[12px] leading-5 text-ink-secondary">{item.detail}</p>
              </div>
              <span className="shrink-0 rounded-full bg-border px-2.5 py-1 text-[11px] font-semibold text-ink-secondary">
                {item.owner}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
