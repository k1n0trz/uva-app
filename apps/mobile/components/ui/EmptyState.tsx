import { ReactNode } from 'react';
import { Text, View } from 'react-native';

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

/** Generic empty-state block: "sin registros", "sin productos", etc. */
export function EmptyState({ title, description, action }: Props) {
  return (
    <View className="items-center gap-2 rounded-3xl border border-dashed border-border px-6 py-10">
      <Text className="text-center font-bold text-sm text-ink">{title}</Text>
      {description ? (
        <Text className="text-center font-medium text-xs leading-5 text-ink-secondary">{description}</Text>
      ) : null}
      {action ? <View className="mt-2">{action}</View> : null}
    </View>
  );
}
