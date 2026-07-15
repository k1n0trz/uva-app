/**
 * Real integration lives entirely on the backend (ficha técnica §17.1/§24.1):
 * consumer key/secret never touch the app. This mock only builds the URL the
 * in-app browser opens, and simulates the "return to UVA App" step.
 */
export interface WooCommerceService {
  buildCheckoutUrl(productSlug: string): string;
}

export const mockWooCommerceService: WooCommerceService = {
  buildCheckoutUrl: (productSlug) => `https://copauva.com/producto/${productSlug}`,
};
