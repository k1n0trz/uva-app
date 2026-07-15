import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  greetingLabel: string;
  greetingName: string;
  userInitial: string;
  onPressProfile: () => void;
};

/** Pink gradient header shown at the top of the "Hoy" tab, mirrors the prototype's shell header. */
export function AppHeader({ greetingLabel, greetingName, userInitial, onPressProfile }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={['#CD2F62', '#B8285A']}
      style={{ paddingTop: insets.top + 14, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
      className="flex-row items-center justify-between px-5 pb-5"
    >
      <View>
        <Text className="font-semibold text-[11px] uppercase tracking-wide text-white/75">{greetingLabel}</Text>
        <Text className="font-extrabold text-lg text-white">{greetingName}</Text>
      </View>
      <Pressable
        onPress={onPressProfile}
        accessibilityRole="button"
        accessibilityLabel="Abrir perfil"
        className="h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15"
      >
        <Text className="font-bold text-sm text-white">{userInitial}</Text>
      </Pressable>
    </LinearGradient>
  );
}
