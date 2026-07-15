import { View } from 'react-native';
import { EmptyState } from '../../components/ui';
import { TabScreenShell } from '../../components/nav';
import { VeraAvatar, VeraState } from '../../components/vera';

const PREVIEW_STATES: VeraState[] = [
  'idle',
  'greeting',
  'listening',
  'thinking',
  'speaking',
  'guiding',
  'celebrating',
  'concerned',
  'unavailable',
];

export default function VeraScreen() {
  return (
    <TabScreenShell>
      <View className="flex-row flex-wrap justify-center gap-4 rounded-3xl border border-border bg-white p-4">
        {PREVIEW_STATES.map((state) => (
          <View key={state} className="items-center gap-1.5" style={{ width: 76 }}>
            <VeraAvatar state={state} size={56} />
          </View>
        ))}
      </View>
      <EmptyState
        title="Conversación con Vera"
        description="El chat de texto y voz, Modo Rescate y Modo Primera Copa llegan en la Fase 4 del roadmap. Arriba tienes el preview de los 9 estados de VeraAvatar."
      />
    </TabScreenShell>
  );
}
