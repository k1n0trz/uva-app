import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '../../components/ui';
import { VeraAvatar } from '../../components/vera';
import { useOnboardingStore } from '../../stores/onboardingStore';

/** "Hola, soy Vera" — matches the prototype's isOnboardIntro screen. */
export default function OnboardingIntro() {
  const insets = useSafeAreaInsets();
  const setVoiceOn = useOnboardingStore((s) => s.setVoiceOn);
  const setStep = useOnboardingStore((s) => s.setStep);

  const start = (voice: boolean) => {
    setVoiceOn(voice);
    setStep(0);
    router.push('/(onboarding)/chat');
  };

  return (
    <View
      className="flex-1 justify-between bg-surface px-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
    >
      <View />

      <View className="items-center gap-[18px]">
        <VeraAvatar state="greeting" size={132} radiusPct={30} />
        <View className="items-center">
          <Text className="font-extrabold text-xl text-ink">Hola, soy Vera</Text>
          <Text className="mt-2.5 max-w-[280px] text-center font-medium text-sm leading-6 text-ink-secondary">
            Estoy aquí para acompañarte. No solo te digo cuándo llega tu periodo — te ayudo a prepararte, cuidarte y
            entender qué funciona para ti.
          </Text>
        </View>
      </View>

      <View className="gap-2.5">
        <AppButton label="Hablar con Vera" fullWidth onPress={() => start(true)} />
        <AppButton label="Prefiero escribir" variant="secondary" fullWidth onPress={() => start(false)} />
      </View>
    </View>
  );
}
