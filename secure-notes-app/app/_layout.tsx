// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="add-note" 
            options={{ 
              presentation: 'modal',
              headerShown: true,
              title: 'Add Note'
            }} 
          />
          <Stack.Screen 
            name="edit-note" 
            options={{ 
              presentation: 'modal',
              headerShown: true,
              title: 'Edit Note'
            }} 
          />
        </>
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}