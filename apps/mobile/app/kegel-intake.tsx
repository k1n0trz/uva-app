import { goBackOr } from '../lib/nav';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, ChipGroup, HealthWarning } from '../components/ui';
import { KEGEL_INTAKE } from '../constants/routines';
import { computeEligibility, useRoutinesStore } from '../stores/routinesStore';
import { useToastStore } from '../stores/toastStore';

/**
 * Kegel eligibility intake (ficha §15.2).
 *
 * The result is never framed as a diagnosis, and being excluded is never a
 * dead end: the awareness/breathing route stays open to everyone (§15.3).
 */
export default function KegelIntakeScreen() {
  const insets = useSafeAreaInsets();
  const intake = useRoutinesStore((s) => s.intake);
  const setAnswer = useRoutinesStore((s) => s.setIntakeAnswer);
  const completeIntake = useRoutinesStore((s) => s.completeIntake);
  const showToast = useToastStore((s) => s.show);
  const [submitted, setSubmitted] = useState(false);

  const answered = KEGEL_INTAKE.filter((q) => intake[q.key]).length;
  const allAnswered = answered === KEGEL_INTAKE.length;
  const result = computeEligibility(intake);

  const onSubmit = () => {
    setSubmitted(true);
    completeIntake();
    if (result.eligible) {
      showToast('Rutina con Bolas Kegel desbloqueada');
      goBackOr('/(tabs)/rutinas');
    }
  };

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 border-b border-border bg-white px-5 py-4">
        <Pressable
          onPress={() => goBackOr('/(tabs)/rutinas')}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          className="h-9 w-9 items-center justify-center rounded-full border border-border bg-white"
        >
          <Text className="font-bold text-sm text-ink-secondary">‹</Text>
        </Pressable>
        <Text className="font-extrabold text-base text-ink">Evaluación inicial</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {submitted && !result.eligible ? (
          <View className="mb-4 gap-3 rounded-2xl border border-border bg-white p-4">
            <Text className="font-extrabold text-base text-ink">
              {result.owns ? 'Por ahora no te propongo las rutinas con peso' : 'Aún no activo las rutinas con peso'}
            </Text>
            {result.owns ? (
              <>
                <Text className="font-medium text-[13px] leading-5 text-ink-secondary">
                  Esto no es un diagnóstico — es prudencia. Por lo que me contaste:
                </Text>
                {result.reasons.map((reason) => (
                  <View key={reason} className="flex-row gap-2">
                    <Text className="font-bold text-primary-dark">·</Text>
                    <Text className="flex-1 font-medium text-[13px] leading-5 text-ink">{reason}</Text>
                  </View>
                ))}
                <HealthWarning message="Te recomendamos consultar a un profesional de piso pélvico antes de usar peso." />
              </>
            ) : (
              <Text className="font-medium text-[13px] leading-5 text-ink-secondary">
                Las rutinas con peso requieren las Bolas Kegel UVA. No las necesitas para trabajar tu piso pélvico:
                la ruta de conciencia, respiración y coordinación está completa y disponible para ti.
              </Text>
            )}
            <AppButton label="Ver rutinas disponibles para mí" onPress={() => goBackOr('/(tabs)/rutinas')} />
          </View>
        ) : null}

        <Text className="mb-4 font-medium text-[13px] leading-5 text-ink-secondary">
          Son unas preguntas para saber qué es seguro proponerte. Puedes cambiar tus respuestas cuando quieras.
        </Text>

        <View className="gap-4">
          {KEGEL_INTAKE.map((question) => (
            <View key={question.key} className="gap-2">
              <Text className="font-semibold text-[13px] text-ink">{question.q}</Text>
              {question.why ? (
                <Text className="font-medium text-[11px] leading-4 text-ink-secondary">{question.why}</Text>
              ) : null}
              <ChipGroup
                label={question.q}
                multi={false}
                options={question.options}
                selected={intake[question.key] ? [intake[question.key] as string] : []}
                onToggle={(v) => setAnswer(question.key, v)}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="gap-2 border-t border-border bg-white px-5 pt-3" style={{ paddingBottom: insets.bottom + 12 }}>
        {!allAnswered ? (
          <Text className="text-center font-medium text-[11px] text-ink-secondary">
            {answered} de {KEGEL_INTAKE.length} respondidas
          </Text>
        ) : null}
        <AppButton label="Ver qué puedo hacer" fullWidth disabled={!allAnswered} onPress={onSubmit} />
      </View>
    </View>
  );
}
