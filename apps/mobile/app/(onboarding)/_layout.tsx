import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FCFAFB' } }}>
      <Stack.Screen name="intro" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="privacy" />
    </Stack>
  );
}
