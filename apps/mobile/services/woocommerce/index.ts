import { PRODUCTS, type Product, type ProductCategory } from '../../constants/products';

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
  listCategories(): Promise<{ id: ProductCategory; label: string }[]>;
  listProducts(category?: ProductCategory): Promise<Product[]>;
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
 * Configurable so staging/production can differ and so the real product URLs
 * can be swapped in without touching UI. Real value belongs in .env.
 */
const STORE_BASE_URL = process.env.EXPO_PUBLIC_STORE_URL ?? 'https://copauva.com';

const delay = <T>(value: T, ms = 300) => new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

const CATEGORY_LABELS: Record<ProductCategory, string> = {
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
    delay((Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((id) => ({ id, label: CATEGORY_LABELS[id] }))),

  listProducts: (category) => delay(category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS),

  getProduct: (id) => delay(PRODUCTS.find((p) => p.id === id)),

  // Real variations come from Woo; the mock catalog models sizes as separate products.
  listVariations: (_productId) => delay([]),

  productUrl: (product) => `${STORE_BASE_URL}/producto/${product.slug}`,

  checkoutUrl: (product) => `${STORE_BASE_URL}/producto/${product.slug}`,

  getOrderStatus: (_orderId) => delay<OrderStatus>('unknown'),

  isAvailable: () => delay(true),
};
