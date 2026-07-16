/**
 * Generates `constants/catalog.generated.ts` from the real WooCommerce catalog.
 *
 * WHY THIS EXISTS
 * The app must never hold WooCommerce credentials — anything shipped in an Expo
 * bundle is readable by anyone with the APK, and these keys can write to the
 * store (ficha §17.1/§24.1). So instead of calling Woo at runtime from the app,
 * we call it HERE, at development time, and commit the resulting data as static
 * TypeScript. Credentials never touch the repo or the bundle.
 *
 * This is a stopgap. Once Codex's backend exists, the app should fetch the
 * catalog from it so prices and stock stay live — this file's output is a
 * snapshot and WILL go stale.
 *
 * USAGE (credentials come from the environment, never from a committed file):
 *   WOO_BASE_URL=https://... WOO_KEY=ck_... WOO_SECRET=cs_... \
 *     node scripts/fetch-catalog.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.WOO_BASE_URL;
const KEY = process.env.WOO_KEY;
const SECRET = process.env.WOO_SECRET;

if (!BASE || !KEY || !SECRET) {
  console.error('Faltan WOO_BASE_URL, WOO_KEY o WOO_SECRET en el entorno.');
  process.exit(1);
}

const auth = Buffer.from(`${KEY}:${SECRET}`).toString('base64');

/**
 * Woo category slug -> our shop sections (brief §17).
 *
 * ADDITIVE on purpose: a product belongs to every section that applies, exactly
 * like it does in the store. A menstrual cup is both "Menstruación" and "Copas
 * y discos" — forcing a single section made "Menstruación" nearly empty.
 */
const CATEGORY_MAP = {
  'copa-menstrual-uva': ['copas', 'menstruacion'],
  'kit-copa-menstrual': ['kits', 'menstruacion'],
  kits: ['kits'],
  menstruacion: ['menstruacion'],
  'panty-menstrual': ['menstruacion'],
  'almohadilla-termica': ['menstruacion'],
  esterilizadores: ['complementos'],
  'limpiador-para-copa-menstrual': ['complementos'],
  'toallita-compacta': ['complementos'],
  complementos: ['complementos'],
  'cuidado-intimo': ['intimo'],
  'jabon-intimo-femenino': ['intimo'],
  'lubricante-para-copa-menstrual': ['intimo'],
  'tienda-sexual': ['pelvico'],
  cubrepezones: ['belleza'],
  belleza: ['belleza'],
  mom: ['maternidad'],
};

/** Products the store's taxonomy doesn't place where the app needs them. */
const SLUG_OVERRIDES = {
  'bolas-kegel': ['pelvico'],
  'bolas-chinas': ['pelvico'],
  'dilatadores-vaginales': ['pelvico'],
};

function sectionsFor(product) {
  const sections = new Set();
  for (const [needle, extra] of Object.entries(SLUG_OVERRIDES)) {
    if (product.slug.includes(needle)) extra.forEach((s) => sections.add(s));
  }
  for (const c of product.categories ?? []) {
    (CATEGORY_MAP[c.slug] ?? []).forEach((s) => sections.add(s));
  }
  if (sections.size === 0) sections.add('complementos');
  return [...sections];
}

/** Woo ships HTML in descriptions; the app renders plain text. */
function stripHtml(html) {
  return (html ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&#039;|&#8216;/g, "'")
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toInt(value) {
  const n = Number.parseInt(String(value ?? '').replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

async function fetchAll() {
  const out = [];
  for (let page = 1; page <= 20; page++) {
    const url = new URL('/wp-json/wc/v3/products', BASE);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    url.searchParams.set('status', 'publish');
    const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
    if (!res.ok) throw new Error(`HTTP ${res.status} en la página ${page}`);
    const batch = await res.json();
    out.push(...batch);
    const totalPages = Number(res.headers.get('x-wp-totalpages') ?? '1');
    if (page >= totalPages) break;
  }
  return out;
}

const raw = await fetchAll();

const products = raw
  // Hidden/private items shouldn't reach the app.
  .filter((p) => p.catalog_visibility === 'visible' || p.catalog_visibility === 'catalog')
  .map((p) => {
    const regular = toInt(p.regular_price || p.price);
    const sale = toInt(p.sale_price);
    return {
      id: String(p.id),
      name: p.name,
      slug: p.slug,
      sections: sectionsFor(p),
      priceCop: regular,
      promoCop: p.on_sale && sale > 0 && sale < regular ? sale : null,
      rating: Number(p.average_rating ?? 0) || 0,
      ratingCount: p.rating_count ?? 0,
      inStock: p.stock_status === 'instock',
      description: stripHtml(p.short_description) || stripHtml(p.description).slice(0, 160),
      imageUrl: p.images?.[0]?.src ?? null,
      /** Real product URL from Woo — don't reconstruct it from the slug. */
      permalink: p.permalink,
    };
  })
  .filter((p) => p.priceCop > 0)
  .sort((a, b) => a.name.localeCompare(b.name, 'es'));

const header = `/**
 * GENERADO AUTOMÁTICAMENTE — no editar a mano.
 *
 * Fuente: catálogo real de WooCommerce (copauva.com), traído con
 * \`scripts/fetch-catalog.mjs\`.
 * Snapshot del ${new Date().toISOString().slice(0, 10)} · ${products.length} productos.
 *
 * ⚠️ Es una FOTO, no datos en vivo: precios y stock cambian en la tienda y aquí
 * no. Cuando exista el backend (Codex), la app debe pedirle el catálogo a él en
 * vez de usar este archivo. Para re-generarlo:
 *   WOO_BASE_URL=... WOO_KEY=... WOO_SECRET=... node scripts/fetch-catalog.mjs
 */
import type { GeneratedProduct } from './products';

export const GENERATED_AT = '${new Date().toISOString()}';

export const CATALOG: GeneratedProduct[] = ${JSON.stringify(products, null, 2)};
`;

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'constants', 'catalog.generated.ts');
fs.writeFileSync(outPath, header, 'utf8');

console.log(`✓ ${products.length} productos escritos en constants/catalog.generated.ts`);
const bySection = {};
for (const p of products) for (const s of p.sections) bySection[s] = (bySection[s] ?? 0) + 1;
console.log('  por sección:', bySection);
console.log(`  con imagen: ${products.filter((p) => p.imageUrl).length}/${products.length}`);
console.log(`  en promoción: ${products.filter((p) => p.promoCop).length}`);
console.log(`  agotados: ${products.filter((p) => !p.inStock).length}`);
