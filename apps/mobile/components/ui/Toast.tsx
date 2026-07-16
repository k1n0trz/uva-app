import { Text, View } from 'react-native';
import { useToastStore } from '../../stores/toastStore';

/** Renders the active toast. Mount once, inside the app shell. */
export function Toast() {
  const message = useToastStore((s) => s.message);
  if (!message) return null;

  return (
    <View
      pointerEvents="none"
      className="absolute bottom-[100px] left-5 right-5 z-50 rounded-xl bg-ink px-4 py-3"
      accessibilityLiveRegion="polite"
    >
      <Text className="text-center font-semibold text-[13px] text-white">{message}</Text>
    </View>
  );
}
