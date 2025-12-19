import { Stack } from 'expo-router';
import React from 'react';
import '../global.css'; // Assuming NativeWind requires importing the CSS entry point

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}