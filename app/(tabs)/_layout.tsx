import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 70, backgroundColor: "#f1eeeb" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          // tabBarIcon: ({ color }) => (
          //   <IconSymbol size={28} name="house.fill" color={color} />
          // ),
        }}
      />
    </Tabs>
  );
}
