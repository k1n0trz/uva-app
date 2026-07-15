import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, AppInput } from '../../components/ui';
import { AuthProvider, mockAuthService } from '../../services/auth';

type LoginForm = {
  email: string;
  password: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Auth entry — mirrors the prototype's isAuth screen. All flows are mock
 *  (services/auth) and land on the app. Real auth is Codex's Fase 2 backend. */
export default function Login() {
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<LoginForm>({ defaultValues: { email: '', password: '' } });

  const enterApp = () => router.replace('/(tabs)/hoy');

  const onSubmit = async (_values: LoginForm) => {
    setBusy('email');
    try {
      await mockAuthService.loginWithPassword(_values.email, _values.password);
      enterApp();
    } finally {
      setBusy(null);
    }
  };

  const withProvider = (provider: AuthProvider) => async () => {
    setBusy(provider);
    try {
      await mockAuthService.loginWithProvider(provider);
      enterApp();
    } finally {
      setBusy(null);
    }
  };

  const asGuest = async () => {
    setBusy('guest');
    try {
      await mockAuthService.continueAsGuest();
      enterApp();
    } finally {
      setBusy(null);
    }
  };

  return (
    <View
      className="flex-1 justify-center gap-3.5 bg-surface px-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
    >
      <View className="mb-2.5 items-center">
        <Image source={require('../../assets/brand/logo-uvaapp.png')} style={{ width: 118, height: 34 }} resizeMode="contain" />
        <Text className="mt-2 font-semibold text-[13px] text-ink-secondary">Crea tu cuenta o continúa como invitada</Text>
      </View>

      <Controller
        control={control}
        name="email"
        rules={{ pattern: { value: EMAIL_RE, message: 'Correo no válido' } }}
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <AppInput
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <AppInput
            placeholder="Contraseña"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <AppButton label="Ingresar" fullWidth loading={busy === 'email'} onPress={handleSubmit(onSubmit)} />

      <Pressable
        onPress={() => Alert.alert('Recuperar acceso', 'Verificación por código — se conecta con el backend en la Fase 2.')}
        accessibilityRole="button"
        className="items-center"
      >
        <Text className="font-semibold text-xs text-primary-dark">¿Olvidaste tu contraseña?</Text>
      </Pressable>

      <View className="my-1.5 flex-row items-center gap-2.5">
        <View className="h-px flex-1 bg-border" />
        <Text className="font-semibold text-[11px] text-ink-secondary">o continúa con</Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1">
          <AppButton label="Google" variant="outline" loading={busy === 'google'} onPress={withProvider('google')} />
        </View>
        <View className="flex-1">
          <AppButton label="Apple" variant="outline" loading={busy === 'apple'} onPress={withProvider('apple')} />
        </View>
        <View className="flex-1">
          <AppButton label="Facebook" variant="outline" loading={busy === 'facebook'} onPress={withProvider('facebook')} />
        </View>
      </View>

      <AppButton
        label="Continuar con número de teléfono"
        variant="ghost"
        onPress={() => Alert.alert('Teléfono', 'Código OTP — se conecta con el backend en la Fase 2.')}
      />

      <Pressable onPress={asGuest} accessibilityRole="button" className="items-center py-2">
        <Text className="font-bold text-[13px] text-primary-dark underline">Continuar sin cuenta</Text>
      </Pressable>
    </View>
  );
}
