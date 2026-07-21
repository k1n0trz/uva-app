import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AbrilAvatar, AbrilState } from '../../components/abril';
import { AppButton, HealthWarning } from '../../components/ui';
import { ASSISTANT_NAME } from '../../constants/brand';
import { RESCUE_WARNING } from '../../constants/rescue';
import { abrilChatService } from '../../services/abril';
import { makeMessage, useChatStore, type ChatStatus, type VoiceStage } from '../../stores/chatStore';
import { useScenarioFlags } from '../../stores/scenarioStore';
import { useToastStore } from '../../stores/toastStore';

const QUICK_REPLIES = ['¿Cuándo llega mi periodo?', 'Tengo cólicos', 'Quiero una rutina corta'];

/** Maps conversation state onto the avatar's visual state. */
function avatarState(status: ChatStatus, voiceStage: VoiceStage, offline: boolean): AbrilState {
  if (offline) return 'unavailable';
  if (voiceStage === 'listening') return 'listening';
  if (voiceStage === 'transcribing' || status === 'thinking') return 'thinking';
  if (status === 'speaking') return 'speaking';
  return 'idle';
}

function statusLabel(status: ChatStatus, voiceStage: VoiceStage, offline: boolean): string {
  if (offline) return `${ASSISTANT_NAME} no está disponible sin conexión`;
  if (voiceStage === 'error') return 'Sin acceso al micrófono';
  if (voiceStage === 'listening') return 'Escuchando…';
  if (voiceStage === 'transcribing') return 'Procesando tu voz…';
  if (voiceStage === 'review') return 'Revisa lo que entendí';
  if (status === 'thinking') return `${ASSISTANT_NAME} está pensando…`;
  if (status === 'speaking') return `${ASSISTANT_NAME} está hablando…`;
  return ASSISTANT_NAME;
}

export default function AbrilScreen() {
  const insets = useSafeAreaInsets();
  const { micDenied, isOffline } = useScenarioFlags();
  const showToast = useToastStore((s) => s.show);
  const scrollRef = useRef<ScrollView>(null);

  const { messages, input, status, voiceStage, transcript, lastIntent, replyLength, speechEnabled } = useChatStore();
  const {
    setInput,
    setStatus,
    setVoiceStage,
    setTranscript,
    setLastIntent,
    setReplyLength,
    toggleSpeech,
    addMessage,
    rateMessage,
  } = useChatStore();

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages.length, status]);

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    if (isOffline) {
      showToast(`${ASSISTANT_NAME} no está disponible sin conexión. Tus registros sí se guardan.`);
      return;
    }
    addMessage(makeMessage('user', clean));
    setInput('');
    setStatus('thinking');

    const reply = await abrilChatService.sendMessage(clean, replyLength);
    addMessage(makeMessage('abril', reply.text, reply.warn));
    setLastIntent(reply.intent);

    if (speechEnabled) {
      setStatus('speaking');
      // Stands in for TTS playback; real audio arrives with the voice provider.
      setTimeout(() => setStatus('idle'), 1200);
    } else {
      setStatus('idle');
    }
  };

  // Push-to-talk. Never always-on, no wake word (ficha §4.2/§11.2).
  const startListening = () => {
    if (micDenied) {
      setVoiceStage('error');
      showToast('Micrófono no disponible. Puedes escribir tu mensaje.');
      return;
    }
    setVoiceStage('listening');
    setTimeout(() => {
      setVoiceStage('transcribing');
      setTimeout(() => {
        // Mock STT result — the user reviews/edits it before anything is sent.
        setTranscript('Tengo cólicos desde ayer');
        setVoiceStage('review');
      }, 700);
    }, 1200);
  };

  const confirmTranscript = () => {
    const text = transcript;
    setTranscript('');
    setVoiceStage('idle');
    send(text);
  };

  const rephrase = async () => {
    const lastUser = [...messages].reverse().find((m) => m.from === 'user');
    if (!lastUser) return;
    setStatus('thinking');
    const reply = await abrilChatService.rephrase(lastUser.text, replyLength);
    addMessage(makeMessage('abril', reply.text, reply.warn));
    setStatus('idle');
  };

  const rate = async (id: string, rating: 'up' | 'down') => {
    rateMessage(id, rating);
    await abrilChatService.rateMessage(id, rating);
    showToast(rating === 'up' ? 'Gracias — me ayuda a mejorar.' : 'Gracias. Voy a intentarlo distinto.');
  };

  const lastMessage = messages[messages.length - 1];
  const showWarning = lastMessage?.from === 'abril' && !!lastMessage.warn;

  return (
    <View className="flex-1 bg-surface-content">
      {/* Header: avatar + live status */}
      <View className="items-center gap-2 border-b border-border bg-white pb-3" style={{ paddingTop: insets.top + 12 }}>
        <AbrilAvatar state={avatarState(status, voiceStage, isOffline)} size={64} />
        <Text className="font-semibold text-xs text-ink-secondary" accessibilityLiveRegion="polite">
          {statusLabel(status, voiceStage, isOffline)}
        </Text>
      </View>

      <ScrollView ref={scrollRef} className="flex-1" contentContainerClassName="gap-2.5 px-5 py-4">
        {messages.map((m, i) => (
          <View key={m.id} className={m.from === 'abril' ? 'items-start' : 'items-end'}>
            <View
              className={['max-w-[85%] rounded-2xl px-3.5 py-3', m.from === 'abril' ? 'bg-primary-soft' : 'bg-ink'].join(' ')}
            >
              <Text
                className={['font-medium text-[13px] leading-5', m.from === 'abril' ? 'text-ink' : 'text-white'].join(' ')}
              >
                {m.text}
              </Text>
            </View>

            {/* Rate + rephrase, only on real assistant replies (brief §12) */}
            {m.from === 'abril' && i > 0 ? (
              <View className="mt-1 flex-row items-center gap-2">
                <Pressable
                  onPress={() => rate(m.id, 'up')}
                  accessibilityRole="button"
                  accessibilityLabel="Me ayudó"
                  accessibilityState={{ selected: m.rating === 'up' }}
                  className="min-h-[32px] min-w-[32px] items-center justify-center"
                >
                  <Text style={{ fontSize: 13, opacity: m.rating === 'up' ? 1 : 0.4 }}>👍</Text>
                </Pressable>
                <Pressable
                  onPress={() => rate(m.id, 'down')}
                  accessibilityRole="button"
                  accessibilityLabel="No me ayudó"
                  accessibilityState={{ selected: m.rating === 'down' }}
                  className="min-h-[32px] min-w-[32px] items-center justify-center"
                >
                  <Text style={{ fontSize: 13, opacity: m.rating === 'down' ? 1 : 0.4 }}>👎</Text>
                </Pressable>
                <Pressable onPress={rephrase} accessibilityRole="button" className="min-h-[32px] justify-center">
                  <Text className="font-semibold text-[11px] text-primary-dark">Explícame de otra forma</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        ))}

        {status === 'thinking' ? (
          <View className="items-start">
            <View className="rounded-2xl bg-primary-soft px-3.5 py-3">
              <Text className="font-medium text-[13px] text-ink-secondary">…</Text>
            </View>
          </View>
        ) : null}

        {showWarning ? <HealthWarning message={RESCUE_WARNING} /> : null}

        {/* Contextual routing, never a sales push */}
        {lastIntent === 'dolor' ? (
          <View className="items-start">
            <AppButton label="Ir a Modo Rescate" variant="danger-outline" size="sm" onPress={() => router.push('/rescue')} />
          </View>
        ) : null}
        {lastIntent === 'rutina' ? (
          <View className="items-start">
            <AppButton label="Empezar rutina de respiración" variant="dark" size="sm" onPress={() => router.push('/routine/r2')} />
          </View>
        ) : null}
      </ScrollView>

      {/* Editable transcript — the user confirms before anything is sent (ficha §11.2) */}
      {voiceStage === 'review' ? (
        <View className="gap-2 border-t border-border bg-primary-xsoft px-5 py-3">
          <Text className="font-semibold text-[11px] uppercase text-primary-dark">Esto entendí — puedes corregirlo</Text>
          <TextInput
            value={transcript}
            onChangeText={setTranscript}
            multiline
            className="min-h-[44px] rounded-xl border border-border bg-white px-3.5 py-2.5 font-medium text-[13px] text-ink"
            accessibilityLabel="Transcripción editable"
          />
          <View className="flex-row gap-2">
            <View className="flex-1">
              <AppButton label="Enviar" fullWidth onPress={confirmTranscript} />
            </View>
            <View className="flex-1">
              <AppButton
                label="Descartar"
                variant="outline"
                fullWidth
                onPress={() => {
                  setTranscript('');
                  setVoiceStage('idle');
                }}
              />
            </View>
          </View>
        </View>
      ) : null}

      <View className="border-t border-border bg-white px-5 pt-3" style={{ paddingBottom: insets.bottom + 8 }}>
        {/* Reply length + speech toggle + stop */}
        <View className="mb-2.5 flex-row flex-wrap items-center gap-2">
          <Pressable
            onPress={() => setReplyLength(replyLength === 'breve' ? 'detallada' : 'breve')}
            accessibilityRole="button"
            accessibilityLabel={`Respuestas ${replyLength}. Tocar para cambiar.`}
            className="rounded-full bg-primary-soft px-3 py-1.5"
          >
            <Text className="font-semibold text-[11px] text-primary-dark">
              {replyLength === 'breve' ? 'Respuestas breves' : 'Respuestas detalladas'}
            </Text>
          </Pressable>
          <Pressable
            onPress={toggleSpeech}
            accessibilityRole="button"
            accessibilityLabel={speechEnabled ? 'Desactivar la voz' : 'Activar la voz'}
            className="rounded-full border border-border px-3 py-1.5"
          >
            <Text className="font-semibold text-[11px] text-ink-secondary">
              {speechEnabled ? '🔊 Voz activada' : '🔇 Voz desactivada'}
            </Text>
          </Pressable>
          {status === 'speaking' ? (
            <Pressable
              onPress={() => setStatus('idle')}
              accessibilityRole="button"
              accessibilityLabel="Detener la voz"
              className="rounded-full bg-ink px-3 py-1.5"
            >
              <Text className="font-semibold text-[11px] text-white">Detener</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Quick replies only while the conversation hasn't started */}
        {messages.length <= 1 ? (
          <View className="mb-2.5 flex-row flex-wrap gap-1.5">
            {QUICK_REPLIES.map((q) => (
              <Pressable key={q} onPress={() => send(q)} accessibilityRole="button" className="rounded-full bg-primary-soft px-3 py-2">
                <Text className="font-semibold text-xs text-primary-dark">{q}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {micDenied ? (
          <View className="mb-2 rounded-xl bg-danger-soft px-3 py-2">
            <Text className="font-semibold text-xs text-danger">Micrófono no disponible. Puedes escribir tu mensaje.</Text>
          </View>
        ) : null}
        {isOffline ? (
          <View className="mb-2 rounded-xl bg-warning-soft px-3 py-2">
            <Text className="font-semibold text-xs text-warning">
              Sin conexión — {ASSISTANT_NAME} no puede responder ahora, pero tus registros se guardan.
            </Text>
          </View>
        ) : null}

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={startListening}
            disabled={voiceStage === 'listening' || voiceStage === 'transcribing'}
            accessibilityRole="button"
            accessibilityLabel="Pulsar para hablar"
            className={[
              'h-11 w-11 items-center justify-center rounded-full',
              voiceStage === 'listening' ? 'bg-primary' : micDenied ? 'bg-border' : 'bg-primary-soft',
            ].join(' ')}
          >
            <Text style={{ fontSize: 16 }}>🎙</Text>
          </Pressable>
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            placeholder={`Escribe a ${ASSISTANT_NAME}…`}
            placeholderTextColor="#6F666B"
            className="min-h-[44px] flex-1 rounded-full border border-border px-3.5 font-medium text-sm text-ink"
            accessibilityLabel={`Escribe a ${ASSISTANT_NAME}`}
            returnKeyType="send"
          />
          <Pressable
            onPress={() => send(input)}
            accessibilityRole="button"
            accessibilityLabel="Enviar"
            className="h-11 w-11 items-center justify-center rounded-full bg-primary"
          >
            <Text className="font-bold text-sm text-white">→</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
