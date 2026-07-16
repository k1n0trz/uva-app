/**
 * Mock data for the admin panel.
 *
 * ⚠️ Every number here is invented. The brief (§25) is explicit: "No implementes
 * lógica backend real". These exist so the team can see and shape the modules;
 * Codex replaces them with real queries.
 *
 * Note what is deliberately ABSENT from the user records: no cycle data, no
 * symptoms, no conversations. See ficha §22.3 — the panel must not expose
 * intimate data to commercial or support teams. Adding those fields here would
 * be the first step toward a real leak.
 */

export type AdminUserStatus = 'Activa' | 'Temporal' | 'Desactivada';

export type AdminUser = {
  id: string;
  /** Administrative display name, not necessarily her preferred name in-app. */
  name: string;
  email: string;
  status: AdminUserStatus;
  /** A count, never the list — which products she owns is personal. */
  productCount: number;
  signedUpAt: string;
  lastSeenAt: string;
};

export const MOCK_USERS: AdminUser[] = [
  { id: 'u1', name: 'Laura M.', email: 'laura@example.com', status: 'Activa', productCount: 3, signedUpAt: '2026-03-14', lastSeenAt: 'hace 2 h' },
  { id: 'u2', name: 'Camila R.', email: 'camila@example.com', status: 'Activa', productCount: 0, signedUpAt: '2026-05-02', lastSeenAt: 'ayer' },
  { id: 'u3', name: 'Invitada', email: '—', status: 'Temporal', productCount: 1, signedUpAt: '2026-07-15', lastSeenAt: 'hace 20 min' },
  { id: 'u4', name: 'Valentina G.', email: 'valentina@example.com', status: 'Desactivada', productCount: 2, signedUpAt: '2026-01-08', lastSeenAt: 'hace 3 meses' },
  { id: 'u5', name: 'Daniela P.', email: 'daniela@example.com', status: 'Activa', productCount: 5, signedUpAt: '2026-02-19', lastSeenAt: 'hace 5 h' },
  { id: 'u6', name: 'Sofía T.', email: 'sofia@example.com', status: 'Activa', productCount: 1, signedUpAt: '2026-06-30', lastSeenAt: 'hace 1 d' },
];

export type Segment = 'Todas' | 'Con piso pélvico activo' | 'Primeras usuarias de copa' | 'Sin productos UVA';

export const SEGMENTS: Segment[] = ['Todas', 'Con piso pélvico activo', 'Primeras usuarias de copa', 'Sin productos UVA'];

export type Promo = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  segment: Segment;
  url: string;
  active: boolean;
};

export const MOCK_PROMOS: Promo[] = [
  { id: 'pr1', title: '20% en Kits Cuídate', startDate: '2026-07-01', endDate: '2026-07-31', segment: 'Todas', url: 'https://copauva.com/kits', active: true },
  { id: 'pr2', title: 'Envío gratis en Bolas Kegel', startDate: '2026-07-15', endDate: '2026-07-20', segment: 'Con piso pélvico activo', url: 'https://copauva.com/bolas-kegel-uva', active: true },
  { id: 'pr3', title: 'Lanzamiento Panties v2', startDate: '2026-08-01', endDate: '2026-08-15', segment: 'Todas', url: 'https://copauva.com/panties-menstruales', active: false },
];

export type Ad = {
  id: string;
  title: string;
  body: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  segment: Segment;
  /** Higher wins when several ads are eligible at once. */
  priority: number;
  url: string;
  active: boolean;
};

export const MOCK_ADS: Ad[] = [
  {
    id: 'ad1',
    title: 'Tu kit, completo',
    body: 'El Kit Cuídate trae copa, vaso esterilizador y limpiador.',
    imageUrl: 'https://copauva.com/wp-content/uploads/2024/05/KIT-CUIDATE-1.jpg',
    startDate: '2026-07-01',
    endDate: '2026-07-31',
    segment: 'Primeras usuarias de copa',
    priority: 2,
    url: 'https://copauva.com/kit-cuidate-uva-a',
    active: true,
  },
  {
    id: 'ad2',
    title: 'Conoce el disco menstrual',
    body: 'Una alternativa de baja fricción para uso prolongado.',
    imageUrl: 'https://copauva.com/wp-content/uploads/2023/01/DISCO-1.jpg',
    startDate: '2026-07-10',
    endDate: '2026-08-10',
    segment: 'Todas',
    priority: 1,
    url: 'https://copauva.com/disco-menstrual',
    active: false,
  },
];

export type AdminRoutine = {
  id: string;
  name: string;
  durationMin: number;
  /** Weighted Kegel levels are gated by rules, not by this flag. */
  requiresKegel: boolean;
  steps: string[];
  published: boolean;
};

export const MOCK_ROUTINES: AdminRoutine[] = [
  { id: 'r1', name: 'Conciencia corporal', durationMin: 4, requiresKegel: false, steps: ['Escanea tu cuerpo', 'Reconoce la zona', 'Respira'], published: true },
  { id: 'r2', name: 'Respiración y relajación', durationMin: 3, requiresKegel: false, steps: ['Inhala 4', 'Sostén 7', 'Exhala 8'], published: true },
  { id: 'r3', name: 'Coordinación', durationMin: 5, requiresKegel: false, steps: ['Contrae', 'Suelta', 'Repite con ritmo'], published: true },
  { id: 'r4', name: 'Fortalecimiento inicial', durationMin: 6, requiresKegel: false, steps: ['Serie base', 'Descanso', 'Serie base'], published: true },
  { id: 'r5', name: 'Resistencia', durationMin: 8, requiresKegel: false, steps: ['Mantén', 'Descansa', 'Repite'], published: true },
  { id: 'kegel1', name: 'Nivel 1 · Iniciación', durationMin: 5, requiresKegel: true, steps: ['Reconocimiento', 'Control básico'], published: true },
  { id: 'kegel2', name: 'Nivel 2 · Progresión', durationMin: 7, requiresKegel: true, steps: ['Series con resistencia'], published: true },
  { id: 'kegel3', name: 'Nivel 3 · Mantenimiento', durationMin: 9, requiresKegel: true, steps: ['Rutina de mantenimiento'], published: false },
];

export const MOCK_STATS = [
  { label: 'Usuarias activas', value: '1.284', trend: '+4,2% este mes', up: true },
  { label: 'Onboardings completados', value: '812', trend: '+2,8%', up: true },
  { label: 'Conversaciones con Abril', value: '6.940', trend: '+18%', up: true },
  { label: 'Pedidos referidos', value: '231', trend: '-1,1%', up: false },
];

export const MOCK_ACTIVITY = [
  { text: 'Promoción "20% en Kits Cuídate" activada', time: 'hace 2 h' },
  { text: 'Camila R. completó Modo Primera Copa', time: 'hace 5 h' },
  { text: 'Producto "Jabón Íntimo UVA Fresh" quedó agotado en WooCommerce', time: 'hace 1 d' },
  { text: '42 usuarias completaron el onboarding', time: 'hace 1 d' },
];
