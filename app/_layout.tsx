import { Stack } from "expo-router";
import React from "react";

import { initDB } from "@/lib/db";
import { SQLiteProvider } from "expo-sqlite";
import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "main",
};

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="logplan.db" onInit={initDB}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="create" options={{ headerShown: false }} />
        <Stack.Screen name="detail" options={{ headerShown: false }} />
        <Stack.Screen
          name="edit"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sub-detail"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </SQLiteProvider>
  );
}
