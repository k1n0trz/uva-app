import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, Checkbox } from '../../components/ui';
import { ASSISTANT_NAME } from '../../constants/brand';
import { useOnboardingStore } from '../../stores/onboardingStore';

/**
 * Privacy consent — two independent toggles. The general consent gates
 * continuing; the sensitive-data consent is separate and optional here
 * (prototype isOnboardPrivacy + ficha §9 / §25.1: autorización expresa e
 * informada, con consentimiento independiente para datos sensibles).
 */
export default function OnboardingPrivacy() {
  const insets = useSafeAreaInsets();
  const { consentGeneral, consentSensitive, setConsentGeneral, setConsentSensitive } = useOnboardingStore();

  return (
    <View
      className="flex-1 justify-between bg-surface px-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
    >
      <Text className="font-bold text-xs text-primary-dark">Antes de comenzar</Text>

      <View className="gap-4">
        <Text className="font-extrabold text-xl text-ink">Tu privacidad primero</Text>
        <Text className="font-medium text-sm leading-6 text-ink-secondary">
          Usamos tus datos únicamente para acompañarte mejor. Puedes revisar, corregir o eliminar lo que {ASSISTANT_NAME}{' '}
          recuerda cuando quieras.
        </Text>
        <Checkbox
          checked={consentGeneral}
          onToggle={() => setConsentGeneral(!consentGeneral)}
          label="Acepto el uso de mis datos generales (nombre, preferencias, uso de la app)."
        />
        <Checkbox
          checked={consentSensitive}
          onToggle={() => setConsentSensitive(!consentSensitive)}
          label="Acepto el uso de mis datos sensibles (ciclo, síntomas, salud íntima) para personalizar recomendaciones."
        />
      </View>

      <AppButton
        label="Continuar"
        fullWidth
        disabled={!consentGeneral}
        onPress={() => router.push('/(auth)/login')}
      />
    </View>
  );
}
