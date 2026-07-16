import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { CalendarLegend, PeriodCalendar } from '../../components/cycle/PeriodCalendar';
import { DailyCheckIn } from '../../components/cycle/DailyCheckIn';
import { TabScreenShell } from '../../components/nav';
import { AppButton, EmptyState, LoadingSkeleton } from '../../components/ui';
import { dayLabel, isoDate, todayParts } from '../../lib/date';
import { mockCycleService } from '../../services/cycle';
import { useCheckinStore } from '../../stores/checkinStore';
import { useScenarioFlags } from '../../stores/scenarioStore';
import { useToastStore } from '../../stores/toastStore';

export default function CalendarioScreen() {
  const { cycleDataState, isOffline, micDenied } = useScenarioFlags();
  const { year, month, day: todayDay } = todayParts();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [checkinOpen, setCheckinOpen] = useState(false);
  const showToast = useToastStore((s) => s.show);
  const byDate = useCheckinStore((s) => s.byDate);
  const openDraftFor = useCheckinStore((s) => s.openDraftFor);

  const monthQuery = useQuery({
    queryKey: ['cycle', 'month', year, month, cycleDataState],
    queryFn: () => mockCycleService.getMonthData(year, month, cycleDataState),
  });
  const historyQuery = useQuery({
    queryKey: ['cycle', 'history', cycleDataState],
    queryFn: () => mockCycleService.listCycleHistory(cycleDataState),
  });
  const predictionQuery = useQuery({
    queryKey: ['cycle', 'prediction', cycleDataState],
    queryFn: () => mockCycleService.getPrediction(cycleDataState),
  });

  const data = monthQuery.data;

  // Days in this month that already have a saved check-in.
  const loggedDays = Object.keys(byDate)
    .filter((iso) => iso.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
    .map((iso) => Number(iso.slice(-2)));

  const selectedIso = selectedDay ? isoDate(year, month, selectedDay) : null;

  const selectedInfo = (() => {
    if (!selectedDay || !data) return '';
    const saved = selectedIso ? byDate[selectedIso] : undefined;
    if (saved) {
      const parts = [
        saved.flow && `Flujo ${saved.flow.toLowerCase()}`,
        saved.pain && saved.pain !== 'Sin dolor' && `dolor ${saved.pain.toLowerCase()}`,
        saved.symptoms.length > 0 && saved.symptoms.join(', ').toLowerCase(),
        saved.product && saved.product !== 'Ninguno' && `producto: ${saved.product.toLowerCase()}`,
      ].filter(Boolean);
      return parts.length > 0 ? `${parts.join(' · ')}.` : 'Registro guardado sin detalles.';
    }
    if (data.registeredDays.includes(selectedDay)) return 'Periodo registrado.';
    if (data.estimatedDays.includes(selectedDay)) return 'Día dentro del rango estimado de tu próximo periodo.';
    return 'Sin registros para este día.';
  })();

  const openCheckinFor = (iso: string) => {
    openDraftFor(iso);
    setCheckinOpen(true);
  };

  return (
    <TabScreenShell>
      {monthQuery.isLoading || !data ? (
        <View className="gap-2">
          <LoadingSkeleton height={28} width="45%" />
          <LoadingSkeleton height={240} radius={16} />
        </View>
      ) : (
        <>
          <PeriodCalendar
            year={year}
            month={month}
            data={data}
            today={todayDay}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            loggedDays={loggedDays}
          />
          <CalendarLegend />

          {selectedDay && selectedIso ? (
            <View className="mb-3.5 gap-2.5 rounded-2xl border border-border bg-white p-4">
              <Text className="font-bold text-sm text-ink">{dayLabel(selectedDay, month)}</Text>
              <Text className="font-medium text-[13px] leading-5 text-ink-secondary">{selectedInfo}</Text>
              <View className="flex-row flex-wrap gap-2">
                <AppButton
                  label={byDate[selectedIso] ? 'Editar registro' : 'Registrar día'}
                  variant="secondary"
                  size="sm"
                  onPress={() => openCheckinFor(selectedIso)}
                />
                <AppButton
                  label="Registrar inicio o fin de periodo"
                  variant="outline"
                  size="sm"
                  onPress={async () => {
                    await mockCycleService.registerPeriodEdge(selectedIso, 'start');
                    showToast('Registro guardado');
                  }}
                />
              </View>
            </View>
          ) : null}

          <View className="gap-1.5 rounded-2xl border border-border bg-white p-4">
            <Text className="mb-1 font-bold text-sm text-ink">Historial de ciclos</Text>
            {historyQuery.data && historyQuery.data.length > 0 ? (
              <>
                {historyQuery.data.map((entry) => (
                  <View key={entry.range} className="flex-row justify-between border-b border-border py-2">
                    <Text className="font-medium text-[13px] text-ink">{entry.range}</Text>
                    <Text className="font-medium text-[13px] text-ink-secondary">{entry.lengthDays} días</Text>
                  </View>
                ))}
                {predictionQuery.data ? (
                  <Text className="mt-2.5 font-medium text-xs leading-5 text-ink-secondary">
                    {predictionQuery.data.note}
                  </Text>
                ) : null}
              </>
            ) : (
              <EmptyState
                title="Aún no hay ciclos registrados"
                description="Cuando registres tu periodo, aquí verás tu historial y podré estimar mejor."
              />
            )}
          </View>

          {isOffline ? (
            <View className="rounded-xl bg-warning-soft px-3 py-2.5">
              <Text className="text-center font-semibold text-xs text-warning">
                Sin conexión — verás tu última información guardada.
              </Text>
            </View>
          ) : null}
        </>
      )}

      {selectedIso ? (
        <DailyCheckIn
          visible={checkinOpen}
          onClose={() => setCheckinOpen(false)}
          isoDate={selectedIso}
          dayLabel={selectedDay ? dayLabel(selectedDay, month) : 'hoy'}
          isOffline={isOffline}
          micDenied={micDenied}
        />
      ) : null}
    </TabScreenShell>
  );
}
