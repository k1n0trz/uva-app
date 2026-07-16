/**
 * UVA catalog.
 *
 * ⚠️ MOCK DATA. Names come from the ficha técnica §8.4 (the real catalog), but
 * **prices, stock, ratings and images are invented placeholders**. The real
 * values come from the WooCommerce sync (ficha §17.1: "WooCommerce será la
 * fuente principal de catálogo, precio, disponibilidad, variantes, imágenes y
 * URL de compra"). Do not quote these prices to anyone.
 *
 * Commercial rules that the UI must honour (ficha §17.4):
 *   - Never recommend an out-of-stock product.
 *   - Always explain why something is being shown.
 *   - Distinguish "puede ayudarte" / "opcional" / "ya lo tienes".
 *   - Never recommend a cup size without UVA-approved rules.
 */

export type ProductCategory =
  | 'copas'
  | 'kits'
  | 'menstruacion'
  | 'complementos'
  | 'intimo'
  | 'pelvico'
  | 'belleza'
  | 'maternidad';

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  /** COP. Mock. */
  priceCop: number;
  /** COP promo price, or null. Mock. */
  promoCop: number | null;
  rating: number;
  inStock: boolean;
  /** Withdrawn from the catalog but possibly still owned by a user (brief §16). */
  discontinued?: boolean;
  description: string;
};

export const SHOP_SECTIONS: { id: ProductCategory | 'reco' | 'ofertas'; label: string }[] = [
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

export const PRODUCTS: Product[] = [
  // --- Copas y discos ---
  { id: 'p-copa2-0', name: 'Copa Menstrual UVA 2 talla 0', slug: 'copa-uva-2-talla-0', category: 'copas', priceCop: 89000, promoCop: null, rating: 4.7, inStock: true, description: 'Copa de silicona médica hipoalergénica, talla 0.' },
  { id: 'p-copa2-a', name: 'Copa Menstrual UVA 2 talla A', slug: 'copa-uva-2-talla-a', category: 'copas', priceCop: 89000, promoCop: null, rating: 4.8, inStock: true, description: 'Copa de silicona médica hipoalergénica, talla A.' },
  { id: 'p-copa2-b', name: 'Copa Menstrual UVA 2 talla B', slug: 'copa-uva-2-talla-b', category: 'copas', priceCop: 89000, promoCop: null, rating: 4.7, inStock: true, description: 'Copa de silicona médica hipoalergénica, talla B.' },
  { id: 'p-copa-a', name: 'Copa Menstrual UVA talla A', slug: 'copa-uva-talla-a', category: 'copas', priceCop: 75000, promoCop: null, rating: 4.5, inStock: true, discontinued: true, description: 'Modelo anterior de la copa UVA, talla A.' },
  { id: 'p-lily-b', name: 'Copa Menstrual Lily Cup talla B', slug: 'lily-cup-talla-b', category: 'copas', priceCop: 99000, promoCop: null, rating: 4.6, inStock: false, description: 'Copa de diseño plegable, talla B.' },
  { id: 'p-disco', name: 'Disco Menstrual UVA', slug: 'disco-menstrual-uva', category: 'copas', priceCop: 95000, promoCop: null, rating: 4.6, inStock: true, description: 'Disco menstrual de baja fricción para uso prolongado.' },

  // --- Kits ---
  { id: 'p-kit-cuidate-0', name: 'Kit Cuídate UVA talla 0', slug: 'kit-cuidate-uva-0', category: 'kits', priceCop: 129000, promoCop: 109000, rating: 4.8, inStock: true, description: 'Copa, vaso esterilizador y limpiador en un solo kit.' },
  { id: 'p-kit-cuidate-a', name: 'Kit Cuídate UVA talla A', slug: 'kit-cuidate-uva-a', category: 'kits', priceCop: 129000, promoCop: 109000, rating: 4.9, inStock: true, description: 'Copa, vaso esterilizador y limpiador en un solo kit.' },
  { id: 'p-kit-cuidate-b', name: 'Kit Cuídate UVA talla B', slug: 'kit-cuidate-uva-b', category: 'kits', priceCop: 129000, promoCop: 109000, rating: 4.8, inStock: true, description: 'Copa, vaso esterilizador y limpiador en un solo kit.' },
  { id: 'p-kit-bien-0', name: 'Kit Bienestar UVA talla 0', slug: 'kit-bienestar-uva-0', category: 'kits', priceCop: 159000, promoCop: null, rating: 4.7, inStock: true, description: 'Kit ampliado de cuidado y bienestar íntimo.' },
  { id: 'p-kit-bien-a', name: 'Kit Bienestar UVA talla A', slug: 'kit-bienestar-uva-a', category: 'kits', priceCop: 159000, promoCop: null, rating: 4.7, inStock: true, description: 'Kit ampliado de cuidado y bienestar íntimo.' },
  { id: 'p-kit-bien-b', name: 'Kit Bienestar UVA talla B', slug: 'kit-bienestar-uva-b', category: 'kits', priceCop: 159000, promoCop: null, rating: 4.6, inStock: true, description: 'Kit ampliado de cuidado y bienestar íntimo.' },

  // --- Menstruación y complementos ---
  { id: 'p-panties', name: 'Panties Menstruales', slug: 'panties-menstruales', category: 'menstruacion', priceCop: 68000, promoCop: null, rating: 4.5, inStock: true, description: 'Ropa interior absorbente para flujo ligero a moderado.' },
  { id: 'p-almohadilla', name: 'Almohadilla para Cólico Menstrual', slug: 'almohadilla-colico', category: 'menstruacion', priceCop: 45000, promoCop: null, rating: 4.6, inStock: true, description: 'Almohadilla térmica para aliviar la molestia.' },
  { id: 'p-esterilizador', name: 'Esterilizador eléctrico para copas', slug: 'esterilizador-electrico', category: 'complementos', priceCop: 149000, promoCop: null, rating: 4.8, inStock: true, description: 'Esteriliza tu copa en minutos, sin hervir agua.' },
  { id: 'p-vaso', name: 'Vaso esterilizador Copa UVA', slug: 'vaso-esterilizador', category: 'complementos', priceCop: 39000, promoCop: null, rating: 4.5, inStock: true, description: 'Vaso para esterilizar tu copa en microondas.' },
  { id: 'p-limpiador-copa', name: 'Limpiador de Copa Menstrual UVA', slug: 'limpiador-copa', category: 'complementos', priceCop: 29000, promoCop: null, rating: 4.6, inStock: true, description: 'Limpiador específico para silicona médica.' },

  // --- Cuidado íntimo ---
  { id: 'p-jabon-espuma', name: 'Jabón Íntimo Femenino UVA en espuma', slug: 'jabon-intimo-espuma', category: 'intimo', priceCop: 34000, promoCop: null, rating: 4.5, inStock: true, description: 'Espuma de pH balanceado para uso diario.' },
  { id: 'p-jabon-fresh', name: 'Jabón Íntimo UVA Fresh', slug: 'jabon-intimo-fresh', category: 'intimo', priceCop: 32000, promoCop: null, rating: 4.4, inStock: false, description: 'Limpiador de pH balanceado para uso diario.' },
  { id: 'p-lub-copa', name: 'Lubricante para copa menstrual Natural Elixir 100 ml', slug: 'lubricante-copa-100', category: 'intimo', priceCop: 28000, promoCop: null, rating: 4.6, inStock: true, description: 'Facilita la inserción y el retiro de tu copa.' },
  { id: 'p-lub-nat-500', name: 'Lubricante Íntimo Natural Elixir 500 ml', slug: 'lubricante-natural-500', category: 'intimo', priceCop: 62000, promoCop: null, rating: 4.5, inStock: true, description: 'Lubricante íntimo de base natural, formato grande.' },
  { id: 'p-lub-sens-100', name: 'Lubricante Íntimo Piel Sensible Elixir 100 ml', slug: 'lubricante-sensible-100', category: 'intimo', priceCop: 30000, promoCop: null, rating: 4.6, inStock: true, description: 'Formulado para piel sensible.' },
  { id: 'p-lub-sens-500', name: 'Lubricante Íntimo Piel Sensible Elixir 500 ml', slug: 'lubricante-sensible-500', category: 'intimo', priceCop: 66000, promoCop: null, rating: 4.5, inStock: true, description: 'Formulado para piel sensible, formato grande.' },
  { id: 'p-hidratante', name: 'Hidratante Íntimo UVA', slug: 'hidratante-intimo', category: 'intimo', priceCop: 35000, promoCop: null, rating: 4.5, inStock: true, description: 'Hidratación diaria para piel sensible.' },
  { id: 'p-toallitas', name: 'Toallitas Compactas UVA', slug: 'toallitas-compactas', category: 'intimo', priceCop: 18000, promoCop: null, rating: 4.3, inStock: true, description: 'Toallitas compactas para llevar contigo.' },
  { id: 'p-limpiador-juguetes', name: 'Limpiador de Juguetes Elixir', slug: 'limpiador-juguetes', category: 'intimo', priceCop: 26000, promoCop: null, rating: 4.4, inStock: true, description: 'Limpiador específico para juguetes íntimos.' },

  // --- Piso pélvico ---
  { id: 'p-kegel', name: 'Bolas Kegel UVA', slug: 'bolas-kegel-uva', category: 'pelvico', priceCop: 79000, promoCop: null, rating: 4.7, inStock: true, description: 'Set progresivo para entrenamiento del piso pélvico.' },
  { id: 'p-dilatadores', name: 'Dilatadores Vaginales', slug: 'dilatadores-vaginales', category: 'pelvico', priceCop: 119000, promoCop: null, rating: 4.6, inStock: true, description: 'Set progresivo de dilatadores.' },

  // --- Belleza ---
  { id: 'p-cubre-circ', name: 'Cubrepezones ultradelgados circulares', slug: 'cubrepezones-circulares', category: 'belleza', priceCop: 22000, promoCop: null, rating: 4.3, inStock: true, description: 'Cubrepezones ultradelgados, forma circular.' },
  { id: 'p-cubre-tri', name: 'Cubrepezones ultradelgados triangulares', slug: 'cubrepezones-triangulares', category: 'belleza', priceCop: 22000, promoCop: null, rating: 4.2, inStock: true, description: 'Cubrepezones ultradelgados, forma triangular.' },
  { id: 'p-cubre-sin', name: 'Cubrepezones ultradelgados sin adhesivo', slug: 'cubrepezones-sin-adhesivo', category: 'belleza', priceCop: 24000, promoCop: null, rating: 4.2, inStock: true, description: 'Cubrepezones reutilizables sin adhesivo.' },

  // --- Maternidad ---
  { id: 'p-perineal', name: 'Botella de Lavado Perineal UVA', slug: 'botella-lavado-perineal', category: 'maternidad', priceCop: 38000, promoCop: null, rating: 4.6, inStock: true, description: 'Botella de lavado para el cuidado perineal.' },
  { id: 'p-compresas-senos', name: 'Compresas para senos calientes y frías', slug: 'compresas-senos', category: 'maternidad', priceCop: 42000, promoCop: null, rating: 4.5, inStock: true, description: 'Compresas de frío/calor para el posparto.' },
  { id: 'p-compresa-perineal', name: 'Compresa Perineal caliente y fría', slug: 'compresa-perineal', category: 'maternidad', priceCop: 40000, promoCop: null, rating: 4.5, inStock: true, description: 'Compresa de frío/calor para la zona perineal.' },
];

export function formatCop(amount: number): string {
  return `$${amount.toLocaleString('es-CO')}`;
}

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Effective price after any promo. */
export function effectivePrice(p: Product): number {
  return p.promoCop ?? p.priceCop;
}
