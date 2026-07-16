/**
 * UVA catalog.
 *
 * The data now comes from the REAL WooCommerce store (copauva.com), fetched at
 * development time by `scripts/fetch-catalog.mjs` into `catalog.generated.ts`.
 * Names, prices, images, stock and ratings are real.
 *
 * ⚠️ It is a SNAPSHOT, not live data. Prices and stock change in the store and
 * this file won't know. Two consequences:
 *   1. Re-run the script before any demo where prices matter.
 *   2. Once Codex's backend exists, the app must fetch the catalog from it —
 *      the app itself can never hold WooCommerce credentials (ficha §17.1/§24.1),
 *      which is exactly why this generate-at-build-time detour exists.
 *
 * Commercial rules the UI must honour (ficha §17.4):
 *   - Never recommend an out-of-stock product.
 *   - Always explain why something is being shown.
 *   - Distinguish "puede ayudarte" / "opcional" / "ya lo tienes".
 *   - Never recommend a cup size without UVA-approved rules.
 */
import { CATALOG, GENERATED_AT } from './catalog.generated';

export type ShopSection =
  | 'copas'
  | 'kits'
  | 'menstruacion'
  | 'complementos'
  | 'intimo'
  | 'pelvico'
  | 'belleza'
  | 'maternidad';

/** Shape emitted by scripts/fetch-catalog.mjs. */
export type GeneratedProduct = {
  id: string;
  name: string;
  slug: string;
  /** A product belongs to every section that applies, like it does in the store. */
  sections: ShopSection[];
  priceCop: number;
  promoCop: number | null;
  rating: number;
  ratingCount: number;
  inStock: boolean;
  description: string;
  imageUrl: string | null;
  /** Real product URL from WooCommerce — never reconstruct it from the slug. */
  permalink: string;
};

export type Product = GeneratedProduct;

export const PRODUCTS: Product[] = CATALOG;
export const CATALOG_GENERATED_AT = GENERATED_AT;

export const SHOP_SECTIONS: { id: ShopSection | 'reco' | 'ofertas'; label: string }[] = [
  { id: 'reco', label: 'Recomendados' },
  { id: 'menstruacion', label: 'Menstruación' },
  { id: 'copas', label: 'Copas y discos' },
  { id: 'kits', label: 'Kits' },
  { id: 'complementos', label: 'Complementos' },
  { id: 'intimo', label: 'Cuidado íntimo' },
  { id: 'pelvico', label: 'Piso pélvico' },
  { id: 'belleza', label: 'Belleza' },
  { id: 'maternidad', label: 'Maternidad' },
  { id: 'ofertas', label: 'Ofertas' },
];

export function formatCop(amount: number): string {
  return `$${amount.toLocaleString('es-CO')}`;
}

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Prefer slugs over the numeric Woo ids when referencing products in code —
 *  they're readable and survive a catalog re-generation. */
export function findBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function idBySlug(slug: string): string | undefined {
  return findBySlug(slug)?.id;
}

/** Effective price after any promo. */
export function effectivePrice(p: Product): number {
  return p.promoCop ?? p.priceCop;
}

export function inSection(p: Product, section: ShopSection): boolean {
  return p.sections.includes(section);
}
