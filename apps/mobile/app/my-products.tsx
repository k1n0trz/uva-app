import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductSheet } from '../components/commerce/ProductSheet';
import { AppButton, ChipGroup, EmptyState } from '../components/ui';
import { PRODUCTS, findProduct } from '../constants/products';
import { goBackOr } from '../lib/nav';
import { OWNERSHIP_LABELS, useMyProductsStore, type OwnershipState } from '../stores/myProductsStore';
import { useToastStore } from '../stores/toastStore';

const STATE_ORDER: OwnershipState[] = ['lo-tengo', 'lo-uso', 'quiero-conocerlo', 'deje-de-usarlo', 'no-recuerdo'];

/** Related routine per product, keyed by slug — only where UVA content genuinely exists. */
const RELATED_ROUTINE_BY_SLUG: Record<string, { id: string; label: string }> = {
  'bolas-kegel-uva': { id: 'kegel1', label: 'Rutina con Bolas Kegel' },
  'dilatadores-vaginales': { id: 'r1', label: 'Conciencia corporal' },
};

export default function MyProductsScreen() {
  const insets = useSafeAreaInsets();
  const byId = useMyProductsStore((s) => s.byId);
  const setState = useMyProductsStore((s) => s.setState);
  const remove = useMyProductsStore((s) => s.remove);
  const showToast = useToastStore((s) => s.show);
  const [addOpen, setAddOpen] = useState(false);
  const [sheetId, setSheetId] = useState<string | null>(null);

  const entries = Object.entries(byId);

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 border-b border-border bg-white px-5 py-4">
        <Pressable
          onPress={() => goBackOr('/(tabs)/tienda')}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-white"
        >
          <Text className="font-bold text-sm text-ink-secondary">‹</Text>
        </Pressable>
        <Text className="font-extrabold text-base text-ink">Mis productos</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {entries.length === 0 ? (
          <EmptyState
            title="Aún no tienes productos registrados"
            description="No los necesitas para usar la app. Si tienes alguno, agrégalo y te muestro sus guías y cuidados."
            action={<AppButton label="Agregar un producto" size="sm" onPress={() => setAddOpen(true)} />}
          />
        ) : (
          entries.map(([id, state]) => {
            const product = findProduct(id);
            if (!product) return null;
            const routine = RELATED_ROUTINE_BY_SLUG[product.slug];
            return (
              <View key={id} className="gap-3 rounded-2xl border border-border bg-white p-4">
                <View className="flex-row items-start gap-3">
                  <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white">
                    {product.imageUrl ? (
                      <Image source={{ uri: product.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                    ) : (
                      <View className="h-full w-full items-center justify-center bg-primary-soft">
                        <Text className="font-semibold text-[8px] text-primary-dark">foto</Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-sm leading-5 text-ink">{product.name}</Text>
                    {/* She can own something the store has run out of — that's fine, her guides stay. */}
                    {!product.inStock ? (
                      <Text className="mt-1 font-semibold text-[11px] text-warning">Agotado en la tienda</Text>
                    ) : null}
                  </View>
                </View>

                <View className="gap-1.5">
                  <Text className="font-semibold text-[11px] uppercase text-ink-secondary">¿Cómo lo tienes?</Text>
                  <ChipGroup
                    label={`Estado de ${product.name}`}
                    multi={false}
                    options={STATE_ORDER.map((s) => OWNERSHIP_LABELS[s])}
                    selected={[OWNERSHIP_LABELS[state]]}
                    onToggle={(label) => {
                      const next = STATE_ORDER.find((s) => OWNERSHIP_LABELS[s] === label);
                      if (next) setState(id, next);
                    }}
                  />
                </View>

                <View className="flex-row flex-wrap gap-2">
                  <AppButton label="Guías y cuidados" variant="secondary" size="sm" onPress={() => setSheetId(id)} />
                  {routine ? (
                    <AppButton
                      label={routine.label}
                      variant="outline"
                      size="sm"
                      onPress={() => router.push(`/routine/${routine.id}`)}
                    />
                  ) : null}
                  <AppButton
                    label="Quitar"
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      remove(id);
                      showToast('Lo quité de tus productos');
                    }}
                  />
                </View>
              </View>
            );
          })
        )}

        {entries.length > 0 ? (
          <AppButton label="Agregar otro producto" variant="secondary" fullWidth onPress={() => setAddOpen(true)} />
        ) : null}
      </ScrollView>

      {/* Add: the full catalog, searchable by category in the shop. Kept simple here. */}
      {addOpen ? (
        <View className="absolute inset-0 bg-ink/35">
          <Pressable className="flex-1" onPress={() => setAddOpen(false)} accessibilityLabel="Cerrar" />
          <View className="max-h-[70%] rounded-t-4xl bg-white pt-4" style={{ paddingBottom: insets.bottom + 12 }}>
            <Text className="mb-3 px-5 font-extrabold text-base text-ink">Agregar un producto</Text>
            <ScrollView contentContainerClassName="gap-2 px-5 pb-4">
              {PRODUCTS.filter((p) => !byId[p.id]).map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => {
                    setState(p.id, 'lo-tengo');
                    setAddOpen(false);
                    showToast('Lo agregué a tus productos');
                  }}
                  accessibilityRole="button"
                  className="min-h-[44px] justify-center rounded-xl border border-border bg-surface px-4 py-2.5"
                >
                  <Text className="font-semibold text-[13px] text-ink">{p.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      ) : null}

      <ProductSheet product={findProduct(sheetId ?? '') ?? null} visible={!!sheetId} onClose={() => setSheetId(null)} />
    </View>
  );
}
