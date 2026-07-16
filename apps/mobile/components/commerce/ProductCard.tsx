import { Pressable, Text, View } from 'react-native';
import { effectivePrice, formatCop, type Product } from '../../constants/products';

type Props = {
  product: Product;
  onPress: () => void;
  /** Shown when the user already has it — "ya lo tienes" (ficha §17.4). */
  owned?: boolean;
};

/** Grid tile. Image is a placeholder until WooCommerce provides real ones. */
export function ProductCard({ product, onPress, owned }: Props) {
  const price = effectivePrice(product);
  const hasPromo = product.promoCop !== null;

  const a11y = [
    product.name,
    formatCop(price),
    hasPromo ? 'en promoción' : null,
    !product.inStock ? 'agotado' : null,
    owned ? 'ya lo tienes' : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      className="overflow-hidden rounded-2xl border border-border bg-white"
    >
      <View className="h-[92px] items-center justify-center bg-primary-soft">
        <Text className="font-semibold text-[9px] text-primary-dark">producto</Text>
        <View className="absolute left-1.5 top-1.5 flex-row gap-1">
          {!product.inStock ? (
            <View className="rounded-full bg-ink px-2 py-0.5">
              <Text className="font-bold text-[9px] text-white">Agotado</Text>
            </View>
          ) : null}
          {owned ? (
            <View className="rounded-full bg-success px-2 py-0.5">
              <Text className="font-bold text-[9px] text-white">Ya lo tienes</Text>
            </View>
          ) : null}
          {hasPromo && product.inStock ? (
            <View className="rounded-full bg-primary px-2 py-0.5">
              <Text className="font-bold text-[9px] text-white">Promo</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View className="px-3 pb-3 pt-2.5">
        <Text className="font-bold text-xs leading-4 text-ink" numberOfLines={2}>
          {product.name}
        </Text>
        <View className="mt-1.5 flex-row items-center gap-1.5">
          <Text className="font-extrabold text-[13px] text-primary">{formatCop(price)}</Text>
          {hasPromo ? (
            <Text className="font-semibold text-[11px] text-ink-secondary line-through">
              {formatCop(product.priceCop)}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
