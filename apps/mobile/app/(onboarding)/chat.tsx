import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '../../components/ui';
import {
  OB_QUESTIONS,
  OB_SUMMARY_LABELS,
  ONBOARDING_PRODUCT_CHIPS,
  OnboardingQuestion,
} from '../../constants/onboarding';
import { OnboardingAnswers, useOnboardingStore } from '../../stores/onboardingStore';

/** Conversational onboarding — mirrors the prototype's isOnboardChat + summary. */
export default function OnboardingChat() {
  const insets = useSafeAreaInsets();
  const { answers, step, voiceOn } = useOnboardingStore();
  const { setAnswer, toggleProduct, setStep, toggleVoice } = useOnboardingStore();

  const clampedStep = Math.min(step, OB_QUESTIONS.length - 1);
  const current = OB_QUESTIONS[clampedStep];
  const progressPct = Math.round((clampedStep / (OB_QUESTIONS.length - 1)) * 100);
  const canBack = clampedStep > 0 && current.type !== 'summary';

  const goNext = () => setStep(Math.min(clampedStep + 1, OB_QUESTIONS.length - 1));
  const goBack = () => setStep(Math.max(0, clampedStep - 1));

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top + 12 }}>
      {/* Header: back · progress · skip */}
      <View className="flex-row items-center gap-2.5 px-5 pb-4">
        {canBack ? (
          <Pressable
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            className="h-8 w-8 items-center justify-center rounded-full border border-border bg-white"
          >
            <Text className="font-bold text-sm text-ink-secondary">‹</Text>
          </Pressable>
        ) : null}
        <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
          <View className="h-full rounded-full bg-primary" style={{ width: `${progressPct}%` }} />
        </View>
        {current.type !== 'summary' ? (
          <Pressable onPress={goNext} accessibilityRole="button" accessibilityLabel="Omitir">
            <Text className="font-semibold text-xs text-ink-secondary">Omitir</Text>
          </Pressable>
        ) : null}
      </View>

      {current.type === 'summary' ? (
        <SummaryStep answers={answers} onEdit={(key) => setStep(OB_QUESTIONS.findIndex((q) => q.key === key))} />
      ) : (
        <QuestionStep
          question={current}
          answers={answers}
          voiceOn={voiceOn}
          onToggleVoice={toggleVoice}
          onSetAnswer={setAnswer}
          onToggleProduct={toggleProduct}
          onNext={goNext}
          bottomInset={insets.bottom}
        />
      )}
    </View>
  );
}

function QuestionStep({
  question,
  answers,
  voiceOn,
  onToggleVoice,
  onSetAnswer,
  onToggleProduct,
  onNext,
  bottomInset,
}: {
  question: OnboardingQuestion;
  answers: OnboardingAnswers;
  voiceOn: boolean;
  onToggleVoice: () => void;
  onSetAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  onToggleProduct: (product: string) => void;
  onNext: () => void;
  bottomInset: number;
}) {
  const key = question.key as keyof OnboardingAnswers;

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-4" showsVerticalScrollIndicator={false}>
        <Text className="mb-4 font-extrabold text-lg leading-6 text-ink">{question.q}</Text>

        {question.type === 'chips' ? (
          <View className="gap-2">
            {question.options?.map((option) => {
              const selected = answers[key] === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    onSetAnswer(key, option as never);
                    setTimeout(onNext, 150);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  className={[
                    'rounded-2xl border px-4 py-3.5',
                    selected ? 'border-primary bg-primary-xsoft' : 'border-border bg-white',
                  ].join(' ')}
                >
                  <Text className={selected ? 'font-semibold text-sm text-primary-dark' : 'font-semibold text-sm text-ink'}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {question.type === 'input' ? (
          <View>
            <TextInput
              value={answers[key] as string}
              onChangeText={(text) => onSetAnswer(key, text as never)}
              placeholder={question.placeholder}
              placeholderTextColor="#6F666B"
              className="min-h-[44px] rounded-xl border border-border bg-white px-3.5 font-semibold text-base text-ink"
              onSubmitEditing={onNext}
              returnKeyType="next"
            />
            <View className="mt-3.5">
              <AppButton label="Continuar" fullWidth onPress={onNext} />
            </View>
          </View>
        ) : null}

        {question.type === 'products' ? (
          <View className="flex-row flex-wrap gap-2">
            {ONBOARDING_PRODUCT_CHIPS.map((product) => {
              const selected = answers.products.includes(product);
              return (
                <Pressable
                  key={product}
                  onPress={() => onToggleProduct(product)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  className={[
                    'rounded-full border px-3.5 py-2.5',
                    selected ? 'border-primary bg-primary-xsoft' : 'border-border bg-white',
                  ].join(' ')}
                >
                  <Text className={selected ? 'font-semibold text-xs text-primary-dark' : 'font-semibold text-xs text-ink'}>
                    {product}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </ScrollView>

      {/* Push-to-talk mic (voice is a preference, never always-on — ficha §11.2) */}
      <View className="items-center gap-3.5 px-5" style={{ paddingBottom: bottomInset + 16, paddingTop: 12 }}>
        {question.type === 'products' ? <AppButton label="Continuar" fullWidth onPress={onNext} /> : null}
        {question.type === 'chips' ? (
          <Pressable
            onPress={onToggleVoice}
            accessibilityRole="button"
            accessibilityLabel={voiceOn ? 'Detener micrófono' : 'Hablar'}
            className={['h-11 w-11 items-center justify-center rounded-full', voiceOn ? 'bg-primary' : 'bg-primary-soft'].join(' ')}
          >
            <Text style={{ fontSize: 16 }}>🎙</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function SummaryStep({ answers, onEdit }: { answers: OnboardingAnswers; onEdit: (key: string) => void }) {
  const insets = useSafeAreaInsets();
  const rows = useMemo(
    () =>
      Object.keys(OB_SUMMARY_LABELS).map((key) => {
        const raw = answers[key as keyof OnboardingAnswers];
        const value = Array.isArray(raw) ? raw.join(', ') || 'Ninguno' : raw || 'Sin responder';
        return { key, label: OB_SUMMARY_LABELS[key], value };
      }),
    [answers]
  );

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-6" showsVerticalScrollIndicator={false}>
        <Text className="mb-1 font-extrabold text-lg text-ink">Antes de continuar</Text>
        <Text className="mb-4 font-medium text-sm text-ink-secondary">Revisa tus respuestas. Puedes editar cualquiera.</Text>
        <View className="gap-2">
          {rows.map((row) => (
            <Pressable
              key={row.key}
              onPress={() => onEdit(row.key)}
              accessibilityRole="button"
              accessibilityLabel={`Editar: ${row.label}`}
              className="flex-row items-center justify-between rounded-2xl border border-border bg-white p-3.5"
            >
              <View className="flex-1 pr-3">
                <Text className="font-semibold text-xs text-ink-secondary">{row.label}</Text>
                <Text className="mt-0.5 font-bold text-sm text-ink">{row.value}</Text>
              </View>
              <Text className="font-semibold text-xs text-primary-dark">Editar</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <View className="px-5" style={{ paddingBottom: insets.bottom + 16, paddingTop: 8 }}>
        <AppButton label="Continuar" fullWidth onPress={() => router.push('/(onboarding)/privacy')} />
      </View>
    </View>
  );
}
