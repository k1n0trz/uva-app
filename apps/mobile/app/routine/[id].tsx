import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { goBackOr } from '../../lib/nav';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, ChipGroup, HealthWarning } from '../../components/ui';
import { EVAL_QUESTIONS, PAIN_WARNING, findRoutine } from '../../constants/routines';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { useRoutinesStore, type RoutineEval } from '../../stores/routinesStore';
import { useToastStore } from '../../stores/toastStore';

const BREATH_CYCLE_SEC = 8;

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function RoutinePlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const routine = findRoutine(id ?? '');
  const reduceMotion = useReduceMotion();
  const recordSession = useRoutinesStore((s) => s.recordSession);
  const showToast = useToastStore((s) => s.show);

  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [hapticsOn, setHapticsOn] = useState(false);
  const [evalOpen, setEvalOpen] = useState(false);
  const [answers, setAnswers] = useState<RoutineEval>({});
  const breathe = useRef(new Animated.Value(1)).current;

  // Timer
  useEffect(() => {
    if (!running || evalOpen) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [running, evalOpen]);

  // Breathing guide — purely a pacing cue. The app cannot and does not detect
  // contractions (brief §15), so this never reacts to the user's body.
  useEffect(() => {
    breathe.stopAnimation();
    if (!running || reduceMotion || evalOpen) {
      breathe.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1.25,
          duration: (BREATH_CYCLE_SEC / 2) * 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 1,
          duration: (BREATH_CYCLE_SEC / 2) * 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [running, reduceMotion, evalOpen, breathe]);

  const inhaling = elapsed % BREATH_CYCLE_SEC < BREATH_CYCLE_SEC / 2;

  // Haptic cue on each phase change, opt-in only.
  useEffect(() => {
    if (!hapticsOn || !running || evalOpen || Platform.OS === 'web') return;
    if (elapsed % (BREATH_CYCLE_SEC / 2) === 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  }, [elapsed, hapticsOn, running, evalOpen]);

  if (!routine) {
    return (
      <View className="flex-1 items-center justify-center bg-ink px-6">
        <Text className="text-center font-semibold text-sm text-white">No encontramos esta rutina.</Text>
        <View className="mt-4">
          <AppButton label="Volver" variant="outline" onPress={() => goBackOr('/(tabs)/rutinas')} />
        </View>
      </View>
    );
  }

  const finish = () => {
    setRunning(false);
    setEvalOpen(true);
  };

  const submitEval = () => {
    recordSession({ routineId: routine.id, routineName: routine.name, at: Date.now(), evaluation: answers });
    showToast('Rutina completada — autoevaluación guardada');
    goBackOr('/(tabs)/rutinas');
  };

  const showPainWarning = answers.pain === 'Sí' || answers.pain === 'Un poco';
  const allEvalAnswered = EVAL_QUESTIONS.every((q) => answers[q.key]);

  // ---- Final self-assessment ----
  if (evalOpen) {
    return (
      <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
        <ScrollView className="flex-1" contentContainerClassName="px-5 pt-6" contentContainerStyle={{ paddingBottom: 24 }}>
          <Text className="mb-1.5 font-extrabold text-lg text-ink">Rutina completada</Text>
          <Text className="mb-5 font-medium text-[13px] text-ink-secondary">
            Cuéntame cómo te sentiste. Esto define si te propongo avanzar — no los días que lleves.
          </Text>

          <View className="gap-4">
            {EVAL_QUESTIONS.map((q) => (
              <View key={q.key} className="gap-2">
                <Text className="font-semibold text-[13px] text-ink">{q.q}</Text>
                <ChipGroup
                  label={q.q}
                  multi={false}
                  options={q.options}
                  selected={answers[q.key] ? [answers[q.key] as string] : []}
                  onToggle={(v) => setAnswers((a) => ({ ...a, [q.key]: v }))}
                />
              </View>
            ))}
          </View>

          {showPainWarning ? (
            <View className="mt-4">
              <HealthWarning message={PAIN_WARNING} />
            </View>
          ) : null}
        </ScrollView>

        <View className="border-t border-border px-5 pt-3" style={{ paddingBottom: insets.bottom + 12 }}>
          <AppButton label="Guardar" fullWidth disabled={!allEvalAnswered} onPress={submitEval} />
        </View>
      </View>
    );
  }

  // ---- Player ----
  return (
    <View className="flex-1 bg-ink" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-5 py-4">
        <Pressable
          onPress={() => goBackOr('/(tabs)/rutinas')}
          accessibilityRole="button"
          accessibilityLabel="Cerrar rutina"
          className="h-9 w-9 items-center justify-center rounded-full border border-white/20"
        >
          <Text className="font-bold text-sm text-white">×</Text>
        </Pressable>
        <Text className="font-bold text-[13px] text-white">{routine.name}</Text>
        <View className="w-9" />
      </View>

      <View className="flex-1 items-center justify-center gap-5">
        <Animated.View
          style={{ transform: [{ scale: breathe }] }}
          className="h-[150px] w-[150px] items-center justify-center rounded-full border border-white/15 bg-white/5"
        >
          <Text className="font-extrabold text-3xl text-white" accessibilityLabel={`Tiempo: ${formatTime(elapsed)}`}>
            {formatTime(elapsed)}
          </Text>
        </Animated.View>
        <Text className="max-w-[260px] text-center font-semibold text-sm text-primary-border" accessibilityLiveRegion="polite">
          {running ? (inhaling ? 'Inhala lentamente por la nariz…' : 'Exhala con calma por la boca…') : 'Rutina en pausa'}
        </Text>
        <Text className="font-medium text-[11px] text-white/50">
          {routine.durationLabel} sugeridos · puedes terminar cuando quieras
        </Text>
      </View>

      <View className="gap-3 px-5" style={{ paddingBottom: insets.bottom + 16 }}>
        <View className="flex-row justify-center">
          <Pressable
            onPress={() => setHapticsOn((v) => !v)}
            accessibilityRole="button"
            accessibilityState={{ selected: hapticsOn }}
            accessibilityLabel={hapticsOn ? 'Desactivar vibración' : 'Activar vibración'}
            className="rounded-full border border-white/20 px-3 py-1.5"
          >
            <Text className="font-semibold text-[11px] text-white/70">
              {hapticsOn ? '📳 Vibración activada' : '📳 Vibración desactivada'}
            </Text>
          </Pressable>
        </View>
        <View className="flex-row gap-2.5">
          <View className="flex-1">
            <AppButton
              label={running ? 'Pausar' : 'Reanudar'}
              variant="outline"
              size="lg"
              fullWidth
              onPress={() => setRunning((r) => !r)}
            />
          </View>
          <View className="flex-1">
            <AppButton label="Finalizar" size="lg" fullWidth onPress={finish} />
          </View>
        </View>
      </View>
    </View>
  );
}
