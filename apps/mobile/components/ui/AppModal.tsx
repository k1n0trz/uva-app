import { PropsWithChildren } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

type Props = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title?: string;
}>;

/** Centered dialog for short confirmations (e.g. "eliminar cuenta"). For the
 * bottom-anchored drawer pattern (check-in, product detail) use BottomSheet.
 *
 * Returns null when closed for the same reason as BottomSheet — a closed
 * react-native-web Modal stays in the accessibility tree and tab order. */
export function AppModal({ visible, onClose, title, children }: Props) {
  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-ink/35 px-6">
        <Pressable className="absolute inset-0" onPress={onClose} accessibilityLabel="Cerrar" />
        <View className="w-full max-w-[360px] rounded-3xl bg-white p-5">
          {title ? <Text className="mb-3 font-extrabold text-lg text-ink">{title}</Text> : null}
          {children}
        </View>
      </View>
    </Modal>
  );
}
