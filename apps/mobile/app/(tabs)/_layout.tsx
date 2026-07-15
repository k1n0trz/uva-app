import { Tabs } from 'expo-router';
import { BottomNavigation } from '../../components/nav';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavigation state={props.state} navigation={props.navigation} />}
    >
      <Tabs.Screen name="hoy" options={{ title: 'Hoy' }} />
      <Tabs.Screen name="calendario" options={{ title: 'Calendario' }} />
      <Tabs.Screen name="vera" options={{ title: 'Vera' }} />
      <Tabs.Screen name="rutinas" options={{ title: 'Rutinas' }} />
      <Tabs.Screen name="tienda" options={{ title: 'Tienda' }} />
    </Tabs>
  );
}
