import { router } from 'expo-router';
import { goBackOr } from '../lib/nav';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, HealthWarning } from '../components/ui';
import { ASSISTANT_NAME } from '../constants/brand';
import { RESCUE_OPTIONS, RESCUE_WARNING } from '../constants/rescue';

/**
 * Modo Rescate.
 *
 * Deliberately spare: no header gradient, no promos, no ads, no product
 * recommendations, no scenario switcher (ficha §14 / §17.5 — "Los anuncios no
 * deben interrumpir conversaciones sensibles ni Modo Rescate"). She's here
 * because something is wrong; don't sell to her.
 */
export default function RescueScreen() {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = RESCUE_OPTIONS.find((o) => o.id === selectedId) ?? null;

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 border-b border-border px-5 py-4">
        <Pressable
          onPress={() => goBackOr('/(tabs)/hoy')}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-white"
        >
          <Text className="font-bold text-sm text-ink-secondary">‹</Text>
        </Pressable>
        <Text className="font-extrabold text-base text-danger">Necesito ayuda ahora</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {selected ? (
          <View className="mb-4 gap-3 rounded-2xl border border-danger-border bg-danger-soft/40 p-4">
            <Text className="font-bold text-sm text-ink">{selected.label}</Text>
            <Text className="font-medium text-[13px] leading-6 text-ink">{selected.tip}</Text>
            {selected.warn ? <HealthWarning message={RESCUE_WARNING} /> : null}
            <AppButton
              label={`Hablar con ${ASSISTANT_NAME}`}
              variant="dark"
              onPress={() => router.replace('/(tabs)/abril')}
            />
          </View>
        ) : (
          <Text className="mb-4 font-medium text-[13px] leading-5 text-ink-secondary">
            Cuéntame qué está pasando. Vamos paso a paso, con calma.
          </Text>
        )}

        <View className="gap-2">
          {RESCUE_OPTIONS.map((option) => {
            const isSelected = option.id === selectedId;
            return (
              <Pressable
                key={option.id}
                onPress={() => setSelectedId(option.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={[
                  'min-h-[44px] justify-center rounded-xl border px-4 py-3',
                  isSelected ? 'border-primary bg-primary-xsoft' : 'border-border bg-surface',
                ].join(' ')}
              >
                <Text className={['font-semibold text-[13px]', isSelected ? 'text-primary-dark' : 'text-ink'].join(' ')}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
