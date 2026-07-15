import { Text, View } from 'react-native';

type Tone = 'warning' | 'danger';

type Props = {
  message: string;
  tone?: Tone;
};

const bgByTone: Record<Tone, string> = {
  warning: 'bg-warning-soft',
  danger: 'bg-danger-soft',
};

const textByTone: Record<Tone, string> = {
  warning: 'text-warning',
  danger: 'text-danger',
};

/**
 * Reusable health/safety callout — e.g. "si el dolor es intenso o
 * persistente, pausa el uso y consulta a un profesional de salud".
 * Never phrase this as a diagnosis (ficha técnica §25.4).
 */
export function HealthWarning({ message, tone = 'danger' }: Props) {
  return (
    <View className={['rounded-xl px-3 py-2.5', bgByTone[tone]].join(' ')}>
      <Text className={['font-semibold text-xs leading-5', textByTone[tone]].join(' ')}>{message}</Text>
    </View>
  );
}
