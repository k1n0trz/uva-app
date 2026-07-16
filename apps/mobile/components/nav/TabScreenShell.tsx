import { router } from 'expo-router';
import { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { useOnboardingStore } from '../../stores/onboardingStore';
import { useScenarioFlags } from '../../stores/scenarioStore';
import { ScenarioSwitcher } from '../dev/ScenarioSwitcher';
import { Toast } from '../ui';
import { AppHeader } from './AppHeader';

/**
 * Shared chrome for every tab (header + dev scenario switcher). In the
 * prototype this header persists across Hoy/Calendario/Abril/Rutinas/Tienda —
 * only the content below it changes per tab.
 *
 * The dev scenario switcher renders *below* the header on purpose: the header
 * owns the top safe-area inset, so putting the switcher above it made the chips
 * collide with the Android status bar.
 */
export function TabScreenShell({ children }: PropsWithChildren) {
  const { isNewUser } = useScenarioFlags();
  const name = useOnboardingStore((s) => s.answers.name).trim();

  // Her own name if she gave one; otherwise the demo persona.
  const greetingName = name || (isNewUser ? 'Bienvenida' : 'Laura');

  return (
    <View className="flex-1 bg-surface-content">
      <AppHeader
        greetingLabel="Hola"
        greetingName={greetingName}
        userInitial={greetingName.charAt(0).toUpperCase() || '?'}
        onPressProfile={() => router.push('/profile')}
      />
      <ScenarioSwitcher />
      <ScrollView className="flex-1" contentContainerClassName="gap-3.5 px-5 pb-24 pt-4" showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      <Toast />
    </View>
  );
}
