import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, AppModal, Checkbox, HealthWarning } from '../components/ui';
import { ASSISTANT_NAME } from '../constants/brand';
import { goBackOr } from '../lib/nav';
import { useCheckinStore } from '../stores/checkinStore';
import { useMemoryStore } from '../stores/memoryStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useToastStore } from '../stores/toastStore';

const DELETE_PHRASE = 'ELIMINAR';

/**
 * Privacy controls (brief §18 / ficha §25).
 *
 * Consents are revocable, not one-time gates — Ley 1581 requires that consent
 * can be withdrawn as easily as it was given.
 */
export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const { consentGeneral, consentSensitive, setConsentGeneral, setConsentSensitive } = useOnboardingStore();
  const checkins = useCheckinStore((s) => s.byDate);
  const setMemoryActive = useMemoryStore((s) => s.setActive);
  const showToast = useToastStore((s) => s.show);

  const [exportOpen, setExportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [revokeSensitiveOpen, setRevokeSensitiveOpen] = useState(false);

  const checkinCount = Object.keys(checkins).length;

  const onToggleSensitive = () => {
    if (consentSensitive) {
      // Revoking is the consequential direction — spell out what it costs.
      setRevokeSensitiveOpen(true);
    } else {
      setConsentSensitive(true);
      showToast('Consentimiento activado');
    }
  };

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 border-b border-border bg-white px-5 py-4">
        <Pressable
          onPress={() => goBackOr('/profile')}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-white"
        >
          <Text className="font-bold text-sm text-ink-secondary">‹</Text>
        </Pressable>
        <Text className="font-extrabold text-base text-ink">Privacidad</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View className="gap-2">
          <Text className="font-bold text-[11px] uppercase text-ink-secondary">Tus consentimientos</Text>
          <Text className="font-medium text-[12px] leading-5 text-ink-secondary">
            Puedes cambiarlos cuando quieras. Retirarlos es tan fácil como darlos.
          </Text>
          <Checkbox
            checked={consentGeneral}
            onToggle={() => {
              setConsentGeneral(!consentGeneral);
              showToast(consentGeneral ? 'Consentimiento retirado' : 'Consentimiento activado');
            }}
            label="Uso de mis datos generales (nombre, preferencias, uso de la app)."
          />
          <Checkbox
            checked={consentSensitive}
            onToggle={onToggleSensitive}
            label="Uso de mis datos sensibles (ciclo, síntomas, salud íntima) para personalizar recomendaciones."
          />
        </View>

        <View className="gap-1.5 rounded-2xl border border-border bg-white p-4">
          <Text className="font-bold text-sm text-ink">Dónde vive lo tuyo</Text>
          <Text className="font-medium text-[12px] leading-5 text-ink-secondary">
            Tus registros de ciclo, síntomas y piso pélvico son datos sensibles. Se guardan cifrados, separados de tu
            identidad, y nunca se usan para publicidad fuera de la app.
          </Text>
          <Text className="mt-1 font-medium text-[11px] leading-4 text-ink-faint">
            Ley 1581 de 2012 (Colombia) — tratamiento con autorización previa, expresa e informada.
          </Text>
        </View>

        <View className="gap-2">
          <Text className="font-bold text-[11px] uppercase text-ink-secondary">Tus datos</Text>
          <AppButton label="Descargar mis datos" variant="outline" fullWidth onPress={() => setExportOpen(true)} />
          <Pressable onPress={() => router.push('/memory')} accessibilityRole="button" className="py-1">
            <Text className="text-center font-semibold text-xs text-primary-dark">
              Ver y corregir lo que {ASSISTANT_NAME} sabe de mí →
            </Text>
          </Pressable>
        </View>

        <View className="gap-2">
          <Text className="font-bold text-[11px] uppercase text-danger">Zona sensible</Text>
          <AppButton
            label="Eliminar mi cuenta"
            variant="danger-outline"
            fullWidth
            onPress={() => {
              setDeleteConfirm('');
              setDeleteOpen(true);
            }}
          />
        </View>
      </ScrollView>

      {/* Revoking sensitive consent has real consequences — say them plainly */}
      <AppModal
        visible={revokeSensitiveOpen}
        onClose={() => setRevokeSensitiveOpen(false)}
        title="¿Retirar el consentimiento?"
      >
        <Text className="font-medium text-[13px] leading-5 text-ink-secondary">
          Si lo retiras, dejo de estimar tu periodo y de proponerte rutinas según tus registros. Tus datos siguen
          guardados hasta que los borres tú — no los uso.
        </Text>
        <View className="mt-4 flex-row gap-2">
          <View className="flex-1">
            <AppButton label="Cancelar" variant="outline" fullWidth onPress={() => setRevokeSensitiveOpen(false)} />
          </View>
          <View className="flex-1">
            <AppButton
              label="Retirar"
              variant="danger-outline"
              fullWidth
              onPress={() => {
                setConsentSensitive(false);
                setMemoryActive(false);
                setRevokeSensitiveOpen(false);
                showToast('Consentimiento retirado');
              }}
            />
          </View>
        </View>
      </AppModal>

      {/* Export */}
      <AppModal visible={exportOpen} onClose={() => setExportOpen(false)} title="Descargar mis datos">
        <Text className="font-medium text-[13px] leading-5 text-ink-secondary">
          Se incluye todo lo tuyo: perfil, consentimientos, {checkinCount} registro
          {checkinCount === 1 ? '' : 's'} diario{checkinCount === 1 ? '' : 's'}, productos, rutinas, memoria y
          conversaciones.
        </Text>
        <View className="mt-3">
          <HealthWarning
            tone="warning"
            message="La descarga real la entrega el backend, que aún no existe. Este botón todavía no produce un archivo."
          />
        </View>
        <View className="mt-4">
          <AppButton label="Entendido" fullWidth onPress={() => setExportOpen(false)} />
        </View>
      </AppModal>

      {/* Delete account — typed confirmation, not a one-tap mistake (brief §21) */}
      <AppModal visible={deleteOpen} onClose={() => setDeleteOpen(false)} title="Eliminar mi cuenta">
        <Text className="font-medium text-[13px] leading-5 text-ink-secondary">
          Se borra todo: tu ciclo, tus registros, tus productos, tus rutinas y lo que {ASSISTANT_NAME} recuerda. No se
          puede deshacer.
        </Text>
        <Text className="mt-3 font-semibold text-[12px] text-ink">
          Escribe {DELETE_PHRASE} para confirmar:
        </Text>
        <TextInput
          value={deleteConfirm}
          onChangeText={setDeleteConfirm}
          autoCapitalize="characters"
          autoCorrect={false}
          className="mt-1.5 min-h-[44px] rounded-xl border border-border bg-white px-3.5 font-semibold text-sm text-ink"
          accessibilityLabel={`Escribe ${DELETE_PHRASE} para confirmar`}
        />
        <View className="mt-4 flex-row gap-2">
          <View className="flex-1">
            <AppButton label="Cancelar" variant="outline" fullWidth onPress={() => setDeleteOpen(false)} />
          </View>
          <View className="flex-1">
            <AppButton
              label="Eliminar"
              variant="danger-outline"
              fullWidth
              disabled={deleteConfirm.trim().toUpperCase() !== DELETE_PHRASE}
              onPress={() => {
                setDeleteOpen(false);
                showToast('La eliminación real la procesa el backend (Fase 7 de Codex).');
              }}
            />
          </View>
        </View>
      </AppModal>
    </View>
  );
}
