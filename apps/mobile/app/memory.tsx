import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton, AppModal, EmptyState } from '../components/ui';
import { ASSISTANT_NAME } from '../constants/brand';
import { MEMORY_EXPLAINER, MEMORY_SOURCE_LABELS, NEVER_INFER, type Memory } from '../constants/memory';
import { useMemories } from '../hooks/useMemories';
import { colors } from '../constants/theme';
import { goBackOr } from '../lib/nav';
import { useChatStore } from '../stores/chatStore';
import { useMemoryStore } from '../stores/memoryStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useToastStore } from '../stores/toastStore';

/**
 * "Lo que Abril sabe de mí" (brief §18).
 *
 * The point of this screen is control, not transparency theatre: every fact
 * says where it came from and why it's kept, declared facts can be corrected,
 * inferred ones can be thrown out, and memory can be switched off entirely.
 */
export default function MemoryScreen() {
  const insets = useSafeAreaInsets();
  const memories = useMemories();
  const active = useMemoryStore((s) => s.active);
  const setActive = useMemoryStore((s) => s.setActive);
  const deleteMemory = useMemoryStore((s) => s.deleteMemory);
  const overrideMemory = useMemoryStore((s) => s.overrideMemory);
  const setAnswer = useOnboardingStore((s) => s.setAnswer);
  const resetChat = useChatStore((s) => s.reset);
  const showToast = useToastStore((s) => s.show);

  const [editing, setEditing] = useState<Memory | null>(null);
  const [draft, setDraft] = useState('');
  const [confirmClearChat, setConfirmClearChat] = useState(false);

  const declared = memories.filter((m) => m.source === 'declarado');
  const inferred = memories.filter((m) => m.source === 'inferido');

  const saveEdit = () => {
    if (!editing) return;
    const text = draft.trim();
    if (!text) return;
    // Correcting her name should change her name, not just this label.
    if (editing.id === 'name') {
      const match = text.match(/llame\s+(.+?)\.?$/i);
      if (match) setAnswer('name', match[1].trim());
    }
    overrideMemory(editing.id, text);
    setEditing(null);
    showToast('Lo corregí');
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
        <Text className="font-extrabold text-base text-ink">Lo que {ASSISTANT_NAME} sabe de mí</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <Text className="font-medium text-[13px] leading-5 text-ink-secondary">{MEMORY_EXPLAINER}</Text>

        <View className="flex-row items-center justify-between rounded-2xl border border-border bg-white p-4">
          <View className="flex-1 pr-3">
            <Text className="font-bold text-sm text-ink">Memoria activa</Text>
            <Text className="mt-0.5 font-medium text-[11px] leading-4 text-ink-secondary">
              Si la apagas, dejo de recordar cosas nuevas. La app sigue funcionando.
            </Text>
          </View>
          <Switch
            value={active}
            onValueChange={(v) => {
              setActive(v);
              showToast(v ? 'Memoria activada' : 'Memoria desactivada');
            }}
            accessibilityLabel="Memoria activa"
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor="#FFFFFF"
          />
        </View>

        {!active ? (
          <View className="rounded-xl bg-warning-soft px-3 py-2.5">
            <Text className="font-semibold text-xs leading-5 text-warning">
              La memoria está apagada. Lo que ya recordaba sigue abajo — puedes borrarlo si quieres.
            </Text>
          </View>
        ) : null}

        {memories.length === 0 ? (
          <EmptyState
            title="Todavía no sé nada de ti"
            description="A medida que uses la app iré recordando lo que me cuentes. Siempre podrás verlo y borrarlo aquí."
          />
        ) : null}

        {declared.length > 0 ? (
          <View className="gap-2">
            <Text className="font-bold text-[11px] uppercase text-ink-secondary">{MEMORY_SOURCE_LABELS.declarado}</Text>
            {declared.map((m) => (
              <MemoryCard
                key={m.id}
                memory={m}
                onEdit={() => {
                  setEditing(m);
                  setDraft(m.text);
                }}
                onDelete={() => {
                  deleteMemory(m.id);
                  showToast('Lo olvidé');
                }}
              />
            ))}
          </View>
        ) : null}

        {inferred.length > 0 ? (
          <View className="gap-2">
            <Text className="font-bold text-[11px] uppercase text-ink-secondary">{MEMORY_SOURCE_LABELS.inferido}</Text>
            <Text className="font-medium text-[11px] leading-4 text-ink-secondary">
              Esto lo deduje de tu actividad. Puedo equivocarme — bórralo sin problema.
            </Text>
            {inferred.map((m) => (
              <MemoryCard
                key={m.id}
                memory={m}
                onDelete={() => {
                  deleteMemory(m.id);
                  showToast('Lo olvidé');
                }}
              />
            ))}
          </View>
        ) : null}

        {/* Naming the limits out loud is part of the promise (ficha §18.2). */}
        <View className="gap-1.5 rounded-2xl border border-border bg-white p-4">
          <Text className="font-bold text-sm text-ink">Lo que nunca deduzco</Text>
          <Text className="font-medium text-[12px] leading-5 text-ink-secondary">
            No infiero {NEVER_INFER.join(', ')}. Tampoco uso nada de esto para publicidad fuera de la app.
          </Text>
        </View>

        <AppButton
          label="Borrar historial conversacional"
          variant="outline"
          fullWidth
          onPress={() => setConfirmClearChat(true)}
        />
      </ScrollView>

      {/* Correct a declared fact */}
      <AppModal visible={!!editing} onClose={() => setEditing(null)} title="Corrígeme">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          multiline
          className="min-h-[80px] rounded-xl border border-border bg-white px-3.5 py-2.5 font-medium text-[13px] text-ink"
          accessibilityLabel="Corregir el recuerdo"
        />
        <View className="mt-3 flex-row gap-2">
          <View className="flex-1">
            <AppButton label="Cancelar" variant="outline" fullWidth onPress={() => setEditing(null)} />
          </View>
          <View className="flex-1">
            <AppButton label="Guardar" fullWidth onPress={saveEdit} />
          </View>
        </View>
      </AppModal>

      {/* Clearing the conversation is destructive — confirm it (brief §21) */}
      <AppModal visible={confirmClearChat} onClose={() => setConfirmClearChat(false)} title="¿Borrar el historial?">
        <Text className="font-medium text-[13px] leading-5 text-ink-secondary">
          Se borra toda nuestra conversación. No se puede deshacer. Lo que recuerdo de ti no cambia — eso se maneja
          arriba.
        </Text>
        <View className="mt-4 flex-row gap-2">
          <View className="flex-1">
            <AppButton label="Cancelar" variant="outline" fullWidth onPress={() => setConfirmClearChat(false)} />
          </View>
          <View className="flex-1">
            <AppButton
              label="Borrar"
              variant="danger-outline"
              fullWidth
              onPress={() => {
                resetChat();
                setConfirmClearChat(false);
                showToast('Historial conversacional eliminado');
              }}
            />
          </View>
        </View>
      </AppModal>
    </View>
  );
}

function MemoryCard({ memory, onEdit, onDelete }: { memory: Memory; onEdit?: () => void; onDelete: () => void }) {
  return (
    <View className="gap-2 rounded-2xl border border-border bg-white p-4">
      <Text className="font-medium text-[13px] leading-5 text-ink">{memory.text}</Text>
      <Text className="font-medium text-[11px] leading-4 text-ink-secondary">Para qué: {memory.why}</Text>
      <View className="flex-row gap-2">
        {memory.editable && onEdit ? <AppButton label="Corregir" variant="secondary" size="sm" onPress={onEdit} /> : null}
        <AppButton label="Olvidar esto" variant="danger-outline" size="sm" onPress={onDelete} />
      </View>
    </View>
  );
}
