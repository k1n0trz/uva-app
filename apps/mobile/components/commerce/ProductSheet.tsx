import * as WebBrowser from 'expo-web-browser';
import { Image, Text, View } from 'react-native';
import { effectivePrice, findProduct, formatCop, type Product } from '../../constants/products';
import { relevanceFor } from '../../lib/commerce';
import { mockWooCommerceService } from '../../services/woocommerce';
import { useMyProductsStore } from '../../stores/myProductsStore';
import { useToastStore } from '../../stores/toastStore';
import { AppButton, BottomSheet } from '../ui';

type Props = {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
  /** False when the store can't be reached (ficha §29). */
  storeAvailable?: boolean;
};

const RELEVANCE_STYLES: Record<string, string> = {
  'ya-lo-tienes': 'bg-success-soft text-success',
  'puede-ayudarte': 'bg-primary-soft text-primary-dark',
  opcional: 'bg-primary-xsoft text-primary-dark',
  catalogo: 'bg-surface text-ink-secondary',
};

/**
 * Product detail.
 *
 * Buying never happens here: "Comprar" hands off to a secure web window where
 * WooCommerce + Mercado Pago take over (brief §17). There is deliberately no
 * card form, no native checkout and no fake payment step anywhere.
 */
export function ProductSheet({ product, visible, onClose, storeAvailable = true }: Props) {
  const owns = useMyProductsStore((s) => s.owns);
  const setState = useMyProductsStore((s) => s.setState);
  const remove = useMyProductsStore((s) => s.remove);
  const ownedIds = useMyProductsStore((s) => s.ownedIds)();
  const showToast = useToastStore((s) => s.show);

  if (!product) return null;

  const ownedProducts = ownedIds.map(findProduct).filter((p): p is Product => !!p);
  const owned = owns(product.id);
  const relevance = relevanceFor(product, { owned, ownedProducts });
  const price = effectivePrice(product);
  const canBuy = product.inStock && storeAvailable;

  const openExternal = async (url: string) => {
    try {
      // Opens an in-app secure web window and returns here when she's done.
      await WebBrowser.openBrowserAsync(url, { presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET });
    } catch {
      showToast('No pudimos abrir la tienda. Intenta de nuevo.');
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeightPct={92}>
      <View className="mb-3.5 h-[200px] items-center justify-center overflow-hidden rounded-2xl bg-white">
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            accessibilityLabel={product.name}
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-primary-soft">
            <Text className="font-semibold text-[10px] text-primary-dark">sin imagen</Text>
          </View>
        )}
      </View>

      <Text className="font-extrabold text-[17px] leading-6 text-ink">{product.name}</Text>

      <View className="my-2 flex-row flex-wrap items-center gap-2">
        <Text className="font-extrabold text-[17px] text-primary">{formatCop(price)}</Text>
        {product.promoCop !== null ? (
          <Text className="font-semibold text-[13px] text-ink-secondary line-through">{formatCop(product.priceCop)}</Text>
        ) : null}
        {product.rating > 0 ? (
          <Text className="font-semibold text-[11px] text-ink-secondary">
            ★ {product.rating.toFixed(1)}
            {product.ratingCount > 0 ? ` (${product.ratingCount})` : ''}
          </Text>
        ) : null}
      </View>

      <Text className="mb-2 font-medium text-[13px] leading-6 text-ink">{product.description}</Text>

      {/* Why she's seeing this, always labeled (ficha §17.4 / §18.5) */}
      <View className={`mb-3 rounded-xl px-3 py-2.5 ${RELEVANCE_STYLES[relevance.kind].split(' ')[0]}`}>
        <Text className={`font-bold text-[10px] uppercase ${RELEVANCE_STYLES[relevance.kind].split(' ')[1]}`}>
          {relevance.label}
        </Text>
        <Text className="mt-1 font-medium text-[12px] leading-5 text-ink">{relevance.reason}</Text>
      </View>

      {!product.inStock ? (
        <View className="mb-3 rounded-xl bg-warning-soft px-3 py-2.5">
          <Text className="font-semibold text-xs leading-5 text-warning">
            Agotado por ahora. No puedes comprarlo desde aquí hasta que vuelva a estar disponible.
          </Text>
        </View>
      ) : null}
      {/* "Producto descontinuado" (ficha §16.1) isn't shown yet: WooCommerce has
          no such flag — a withdrawn product is simply unpublished and never
          reaches this catalog. Surfacing it needs a real signal from UVA (a Woo
          tag or a backend field), not a guess on our side. */}
      {!storeAvailable ? (
        <View className="mb-3 rounded-xl bg-warning-soft px-3 py-2.5">
          <Text className="font-semibold text-xs leading-5 text-warning">
            La tienda no está disponible en este momento. Puedes seguir explorando el catálogo.
          </Text>
        </View>
      ) : null}

      <View className="gap-2">
        <AppButton
          label={owned ? 'Quitar de mis productos' : 'Ya lo tengo'}
          variant={owned ? 'outline' : 'secondary'}
          fullWidth
          onPress={() => {
            if (owned) {
              remove(product.id);
              showToast('Lo quité de tus productos');
            } else {
              setState(product.id, 'lo-tengo');
              showToast('Lo agregué a tus productos');
            }
          }}
        />
        <View className="flex-row gap-2">
          <View className="flex-1">
            <AppButton
              label="Ver en UVA"
              variant="outline"
              fullWidth
              onPress={() => openExternal(mockWooCommerceService.productUrl(product))}
            />
          </View>
          <View className="flex-1">
            <AppButton
              label={!product.inStock ? 'Agotado' : 'Comprar'}
              fullWidth
              disabled={!canBuy}
              onPress={() => openExternal(mockWooCommerceService.checkoutUrl(product))}
            />
          </View>
        </View>
        {canBuy ? (
          <Text className="text-center font-medium text-[11px] leading-4 text-ink-secondary">
            La compra se completa en la tienda de UVA, en una ventana segura. Puedes volver aquí cuando termines.
          </Text>
        ) : null}
      </View>
    </BottomSheet>
  );
}
