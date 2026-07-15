import { router } from 'expo-router';
import { Alert, Pressable, Text, View } from 'react-native';
import { AppButton } from '../../components/ui';
import { HealthWarning } from '../../components/ui/HealthWarning';
import { VeraAvatar } from '../../components/vera';
import { TabScreenShell } from '../../components/nav';
import { useScenarioFlags } from '../../stores/scenarioStore';

const comingSoon = (phase: string) => () => Alert.alert('Próximamente', `Esta acción se construye en ${phase} del roadmap.`);

export default function HoyScreen() {
  const { hasCup, cycleIrregular, isOffline, micDenied } = useScenarioFlags();

  return (
    <TabScreenShell>
      {isOffline ? (
        <View className="rounded-xl bg-warning-soft px-3 py-2.5">
          <Text className="text-center font-semibold text-xs text-warning">
            Sin conexión — verás tu última información guardada.
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={() => router.push('/(tabs)/vera')}
        className="flex-row items-center gap-3.5 rounded-3xl border border-primary-border bg-primary-xsoft p-5"
      >
        <VeraAvatar state="idle" size={56} radiusPct={26} />
        <View className="flex-1">
          <Text className="font-bold text-sm text-ink">
            {micDenied ? 'Vera está lista para escucharte por texto.' : 'Te preparé una rutina de respiración de 3 minutos.'}
          </Text>
          <Text className="mt-1 font-semibold text-xs text-primary-dark">Hablar con Vera →</Text>
        </View>
      </Pressable>

      <View className="gap-3.5 rounded-3xl border border-border bg-white p-[18px]">
        <View>
          <Text className="font-semibold text-[11px] uppercase text-ink-secondary">Tu ciclo</Text>
          <Text className="mt-1 font-extrabold text-base text-ink">
            {cycleIrregular
              ? 'Necesito más registros para estimar mejor tu próximo periodo.'
              : 'Tu periodo podría iniciar en 4 a 6 días.'}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1">
            <AppButton label="Registrar hoy" onPress={comingSoon('la Fase 3 (Check-in diario)')} />
          </View>
          <View className="flex-1">
            <AppButton
              label="Ver calendario"
              variant="secondary"
              onPress={() => router.push('/(tabs)/calendario')}
            />
          </View>
        </View>
      </View>

      <View className="gap-2 rounded-3xl border border-border bg-white p-[18px]">
        <Text className="font-semibold text-[11px] uppercase text-ink-secondary">Tu rutina</Text>
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="font-bold text-sm text-ink">Respiración 4-7-8</Text>
            <Text className="mt-0.5 font-medium text-xs text-ink-secondary">3 min</Text>
          </View>
          <AppButton label="Empezar" variant="dark" size="sm" onPress={comingSoon('la Fase 5 (Rutinas)')} />
        </View>
      </View>

      {hasCup ? (
        <Pressable
          onPress={comingSoon('la Fase 4 (Modo Primera Copa)')}
          className="flex-row items-center gap-3.5 rounded-3xl border border-border bg-white p-[18px]"
        >
          <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-primary-soft">
            <Text className="font-bold text-[11px] text-primary-dark">40%</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-sm text-ink">Modo Primera Copa</Text>
            <Text className="mt-0.5 font-medium text-xs text-ink-secondary">Prepárate — continúa donde quedaste</Text>
          </View>
        </Pressable>
      ) : null}

      <HealthWarning
        tone="warning"
        message="Vista previa del design system — las pantallas completas de Hoy llegan en la Fase 3 del roadmap."
      />

      <AppButton
        label="Necesito ayuda ahora"
        variant="danger-outline"
        onPress={comingSoon('la Fase 4 (Modo Rescate)')}
      />
    </TabScreenShell>
  );
}
