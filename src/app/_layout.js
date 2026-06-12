import React from 'react';
import { Stack } from 'expo-router';
import { ShoppingPlanProvider } from '../context/ShoppingPlanContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <ShoppingPlanProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="kategori-sec" options={{ presentation: 'modal' }} />
        <Stack.Screen name="liste-yaz" options={{ presentation: 'modal' }} />
        <Stack.Screen name="plan-detay/[type]" options={{ presentation: 'card' }} />
      </Stack>
    </ShoppingPlanProvider>
  );
}
