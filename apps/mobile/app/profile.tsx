import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AbrilAvatar } from '../components/abril';
import { AppButton, AppModal, ChipGroup } from '../components/ui';
import { ASSISTANT_NAME } from '../constants/brand';
import { colors } from '../constants/theme';
import { useMemories } from '../hooks/useMemories';
import { goBackOr } from '../lib/nav';
import { useChatStore } from '../stores/chatStore';
import { useMemoryStore } from '../stores/memoryStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useScenarioFlags } from '../stores/scenarioStore';
import { useToastStore } from '../stores/toastStore';

type Row = {
  label: string;
  onPress: () => void;
  /** Right-hand hint, e.g. the current value. */
  value?: string;
  danger?: boolean;
};

function SettingRow({ row }: { row: Row }) {
  return (
    <Pressable
      onPress={row.onPress}
      accessibilityRole="button"
      accessibilityLabel={row.value ? `${row.label}. ${row.value}` : row.label}
      className="min-h-[44px] flex-row items-center justify-between gap-3 border-b border-border py-3.5"
    >
      <Text className={['font-semibold text-sm', row.danger ? 'text-danger' : 'text-ink'].join(' ')}>{row.label}</Text>
      <View className="flex-row items-center gap-1.5">
        {row.value ? <Text className="font-medium text-xs text-ink-secondary">{row.value}</Text> : null}
        <Text className="text-ink-faint">›</Text>
      </View>
    </Pressable>
  );
}

function ToggleRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3 border-b border-border py-3">
      <View className="flex-1">
        <Text className="font-semibold text-sm text-ink">{label}</Text>
        {hint ? <Text className="mt-0.5 font-medium text-[11px] leading-4 text-ink-secondary">{hint}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ true: colors.primary, false: colors.border }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const soon = (what: string, phase: string) => () =>
  useToastStore.getState().show(`${what} — se construye en ${phase}.`);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { isNewUser } = useScenarioFlags();
  const memories = useMemories();
  const memoryActive = useMemoryStore((s) => s.active);
  const { answers, setAnswer } = useOnboardingStore();
  const { speechEnabled, toggleSpeech, replyLength, setReplyLength } = useChatStore();
  const showToast = useToastStore((s) => s.show);

  const [discreetMode, setDiscreetMode] = useState(false);
  const [biometrics, setBiometrics] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const name = answers.name.trim() || (isNewUser ? 'Bienvenida' : 'Laura');

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 border-b border-border bg-white px-5 py-4">
        <Pressable
          onPress={() => goBackOr('/(tabs)/hoy')}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-white"
        >
          <Text className="font-bold text-sm text-ink-secondary">‹</Text>
        </Pressable>
        <Text className="font-extrabold text-base text-ink">Perfil</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* What Abril knows — the headline section (brief §18) */}
        <Pressable
          onPress={() => router.push('/memory')}
          accessibilityRole="button"
          className="flex-row items-center gap-3.5 rounded-3xl border border-primary-border bg-primary-xsoft p-4"
        >
          <AbrilAvatar state="idle" size={48} />
          <View className="flex-1">
            <Text className="font-bold text-sm text-primary-dark">Lo que {ASSISTANT_NAME} sabe de mí</Text>
            <Text className="mt-0.5 font-medium text-[12px] leading-4 text-ink-secondary">
              {memoryActive
                ? `${memories.length} ${memories.length === 1 ? 'cosa recordada' : 'cosas recordadas'} · ver, corregir o eliminar`
                : 'Memoria desactivada · ver lo que quedó guardado'}
            </Text>
          </View>
          <Text className="text-ink-faint">›</Text>
        </Pressable>

        <View>
          <Text className="mb-1 font-bold text-[11px] uppercase text-ink-secondary">Sobre ti</Text>
          <SettingRow row={{ label: 'Mis objetivos', value: answers.focus || 'Sin definir', onPress: soon('Mis objetivos', 'una fase posterior') }} />
          <SettingRow row={{ label: 'Mi ciclo', onPress: () => router.replace('/(tabs)/calendario') }} />
          <SettingRow row={{ label: 'Mis productos', onPress: () => router.push('/my-products') }} />
        </View>

        <View>
          <Text className="mb-1 font-bold text-[11px] uppercase text-ink-secondary">{ASSISTANT_NAME}</Text>
          <SettingRow
            row={{
              label: `Preferencias de ${ASSISTANT_NAME}`,
              value: answers.abrilStyle || replyLength,
              onPress: () => setStyleOpen(true),
            }}
          />
          <ToggleRow
            label="Voz y audio"
            hint={`Si la apagas, ${ASSISTANT_NAME} responde solo por texto. El micrófono sigue disponible.`}
            value={speechEnabled}
            onChange={() => {
              toggleSpeech();
              showToast(speechEnabled ? 'Voz desactivada' : 'Voz activada');
            }}
          />
        </View>

        <View>
          <Text className="mb-1 font-bold text-[11px] uppercase text-ink-secondary">Privacidad y seguridad</Text>
          <SettingRow row={{ label: 'Notificaciones', value: answers.reminders || 'Normal', onPress: soon('Notificaciones', 'la Fase 10') }} />
          <ToggleRow
            label="Modo discreto"
            hint="Oculta detalles sensibles en notificaciones y en la pantalla de bloqueo."
            value={discreetMode}
            onChange={(v) => {
              setDiscreetMode(v);
              showToast(v ? 'Modo discreto activado' : 'Modo discreto desactivado');
            }}
          />
          <ToggleRow
            label="Biometría"
            hint="Pide tu huella o rostro para abrir la app. Nunca guardamos tu huella: la valida tu teléfono."
            value={biometrics}
            onChange={(v) => {
              setBiometrics(v);
              showToast(
                v
                  ? 'El bloqueo biométrico real se conecta con el dispositivo en una fase posterior.'
                  : 'Biometría desactivada'
              );
            }}
          />
          <SettingRow row={{ label: 'Privacidad', onPress: () => router.push('/privacy') }} />
        </View>

        <View>
          <Text className="mb-1 font-bold text-[11px] uppercase text-ink-secondary">Cuenta</Text>
          <SettingRow row={{ label: 'Cuenta', onPress: soon('Cuenta', 'la Fase 2 de Codex (backend de auth)') }} />
          <SettingRow row={{ label: 'Pedidos', onPress: soon('Pedidos', 'la Fase 6 de Codex (WooCommerce)') }} />
          <SettingRow row={{ label: 'Descargar mis datos', onPress: () => router.push('/privacy') }} />
          <SettingRow row={{ label: 'Eliminar mi cuenta', danger: true, onPress: () => router.push('/privacy') }} />
          <SettingRow row={{ label: 'Cerrar sesión', danger: true, onPress: () => setLogoutOpen(true) }} />
        </View>

        <Text className="text-center font-medium text-[11px] leading-4 text-ink-faint">
          Hola, {name}. Todo lo que ves aquí es tuyo y puedes cambiarlo.
        </Text>
      </ScrollView>

      {/* Reply style */}
      <AppModal visible={styleOpen} onClose={() => setStyleOpen(false)} title={`¿Cómo prefieres que responda?`}>
        <ChipGroup
          label="Estilo de respuesta"
          multi={false}
          options={['Breve', 'Paso a paso', 'Cercana', 'Más técnica']}
          selected={answers.abrilStyle ? [answers.abrilStyle] : []}
          onToggle={(v) => {
            setAnswer('abrilStyle', v);
            setReplyLength(v === 'Breve' ? 'breve' : 'detallada');
            setStyleOpen(false);
            showToast('Listo, lo tendré en cuenta');
          }}
        />
      </AppModal>

      <AppModal visible={logoutOpen} onClose={() => setLogoutOpen(false)} title="¿Cerrar sesión?">
        <Text className="font-medium text-[13px] leading-5 text-ink-secondary">
          Tus datos se quedan guardados. Puedes volver a entrar cuando quieras.
        </Text>
        <View className="mt-4 flex-row gap-2">
          <View className="flex-1">
            <AppButton label="Cancelar" variant="outline" fullWidth onPress={() => setLogoutOpen(false)} />
          </View>
          <View className="flex-1">
            <AppButton
              label="Cerrar sesión"
              variant="danger-outline"
              fullWidth
              onPress={() => {
                setLogoutOpen(false);
                router.replace('/(auth)/login');
              }}
            />
          </View>
        </View>
      </AppModal>
    </View>
  );
}
