import { Stack } from "expo-router";
import React, { Suspense } from "react";

import { initDB } from "@/lib/db";
import { SQLiteProvider } from "expo-sqlite";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "main",
};

export default function RootLayout() {
  return (
    <Suspense
      fallback={
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      }
    >
      <SQLiteProvider databaseName="logplan.db" onInit={initDB} useSuspense>
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="create" />
          <Stack.Screen name="[id]/index" />
          <Stack.Screen
            name="[id]/edit"
            options={{
              presentation: "modal",
            }}
          />
          <Stack.Screen
            name="[id]/[taskId]/index"
            options={{
              presentation: "modal",
            }}
          />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}
