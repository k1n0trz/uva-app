import { Text, View } from 'react-native';
import { AppButton } from './AppButton';

type Props = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

/** Generic error block for failed API/loading states, with an optional retry. */
export function ErrorState({
  title = 'Algo no salió bien',
  description = 'No pudimos cargar esta información. Intenta de nuevo.',
  onRetry,
}: Props) {
  return (
    <View className="items-center gap-2 rounded-3xl bg-danger-soft px-6 py-8">
      <Text className="text-center font-bold text-sm text-ink">{title}</Text>
      <Text className="text-center font-medium text-xs leading-5 text-ink-secondary">{description}</Text>
      {onRetry ? (
        <View className="mt-2">
          <AppButton label="Reintentar" variant="dark" size="sm" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}
