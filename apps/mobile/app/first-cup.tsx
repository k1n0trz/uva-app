import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '../components/ui';
import { CUP_STAGES } from '../constants/firstCup';
import { webAriaProgress } from '../lib/a11y';
import { useFirstCupStore } from '../stores/firstCupStore';
import { useToastStore } from '../stores/toastStore';

/**
 * Modo Primera Copa — guided, resumable, repeatable.
 *
 * Not an article: progress is saved, any stage can be repeated, and
 * "Necesito ayuda" routes straight to Modo Rescate (brief §13 / ficha §13).
 */
export default function FirstCupScreen() {
  const insets = useSafeAreaInsets();
  const stages = useFirstCupStore((s) => s.stages);
  const toggleExpanded = useFirstCupStore((s) => s.toggleExpanded);
  const markDone = useFirstCupStore((s) => s.markDone);
  const markUndone = useFirstCupStore((s) => s.markUndone);
  const showToast = useToastStore((s) => s.show);

  const doneCount = stages.filter((s) => s.done).length;
  const progressPct = Math.round((doneCount / stages.length) * 100);

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 border-b border-border bg-white px-5 py-4">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-white"
        >
          <Text className="font-bold text-sm text-ink-secondary">‹</Text>
        </Pressable>
        <Text className="font-extrabold text-base text-ink">Modo Primera Copa</Text>
      </View>

      <View className="gap-1.5 bg-white px-5 pb-4">
        <View
          className="h-2 overflow-hidden rounded-full bg-border"
          accessibilityRole="progressbar"
          accessibilityValue={{ now: progressPct, min: 0, max: 100 }}
          accessibilityLabel={`Progreso: ${progressPct} por ciento`}
          {...webAriaProgress(progressPct)}
        >
          <View className="h-full rounded-full bg-primary" style={{ width: `${progressPct}%` }} />
        </View>
        <Text className="font-semibold text-xs text-ink-secondary">
          {progressPct}% completado · {doneCount} de {stages.length} etapas
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2 px-5 pt-3.5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {CUP_STAGES.map((stage, i) => {
          const state = stages[i];
          return (
            <View
              key={stage.name}
              className={['rounded-2xl border border-border p-3.5', state.expanded ? 'bg-primary-xsoft' : 'bg-white'].join(' ')}
            >
              <Pressable
                onPress={() => toggleExpanded(i)}
                accessibilityRole="button"
                accessibilityState={{ expanded: state.expanded }}
                accessibilityLabel={`Etapa ${i + 1}: ${stage.name}${state.done ? ', completada' : ''}`}
                className="min-h-[44px] flex-row items-center justify-between gap-2"
              >
                <View className="flex-1 flex-row items-center gap-2.5">
                  <View
                    className={[
                      'h-6 w-6 items-center justify-center rounded-full',
                      state.done ? 'bg-success' : 'bg-border',
                    ].join(' ')}
                  >
                    <Text className={['font-bold text-[11px]', state.done ? 'text-white' : 'text-ink-secondary'].join(' ')}>
                      {state.done ? '✓' : i + 1}
                    </Text>
                  </View>
                  <Text className="flex-1 font-bold text-[13px] text-ink">{stage.name}</Text>
                </View>
                <Text className="text-ink-faint">{state.expanded ? '︿' : '﹀'}</Text>
              </Pressable>

              {state.expanded ? (
                <View className="mt-2.5 gap-2.5">
                  <Text className="font-medium text-[13px] leading-6 text-ink-secondary">{stage.text}</Text>
                  <View className="flex-row gap-2">
                    <View className="flex-1">
                      <AppButton
                        label={state.done ? 'Repetir esta etapa' : 'Lo logré'}
                        variant={state.done ? 'outline' : 'dark'}
                        size="sm"
                        fullWidth
                        onPress={() => {
                          if (state.done) {
                            markUndone(i);
                            showToast('Puedes repetirla las veces que quieras.');
                          } else {
                            markDone(i);
                            showToast('Progreso guardado');
                          }
                        }}
                      />
                    </View>
                    <View className="flex-1">
                      <AppButton
                        label="Necesito ayuda"
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onPress={() => router.push('/rescue')}
                      />
                    </View>
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
