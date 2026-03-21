import { Stack } from "expo-router";
import React from "react";

import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "main",
};

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen
        name="sub-detail"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
