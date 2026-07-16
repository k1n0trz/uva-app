import type { Product } from '../constants/products';

/**
 * Why a product is being shown.
 *
 * ficha §17.4 requires distinguishing "puede ayudarte" / "opcional" / "ya lo
 * tienes", and every recommendation must carry a visible reason (§18.5).
 * Anything we can't actually justify is labeled plainly as catalog — we don't
 * fake personalization (§18.4: "No debe fingir personalización profunda").
 */
export type RelevanceKind = 'ya-lo-tienes' | 'puede-ayudarte' | 'opcional' | 'catalogo';

export type Relevance = {
  kind: RelevanceKind;
  label: string;
  reason: string;
};

/** Matched on slugs, not the numeric Woo ids — readable and stable across a
 *  catalog re-generation. */
const isCup = (p: Product) => p.slug.includes('copa-menstrual') || p.slug.includes('disco-menstrual');

/** Products that are genuinely used together with a cup. */
const CUP_COMPANION_SLUGS = [
  'lubricante-intimo-natural-elixir-100-ml',
  'limpiador-de-copa-menstrual-uva',
  'vaso-esterilizador-copa-uva',
  'esterilizador-electrico-para-copas-menstruales',
];

export function relevanceFor(product: Product, ctx: { owned: boolean; ownedProducts: Product[] }): Relevance {
  if (ctx.owned) {
    return {
      kind: 'ya-lo-tienes',
      label: 'Ya lo tienes',
      reason: 'Lo tienes registrado en tus productos. Te lo muestro por si quieres repuesto o consultar sus cuidados.',
    };
  }

  // Only claim a link when there genuinely is one.
  const hasCup = ctx.ownedProducts.some(isCup);

  if (hasCup && CUP_COMPANION_SLUGS.includes(product.slug)) {
    return {
      kind: 'puede-ayudarte',
      label: 'Puede ayudarte',
      reason: 'Te lo muestro porque tienes una copa registrada y este producto se usa con ella. Es completamente opcional.',
    };
  }
  if (hasCup && product.slug === 'panties-menstruales') {
    return {
      kind: 'opcional',
      label: 'Opcional',
      reason: 'Algunas usuarias lo usan como respaldo mientras aprenden con la copa. Es opcional.',
    };
  }

  return {
    kind: 'catalogo',
    label: 'Del catálogo',
    reason: 'Es parte del catálogo de UVA. No lo estoy recomendando para ti en particular.',
  };
}

/**
 * Never recommend an out-of-stock product (ficha §17.4). This gates the
 * "Recomendados" section, not browsing — she can still find it in its category.
 */
export function isRecommendable(product: Product): boolean {
  return product.inStock;
}
