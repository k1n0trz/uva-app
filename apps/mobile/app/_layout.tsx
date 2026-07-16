import '../global.css';

import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        {/* On web, keep an app-like centered column instead of stretching
            full width — brief §5: "no estires excesivamente el contenido,
            usa un ancho máximo cómodo para las áreas personales". Sidebar
            layout for wide screens is a later-phase enhancement. */}
        <View style={Platform.OS === 'web' ? { flex: 1, alignItems: 'center', backgroundColor: '#F4EDEF' } : { flex: 1 }}>
          <View style={Platform.OS === 'web' ? { flex: 1, width: '100%', maxWidth: 480 } : { flex: 1, width: '100%' }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="rescue" options={{ presentation: 'modal' }} />
              <Stack.Screen name="first-cup" options={{ presentation: 'modal' }} />
              <Stack.Screen name="kegel-intake" options={{ presentation: 'modal' }} />
              <Stack.Screen name="my-products" options={{ presentation: 'modal' }} />
              <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
              <Stack.Screen name="memory" options={{ presentation: 'modal' }} />
              <Stack.Screen name="privacy" options={{ presentation: 'modal' }} />
              <Stack.Screen name="routine/[id]" options={{ presentation: 'fullScreenModal' }} />
            </Stack>
          </View>
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
