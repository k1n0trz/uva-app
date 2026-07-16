import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import {
  ENERGY_OPTIONS,
  FLOW_OPTIONS,
  MOOD_OPTIONS,
  PAIN_OPTIONS,
  PRODUCT_OPTIONS,
  SYMPTOM_OPTIONS,
} from '../../constants/checkin';
import { useCheckinStore, isEmptyCheckIn, isPartialCheckIn } from '../../stores/checkinStore';
import { useToastStore } from '../../stores/toastStore';
import { AppButton, BottomSheet, ChipGroup, SelectRow } from '../ui';

type Props = {
  visible: boolean;
  onClose: () => void;
  isoDate: string;
  /** Label for the day being logged, e.g. "hoy" or "16 de julio". */
  dayLabel?: string;
  isOffline?: boolean;
  micDenied?: boolean;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-3.5">
      <Text className="mb-1.5 font-semibold text-xs text-ink-secondary">{title}</Text>
      {children}
    </View>
  );
}

/**
 * Fast daily check-in. Fields follow ficha técnica §12.1; the sheet layout and
 * chip styling follow the design-handoff prototype. Everything is optional —
 * a partial log is valid and still saves (brief §10).
 */
export function DailyCheckIn({ visible, onClose, isoDate, dayLabel = 'hoy', isOffline, micDenied }: Props) {
  const draft = useCheckinStore((s) => s.draft);
  const setField = useCheckinStore((s) => s.setDraftField);
  const toggleSymptom = useCheckinStore((s) => s.toggleDraftSymptom);
  const saveDraft = useCheckinStore((s) => s.saveDraft);
  const existing = useCheckinStore((s) => s.byDate[isoDate]);
  const showToast = useToastStore((s) => s.show);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!existing;
  const empty = isEmptyCheckIn(draft);

  const onSave = () => {
    if (empty) {
      setError('Marca al menos una opción para guardar tu registro.');
      return;
    }
    setError(null);
    saveDraft(isoDate);
    onClose();
    showToast(
      isOffline
        ? 'Guardado en este dispositivo — se sincronizará al reconectar.'
        : isPartialCheckIn(draft)
          ? 'Registro parcial guardado'
          : 'Registro guardado'
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text className="mb-3.5 font-extrabold text-[17px] text-ink">
        {isEditing ? `Editar registro de ${dayLabel}` : `Check-in de ${dayLabel}`}
      </Text>

      {isOffline ? (
        <View className="mb-3.5 rounded-xl bg-warning-soft px-3 py-2.5">
          <Text className="font-semibold text-xs text-warning">
            Sin conexión — tu registro se guarda aquí y se sincroniza después.
          </Text>
        </View>
      ) : null}

      <Section title="Flujo">
        <SelectRow label="Flujo" options={FLOW_OPTIONS} value={draft.flow} onSelect={(v) => setField('flow', v)} />
      </Section>

      <Section title="Dolor o cólicos">
        <SelectRow label="Dolor o cólicos" options={PAIN_OPTIONS} value={draft.pain} onSelect={(v) => setField('pain', v)} />
      </Section>

      <Section title="Energía">
        <SelectRow label="Energía" options={ENERGY_OPTIONS} value={draft.energy} onSelect={(v) => setField('energy', v)} />
      </Section>

      <Section title="Estado de ánimo">
        <ChipGroup
          label="Estado de ánimo"
          multi={false}
          options={MOOD_OPTIONS}
          selected={draft.mood ? [draft.mood] : []}
          onToggle={(v) => setField('mood', draft.mood === v ? null : (v as typeof draft.mood))}
        />
      </Section>

      <Section title="Síntomas">
        <ChipGroup label="Síntomas" options={SYMPTOM_OPTIONS} selected={draft.symptoms} onToggle={toggleSymptom} />
      </Section>

      <Section title="Producto utilizado">
        <ChipGroup
          label="Producto utilizado"
          multi={false}
          options={PRODUCT_OPTIONS}
          selected={draft.product ? [draft.product] : []}
          onToggle={(v) => setField('product', draft.product === v ? null : (v as typeof draft.product))}
        />
      </Section>

      <Section title="Nota">
        <View className="flex-row gap-2">
          <TextInput
            value={draft.note}
            onChangeText={(t) => setField('note', t)}
            placeholder="Escribe una nota (opcional)"
            placeholderTextColor="#6F666B"
            className="min-h-[44px] flex-1 rounded-xl border border-border bg-white px-3.5 font-medium text-[13px] text-ink"
            accessibilityLabel="Nota"
          />
          <Pressable
            onPress={() =>
              showToast(
                micDenied
                  ? 'Micrófono no disponible. Puedes escribir tu nota.'
                  : 'Registro por voz — se conecta con el backend en la Fase 4.'
              )
            }
            accessibilityRole="button"
            accessibilityLabel="Registrar por voz"
            className={['h-11 w-11 items-center justify-center rounded-full', micDenied ? 'bg-border' : 'bg-primary-soft'].join(' ')}
          >
            <Text style={{ fontSize: 16 }}>🎙</Text>
          </Pressable>
        </View>
      </Section>

      {error ? (
        <View className="mb-3 rounded-xl bg-danger-soft px-3 py-2.5">
          <Text className="font-semibold text-xs text-danger">{error}</Text>
        </View>
      ) : null}

      <AppButton label="Guardar" fullWidth onPress={onSave} />
    </BottomSheet>
  );
}
