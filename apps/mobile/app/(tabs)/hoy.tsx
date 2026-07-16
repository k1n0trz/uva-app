import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { DailyCheckIn } from '../../components/cycle/DailyCheckIn';
import { TabScreenShell } from '../../components/nav';
import { AppButton, LoadingSkeleton, ProgressRing } from '../../components/ui';
import { AbrilAvatar } from '../../components/abril';
import { ASSISTANT_NAME } from '../../constants/brand';
import { todayIso } from '../../lib/date';
import { mockCycleService } from '../../services/cycle';
import { useCheckinStore, isEmptyCheckIn, isPartialCheckIn } from '../../stores/checkinStore';
import { useFirstCupStore } from '../../stores/firstCupStore';
import { useScenarioFlags } from '../../stores/scenarioStore';

const comingSoon = (phase: string) => () =>
  Alert.alert('Próximamente', `Esta sección se construye en ${phase} del roadmap.`);

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <View className={`rounded-3xl border border-border bg-white p-[18px] ${className}`}>{children}</View>;
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return <Text className="font-semibold text-[11px] uppercase text-ink-secondary">{children}</Text>;
}

export default function HoyScreen() {
  const { hasCup, hasProducts, isOffline, micDenied, isNewUser, cycleDataState } = useScenarioFlags();
  const [checkinOpen, setCheckinOpen] = useState(false);
  const iso = todayIso();
  const savedToday = useCheckinStore((s) => s.byDate[iso]);
  const openDraftFor = useCheckinStore((s) => s.openDraftFor);

  const predictionQuery = useQuery({
    queryKey: ['cycle', 'prediction', cycleDataState],
    queryFn: () => mockCycleService.getPrediction(cycleDataState),
  });

  const logged = savedToday && !isEmptyCheckIn(savedToday);
  const partial = savedToday && isPartialCheckIn(savedToday);

  const badge = logged
    ? partial
      ? { label: 'Registro parcial', bg: 'bg-warning-soft', text: 'text-warning' }
      : { label: 'Registrado hoy', bg: 'bg-success-soft', text: 'text-success' }
    : { label: 'Sin registrar', bg: 'bg-primary-soft', text: 'text-primary-dark' };

  const openCheckin = () => {
    openDraftFor(iso);
    setCheckinOpen(true);
  };

  const cupStages = useFirstCupStore((s) => s.stages);
  const cupPercent = Math.round((cupStages.filter((s) => s.done).length / cupStages.length) * 100);

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
        onPress={() => router.push('/(tabs)/abril')}
        accessibilityRole="button"
        className="flex-row items-center gap-3.5 rounded-3xl border border-primary-border bg-primary-xsoft p-5"
      >
        <AbrilAvatar state="idle" size={56} radiusPct={26} />
        <View className="flex-1">
          <Text className="font-bold text-sm text-ink">
            {micDenied
              ? `${ASSISTANT_NAME} está lista para escucharte por texto.`
              : 'Te preparé una rutina de respiración de 3 minutos.'}
          </Text>
          <Text className="mt-1 font-semibold text-xs text-primary-dark">Hablar con {ASSISTANT_NAME} →</Text>
        </View>
      </Pressable>

      {/* Tu ciclo — prediction is always a range and never deterministic (ficha §12.3) */}
      <Card className="gap-3.5">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1">
            <CardLabel>Tu ciclo</CardLabel>
            {predictionQuery.isLoading || !predictionQuery.data ? (
              <View className="mt-2 gap-1.5">
                <LoadingSkeleton height={14} width="90%" />
                <LoadingSkeleton height={14} width="60%" />
              </View>
            ) : (
              <Text className="mt-1 font-extrabold text-base leading-5 text-ink">{predictionQuery.data.message}</Text>
            )}
          </View>
          <View className={`rounded-full px-2.5 py-1 ${badge.bg}`}>
            <Text className={`font-semibold text-[11px] ${badge.text}`}>{badge.label}</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1">
            <AppButton label={logged ? 'Editar registro' : 'Registrar hoy'} onPress={openCheckin} />
          </View>
          <View className="flex-1">
            <AppButton label="Ver calendario" variant="secondary" onPress={() => router.push('/(tabs)/calendario')} />
          </View>
        </View>
      </Card>

      {/* Tu cuerpo hoy — patterns from the user's own logs, never universal hormone claims */}
      <Card className="gap-1.5">
        <CardLabel>Tu cuerpo hoy</CardLabel>
        <Text className="font-medium text-[13px] leading-5 text-ink">
          {isNewUser
            ? 'Cuando registres cómo te sientes, aquí verás tus propios patrones.'
            : 'En tus últimos ciclos registraste mayor flujo durante la segunda noche. Hoy es un buen día para ir con calma.'}
        </Text>
      </Card>

      <Card className="gap-2">
        <CardLabel>Tu rutina</CardLabel>
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="font-bold text-sm text-ink">Respiración 4-7-8</Text>
            <Text className="mt-0.5 font-medium text-xs text-ink-secondary">3 min</Text>
          </View>
          <AppButton label="Empezar" variant="dark" size="sm" onPress={() => router.push('/routine/r2')} />
        </View>
      </Card>

      {hasCup ? (
        <Pressable
          onPress={() => router.push('/first-cup')}
          accessibilityRole="button"
          className="flex-row items-center gap-3.5 rounded-3xl border border-border bg-white p-[18px]"
        >
          <ProgressRing percent={cupPercent} label={`Modo Primera Copa, ${cupPercent}% completado`} />
          <View className="flex-1">
            <Text className="font-bold text-sm text-ink">Modo Primera Copa</Text>
            <Text className="mt-0.5 font-medium text-xs text-ink-secondary">Prepárate — continúa donde quedaste</Text>
          </View>
        </Pressable>
      ) : null}

      {/* Prepárate */}
      <View className="gap-3 rounded-3xl border border-primary-border bg-primary-xsoft p-[18px]">
        <Text className="font-semibold text-[11px] uppercase text-primary-dark">Prepárate</Text>
        <Text className="font-medium text-[13px] leading-5 text-ink">
          {hasProducts
            ? 'Con base en tu ciclo, quizá quieras tener a mano estos productos:'
            : 'No necesitas tener productos UVA para usar la app. Si quieres, explora opciones cuando te sirva.'}
        </Text>
        {hasProducts ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
            {['Copa UVA 2 talla A', 'Bolas Kegel UVA'].map((name) => (
              <View key={name} style={{ width: 96 }}>
                <View className="h-[72px] items-center justify-center rounded-xl border border-primary-border bg-primary-soft">
                  <Text className="font-semibold text-[9px] text-primary-dark">producto</Text>
                </View>
                <Text className="mt-1.5 text-center font-semibold text-[11px] text-ink">{name}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <AppButton label="Ver la tienda" variant="secondary" size="sm" onPress={() => router.push('/(tabs)/tienda')} />
        )}
      </View>

      {/* Commercial recommendation: optional, contextual and clearly labeled (brief §9 / ficha §17.4).
          Never shown inside Modo Rescate or sensitive conversations. */}
      {!isNewUser ? (
        <View className="flex-row items-center gap-3 rounded-3xl border border-dashed border-border bg-white p-4">
          <View className="rounded-full bg-primary-soft px-2 py-1">
            <Text className="font-bold text-[9px] text-primary-dark">PROMO</Text>
          </View>
          <Text className="flex-1 font-medium text-[13px] text-ink">
            20% de descuento en Kits Cuídate UVA esta semana.
          </Text>
          <Pressable onPress={() => router.push('/(tabs)/tienda')} accessibilityRole="button">
            <Text className="font-bold text-xs text-primary-dark">Ver</Text>
          </Pressable>
        </View>
      ) : null}

      <AppButton label="Necesito ayuda ahora" variant="danger-outline" onPress={() => router.push('/rescue')} />

      <DailyCheckIn
        visible={checkinOpen}
        onClose={() => setCheckinOpen(false)}
        isoDate={iso}
        dayLabel="hoy"
        isOffline={isOffline}
        micDenied={micDenied}
      />
    </TabScreenShell>
  );
}
