import { Pressable, Text, View } from 'react-native';
import { WEEKDAY_LABELS, monthGrid, monthLabel } from '../../lib/date';
import type { MonthCycleData } from '../../services/cycle';

type Props = {
  year: number;
  /** 0-indexed, matching JS Date. */
  month: number;
  data: MonthCycleData;
  /** Day number of "today", or null when viewing another month. */
  today: number | null;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  /** Days that have a saved check-in — shown with a dot, so state isn't color-only. */
  loggedDays?: number[];
};

type DayVisual = {
  container: string;
  text: string;
  /** Screen-reader description — never rely on color alone (brief §22). */
  a11y: string;
};

function dayVisual(day: number, data: MonthCycleData, isToday: boolean, isSelected: boolean): DayVisual {
  const registered = data.registeredDays.includes(day);
  const estimated = data.estimatedDays.includes(day);

  let container = 'bg-white border border-border';
  let text = 'text-ink';
  let a11y = 'sin registros';

  if (registered) {
    container = 'bg-primary border border-primary';
    text = 'text-white';
    a11y = 'periodo registrado';
  } else if (estimated) {
    container = 'bg-primary-soft border border-primary-border';
    text = 'text-primary-dark';
    a11y = 'estimado';
  }

  if (isToday) {
    container = `${container.replace(/border-\S+/g, '')} border-2 border-ink`;
    a11y += ', hoy';
  }
  if (isSelected) {
    container = `${container} opacity-70`;
  }

  return { container, text, a11y };
}

/** Month grid computed from the real calendar (the design prototype hardcoded July 2026). */
export function PeriodCalendar({ year, month, data, today, selectedDay, onSelectDay, loggedDays = [] }: Props) {
  const cells = monthGrid(year, month);

  return (
    <View>
      <Text className="my-3.5 font-extrabold text-lg text-ink">{monthLabel(year, month)}</Text>

      <View className="mb-1.5 flex-row">
        {WEEKDAY_LABELS.map((label, i) => (
          <View key={`${label}-${i}`} className="flex-1 items-center">
            <Text className="font-semibold text-[10px] text-ink-secondary">{label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((day, i) => {
          if (day === null) return <View key={`blank-${i}`} style={{ width: `${100 / 7}%` }} className="p-0.5" />;

          const isToday = today === day;
          const isSelected = selectedDay === day;
          const { container, text, a11y } = dayVisual(day, data, isToday, isSelected);
          const isLogged = loggedDays.includes(day);

          return (
            <View key={day} style={{ width: `${100 / 7}%` }} className="p-0.5">
              <Pressable
                onPress={() => onSelectDay(day)}
                accessibilityRole="button"
                accessibilityLabel={`${day}, ${a11y}${isLogged ? ', con registro' : ''}`}
                accessibilityState={{ selected: isSelected }}
                className={['aspect-square items-center justify-center rounded-[10px]', container].join(' ')}
              >
                <Text className={['font-bold text-xs', text].join(' ')}>{day}</Text>
                {isLogged ? (
                  <View
                    className={['absolute bottom-1 h-1 w-1 rounded-full', text === 'text-white' ? 'bg-white' : 'bg-primary'].join(' ')}
                  />
                ) : null}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/** Visual legend. Each state also carries a text label, so meaning never
 *  depends on color alone (brief §22: "no depender solamente del color"). */
export function CalendarLegend() {
  return (
    <View className="my-4 flex-row flex-wrap gap-3.5">
      <View className="flex-row items-center gap-1.5">
        <View className="h-2.5 w-2.5 rounded-full bg-primary" />
        <Text className="font-medium text-[11px] text-ink-secondary">Periodo registrado</Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <View className="h-2.5 w-2.5 rounded-full border border-primary-border bg-primary-soft" />
        <Text className="font-medium text-[11px] text-ink-secondary">Estimado</Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <View className="h-2.5 w-2.5 rounded-full border-2 border-ink" />
        <Text className="font-medium text-[11px] text-ink-secondary">Hoy</Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <View className="h-1 w-1 rounded-full bg-primary" />
        <Text className="font-medium text-[11px] text-ink-secondary">Con registro</Text>
      </View>
    </View>
  );
}
