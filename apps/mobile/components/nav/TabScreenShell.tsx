import { PropsWithChildren } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useScenarioFlags } from '../../stores/scenarioStore';
import { ScenarioSwitcher } from '../dev/ScenarioSwitcher';
import { AppHeader } from './AppHeader';

/**
 * Shared chrome for every tab (header + dev scenario switcher). In the
 * prototype this header persists across Hoy/Calendario/Vera/Rutinas/Tienda —
 * only the content below it changes per tab.
 */
export function TabScreenShell({ children }: PropsWithChildren) {
  const { isNewUser } = useScenarioFlags();

  return (
    <View className="flex-1 bg-surface-content">
      <ScenarioSwitcher />
      <AppHeader
        greetingLabel="Hola"
        greetingName={isNewUser ? 'Bienvenida' : 'Laura'}
        userInitial={isNewUser ? '?' : 'L'}
        onPressProfile={() => Alert.alert('Perfil', 'Esta sección se construye en la Fase 7 del roadmap.')}
      />
      <ScrollView className="flex-1" contentContainerClassName="gap-3.5 px-5 pb-24 pt-4" showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}
