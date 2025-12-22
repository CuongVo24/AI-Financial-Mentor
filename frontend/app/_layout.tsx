import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { AccessibilityService } from '../src/services/accessibility';

export default function RootLayout() {

  useEffect(() => {
    // 1. Activate The Spy
    console.log("Initializing Money Locket Spy...");
    const cleanup = AccessibilityService.startListening();

    // 2. Check Permission (Optional: could show alert if not enabled)
    AccessibilityService.isEnabled().then(enabled => {
      console.log("Accessibility Service Enabled:", enabled);
      if (!enabled) {
        // TODO: Maybe redirect to a 'Permission Request' screen later
      }
    });

    return () => {
      cleanup && cleanup();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}