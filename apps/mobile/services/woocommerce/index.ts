import { PRODUCTS, inSection, type Product, type ShopSection } from '../../constants/products';

/**
 * WooCommerce adapter.
 *
 * ⚠️ ARCHITECTURE RULE (ficha §17.1/§24.1): consumer key/secret **never** live
 * in the app. The app calls the UVA backend; the backend calls WooCommerce.
 * This mock stands in for that backend call — when Codex builds it, swap the
 * implementation, not the interface.
 *
 * Purchases are never processed natively (brief §17): the app hands off to a
 * secure web window where WooCommerce + Mercado Pago take over. There is no
 * native checkout and no simulated card data anywhere in this codebase.
 */

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'unknown';

export type ProductVariation = {
  id: string;
  label: string;
  inStock: boolean;
};

export interface WooCommerceService {
  listCategories(): Promise<{ id: ShopSection; label: string }[]>;
  listProducts(section?: ShopSection): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  listVariations(productId: string): Promise<ProductVariation[]>;
  /** Landing page for the product on the real store. */
  productUrl(product: Product): string;
  /**
   * Where "Comprar" sends her. ficha §17.3 recommends adding the product to the
   * cart and going straight to checkout rather than dropping her on the landing
   * page — that's a backend-built link once the real product IDs exist.
   */
  checkoutUrl(product: Product): string;
  getOrderStatus(orderId: string): Promise<OrderStatus>;
  /** Store reachability — drives the "compra temporalmente no disponible" state (ficha §29). */
  isAvailable(): Promise<boolean>;
}

/**
 * Only used as a fallback. Real product URLs come from Woo's own `permalink`
 * field — never reconstruct them from a slug, the store's URL structure is not
 * ours to guess.
 */
const STORE_BASE_URL = process.env.EXPO_PUBLIC_STORE_URL ?? 'https://copauva.com';

const delay = <T>(value: T, ms = 300) => new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

const CATEGORY_LABELS: Record<ShopSection, string> = {
  copas: 'Copas y discos',
  kits: 'Kits',
  menstruacion: 'Menstruación',
  complementos: 'Complementos',
  intimo: 'Cuidado íntimo',
  pelvico: 'Piso pélvico',
  belleza: 'Belleza',
  maternidad: 'Maternidad',
};

export const mockWooCommerceService: WooCommerceService = {
  listCategories: () =>
    delay((Object.keys(CATEGORY_LABELS) as ShopSection[]).map((id) => ({ id, label: CATEGORY_LABELS[id] }))),

  listProducts: (section) => delay(section ? PRODUCTS.filter((p) => inSection(p, section)) : PRODUCTS),

  getProduct: (id) => delay(PRODUCTS.find((p) => p.id === id)),

  // Sizes are separate products in this store, so there are no variations yet.
  // Real ones arrive with the backend sync.
  listVariations: (_productId) => delay([]),

  productUrl: (product) => product.permalink || `${STORE_BASE_URL}/producto/${product.slug}`,

  // ficha §17.3 recommends going straight to a pre-filled cart/checkout. That
  // needs the backend to build the link with real Woo product ids, so for now
  // this lands on the product page.
  checkoutUrl: (product) => product.permalink || `${STORE_BASE_URL}/producto/${product.slug}`,

  getOrderStatus: (_orderId) => delay<OrderStatus>('unknown'),

  isAvailable: () => delay(true),
};
