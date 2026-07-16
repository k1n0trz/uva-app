import { PropsWithChildren } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

type Props = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  maxHeightPct?: number;
}>;

/**
 * Bottom-anchored drawer matching the prototype's check-in / product-detail sheets.
 *
 * We return null when closed instead of relying on `<Modal visible={false}>`:
 * react-native-web keeps a closed Modal mounted, which leaves its controls in
 * the accessibility tree and the keyboard tab order even though nothing is
 * visible on screen (brief §22 requires screen-reader and keyboard support).
 */
export function BottomSheet({ visible, onClose, maxHeightPct = 88, children }: Props) {
  if (!visible) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-ink/35">
        <Pressable className="absolute inset-0" onPress={onClose} accessibilityLabel="Cerrar" />
        <View className="rounded-t-4xl bg-white" style={{ maxHeight: `${maxHeightPct}%` }}>
          <View className="mx-auto mt-3.5 h-1.5 w-9 rounded-full bg-border" />
          <ScrollView
            contentContainerClassName="px-5 pb-8 pt-4"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
