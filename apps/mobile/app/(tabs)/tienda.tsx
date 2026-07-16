import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ProductCard } from '../../components/commerce/ProductCard';
import { ProductSheet } from '../../components/commerce/ProductSheet';
import { TabScreenShell } from '../../components/nav';
import { AppButton, EmptyState } from '../../components/ui';
import { PRODUCTS, SHOP_SECTIONS, inSection, type Product, type ShopSection } from '../../constants/products';
import { isRecommendable } from '../../lib/commerce';
import { mockWooCommerceService } from '../../services/woocommerce';
import { useMyProductsStore } from '../../stores/myProductsStore';
import { useScenarioFlags } from '../../stores/scenarioStore';

type SectionId = (typeof SHOP_SECTIONS)[number]['id'];

export default function TiendaScreen() {
  const [section, setSection] = useState<SectionId>('reco');
  const [openId, setOpenId] = useState<string | null>(null);
  const { isOffline } = useScenarioFlags();
  const owns = useMyProductsStore((s) => s.owns);
  const ownedIds = useMyProductsStore((s) => s.ownedIds)();

  const storeQuery = useQuery({
    queryKey: ['woo', 'available'],
    queryFn: () => mockWooCommerceService.isAvailable(),
  });
  const storeAvailable = !isOffline && storeQuery.data !== false;

  const products = useMemo<Product[]>(() => {
    if (section === 'reco') {
      // Recommendations never include out-of-stock or discontinued items (ficha §17.4).
      // Things she already has go last — she doesn't need to be sold them again.
      return PRODUCTS.filter(isRecommendable)
        .sort((a, b) => Number(owns(a.id)) - Number(owns(b.id)))
        .slice(0, 8);
    }
    if (section === 'ofertas') return PRODUCTS.filter((p) => p.promoCop !== null && p.inStock);
    return PRODUCTS.filter((p) => inSection(p, section as ShopSection));
  }, [section, ownedIds]);

  const openProduct = PRODUCTS.find((p) => p.id === openId) ?? null;

  return (
    <TabScreenShell>
      {!storeAvailable ? (
        <View className="rounded-xl bg-warning-soft px-3 py-2.5">
          <Text className="text-center font-semibold text-xs leading-5 text-warning">
            La tienda no está disponible ahora. Puedes explorar el catálogo; la compra se reactiva al reconectar.
          </Text>
        </View>
      ) : null}

      <View className="-mx-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-5">
          {SHOP_SECTIONS.map((s) => {
            const active = s.id === section;
            return (
              <Pressable
                key={s.id}
                onPress={() => setSection(s.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={s.label}
                className={[
                  'min-h-[38px] justify-center rounded-full border px-4',
                  active ? 'border-primary bg-primary' : 'border-border bg-white',
                ].join(' ')}
              >
                <Text className={['font-semibold text-xs', active ? 'text-white' : 'text-ink'].join(' ')}>{s.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {section === 'reco' ? (
        <Text className="font-medium text-[11px] leading-4 text-ink-secondary">
          Te muestro esto según lo que registraste. Toca cualquiera para ver por qué — y no pasa nada si no te sirve.
        </Text>
      ) : null}

      {products.length === 0 ? (
        <EmptyState
          title="Nada por aquí todavía"
          description="Esta categoría aún no tiene productos disponibles."
          action={<AppButton label="Ver recomendados" variant="secondary" size="sm" onPress={() => setSection('reco')} />}
        />
      ) : (
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {products.map((p) => (
            <View key={p.id} style={{ width: '48.5%' }}>
              <ProductCard product={p} owned={owns(p.id)} onPress={() => setOpenId(p.id)} />
            </View>
          ))}
        </View>
      )}

      <Pressable
        onPress={() => router.push('/my-products')}
        accessibilityRole="button"
        className="rounded-2xl border border-dashed border-border bg-white p-4"
      >
        <Text className="text-center font-semibold text-xs text-primary-dark">Ver mis productos →</Text>
      </Pressable>

      <ProductSheet
        product={openProduct}
        visible={!!openId}
        onClose={() => setOpenId(null)}
        storeAvailable={storeAvailable}
      />
    </TabScreenShell>
  );
}
