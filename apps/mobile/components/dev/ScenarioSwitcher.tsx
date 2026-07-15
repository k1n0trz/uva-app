import { ScrollView, Pressable, Text, View } from 'react-native';
import { SCENARIOS, useScenarioStore } from '../../stores/scenarioStore';

/**
 * Dev-only scenario picker. Gated behind `__DEV__` so it never ships to
 * production builds (brief: "puede estar oculto tras una ruta o bandera de
 * desarrollo").
 */
export function ScenarioSwitcher() {
  const scenario = useScenarioStore((s) => s.scenario);
  const setScenario = useScenarioStore((s) => s.setScenario);

  if (!__DEV__) return null;

  return (
    <View className="border-b border-border bg-white">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-4 py-2">
        {SCENARIOS.map((opt) => {
          const active = opt.id === scenario;
          return (
            <Pressable
              key={opt.id}
              onPress={() => setScenario(opt.id)}
              accessibilityRole="button"
              accessibilityLabel={`Escenario: ${opt.label}`}
              accessibilityState={{ selected: active }}
              className={active ? 'rounded-full bg-primary-soft px-3 py-1.5' : 'rounded-full bg-surface px-3 py-1.5'}
            >
              <Text className={active ? 'font-semibold text-[11px] text-primary-dark' : 'font-semibold text-[11px] text-ink-secondary'}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
