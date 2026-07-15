import { router } from 'expo-router';
import { Animated, Image, Pressable, Text, View } from 'react-native';
import { AppButton } from '../components/ui';
import { useBreatheScale } from '../hooks/useBreatheScale';
import { useReduceMotion } from '../hooks/useReduceMotion';

/** In-app splash (post JS-load), matches the prototype's `isSplash` screen. */
export default function Splash() {
  const reduceMotion = useReduceMotion();
  const scale = useBreatheScale(!reduceMotion, 1900);

  return (
    <View className="flex-1 items-center justify-center gap-6 bg-surface px-8">
      <Animated.View style={{ transform: [{ scale }] }}>
        <Image
          source={require('../assets/brand/logo-uvaapp.png')}
          style={{ width: 210, height: 92 }}
          resizeMode="contain"
          accessibilityLabel="UVA App"
        />
      </Animated.View>
      <AppButton label="Comenzar" onPress={() => router.replace('/(onboarding)/intro')} />

      {__DEV__ ? (
        <Pressable
          onPress={() => router.replace('/(tabs)/hoy')}
          accessibilityRole="button"
          className="absolute bottom-10"
        >
          <Text className="font-semibold text-xs text-ink-faint underline">Dev: saltar a la app →</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
