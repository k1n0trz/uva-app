import { PropsWithChildren } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

type Props = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  maxHeightPct?: number;
}>;

/** Bottom-anchored drawer matching the prototype's check-in / product-detail sheets. */
export function BottomSheet({ visible, onClose, maxHeightPct = 88, children }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
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
