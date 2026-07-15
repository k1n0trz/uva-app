export type Product = {
  id: string;
  name: string;
  slug: string;
  category: 'copas' | 'kits' | 'menstruacion' | 'pelvico' | 'intimo';
  priceCop: number;
  promoCop: number | null;
  rating: number;
  inStock: boolean;
  description: string;
  why: string | null;
};

export interface ProductsService {
  listProducts(category?: Product['category']): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
}

/** Subset of the real UVA catalog (full list lives in the ficha técnica §8.4); expand in Fase 6. */
const CATALOG: Product[] = [
  {
    id: 'p1',
    name: 'Copa Menstrual UVA 2 talla A',
    slug: 'copa-uva-2-talla-a',
    category: 'copas',
    priceCop: 89000,
    promoCop: null,
    rating: 4.8,
    inStock: true,
    description: 'Copa de silicona médica hipoalergénica, talla A.',
    why: 'Elegiste talla A en tu registro de productos.',
  },
  {
    id: 'p3',
    name: 'Kit Cuídate UVA talla A',
    slug: 'kit-cuidate-uva-a',
    category: 'kits',
    priceCop: 129000,
    promoCop: 109000,
    rating: 4.9,
    inStock: true,
    description: 'Copa, vaso esterilizador y limpiador en un solo kit.',
    why: 'Ahorras comprando el set completo.',
  },
  {
    id: 'p5',
    name: 'Bolas Kegel UVA',
    slug: 'bolas-kegel-uva',
    category: 'pelvico',
    priceCop: 79000,
    promoCop: null,
    rating: 4.7,
    inStock: true,
    description: 'Set progresivo para fortalecimiento del piso pélvico.',
    why: 'Ya las tienes registradas — repuesto o regalo.',
  },
];

const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 350));

export const mockProductsService: ProductsService = {
  listProducts: (category) => delay(category ? CATALOG.filter((p) => p.category === category) : CATALOG),
  getProduct: (id) => delay(CATALOG.find((p) => p.id === id)),
};

export function formatCop(amount: number): string {
  return `$${amount.toLocaleString('es-CO')}`;
}
