import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { TabScreenShell } from '../../components/nav';
import { AppButton, EmptyState } from '../../components/ui';
import { GENERAL_ROUTINES, KEGEL_LEVELS, type Routine } from '../../constants/routines';
import { nextLevelHint, useRoutinesStore } from '../../stores/routinesStore';

function RoutineRow({ routine, onPress }: { routine: Routine; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${routine.name}. ${routine.desc}. ${routine.durationLabel}`}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-white p-2.5 pr-3.5"
    >
      <Image source={routine.icon} style={{ width: 44, height: 44, borderRadius: 12 }} resizeMode="cover" />
      <View className="flex-1">
        <Text className="font-bold text-sm text-ink">{routine.name}</Text>
        <Text className="font-medium text-xs text-ink-secondary">
          {routine.desc} · {routine.durationLabel}
        </Text>
      </View>
    </Pressable>
  );
}

function LockedLevel({ routine, hint }: { routine: Routine; hint: string }) {
  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-surface p-3.5 opacity-70"
      accessible
      accessibilityLabel={`${routine.name}. Bloqueado. ${hint}`}
    >
      <View className="h-11 w-11 items-center justify-center rounded-full border border-border bg-white">
        <Text style={{ fontSize: 14 }}>🔒</Text>
      </View>
      <View className="flex-1">
        <Text className="font-bold text-sm text-ink-secondary">{routine.name}</Text>
        <Text className="mt-0.5 font-medium text-[11px] leading-4 text-ink-secondary">{hint}</Text>
      </View>
    </View>
  );
}

export default function RutinasScreen() {
  const intakeCompleted = useRoutinesStore((s) => s.intakeCompleted);
  const sessions = useRoutinesStore((s) => s.sessions);
  const eligibility = useRoutinesStore((s) => s.eligibility)();
  const unlocked = useRoutinesStore((s) => s.unlockedLevels)();

  const openRoutine = (id: string) => router.push(`/routine/${id}`);

  return (
    <TabScreenShell>
      <View className="gap-2.5">
        <Text className="font-bold text-[15px] text-ink">Piso pélvico y bienestar</Text>
        <Text className="font-medium text-xs leading-4 text-ink-secondary">
          Estas rutinas están disponibles para ti, tengas o no productos UVA.
        </Text>
        <View className="gap-2.5">
          {GENERAL_ROUTINES.map((r) => (
            <RoutineRow key={r.id} routine={r} onPress={() => openRoutine(r.id)} />
          ))}
        </View>
      </View>

      {/* Weighted levels: only after the eligibility gate passes (ficha §15.4) */}
      {eligibility.eligible ? (
        <View className="gap-2.5">
          <Text className="font-bold text-[15px] text-ink">Rutina con Bolas Kegel UVA</Text>
          <View className="gap-2.5">
            {KEGEL_LEVELS.map((level) => {
              const isUnlocked = unlocked.includes(level.level ?? 1);
              return isUnlocked ? (
                <Pressable
                  key={level.id}
                  onPress={() => openRoutine(level.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`${level.name}. ${level.desc}. ${level.durationLabel}`}
                  className="flex-row items-center gap-3 rounded-2xl border border-primary-border bg-primary-xsoft p-3.5"
                >
                  <View className="h-11 w-11 items-center justify-center rounded-full border border-primary-border bg-white">
                    <Text className="font-extrabold text-[13px] text-primary-dark">{level.level}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-sm text-ink">{level.name}</Text>
                    <Text className="font-medium text-xs text-ink-secondary">
                      {level.desc} · {level.durationLabel}
                    </Text>
                  </View>
                </Pressable>
              ) : (
                <LockedLevel key={level.id} routine={level} hint={nextLevelHint(level.level ?? 2)} />
              );
            })}
          </View>
          <Text className="font-medium text-[11px] leading-4 text-ink-secondary">
            Los niveles avanzan por cómo te sientes, no por los días que lleves ni por lo que hayas comprado.
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={() => router.push('/kegel-intake')}
          accessibilityRole="button"
          className="gap-2 rounded-2xl border border-dashed border-border bg-white p-4"
        >
          <Text className="text-center font-semibold text-xs leading-5 text-ink-secondary">
            {intakeCompleted && eligibility.owns
              ? 'Por ahora no te propongo las rutinas con peso. Toca para revisar tus respuestas.'
              : '¿Tienes Bolas Kegel UVA? Responde unas preguntas y te digo qué es seguro proponerte.'}
          </Text>
        </Pressable>
      )}

      <View className="gap-1.5 rounded-2xl border border-border bg-white p-4">
        <Text className="mb-1 font-bold text-sm text-ink">Historial</Text>
        {sessions.length === 0 ? (
          <EmptyState
            title="Aún no hay rutinas completadas"
            description="Cuando termines una, aparecerá aquí con cómo te sentiste."
          />
        ) : (
          [...sessions].reverse().map((s, i) => (
            <View key={`${s.at}-${i}`} className="flex-row justify-between border-b border-border py-2">
              <Text className="flex-1 font-medium text-[13px] text-ink">{s.routineName}</Text>
              <Text className="font-medium text-[13px] text-ink-secondary">
                {new Date(s.at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
              </Text>
            </View>
          ))
        )}
      </View>
    </TabScreenShell>
  );
}
