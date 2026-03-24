import React from "react";
import { Text, View } from "react-native";

export const DDayCounter = () => {
  const now = new Date();
  const target = new Date("2026-10-11");

  // 1. 날짜 차이 계산 (밀리초 -> 일 단위)
  const diffTime = target.getTime() - now.getTime();
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // D-Day 라벨 처리
  const dDayLabel =
    remainingDays === 0
      ? "D-Day"
      : remainingDays > 0
        ? `D-${remainingDays}`
        : `D+${Math.abs(remainingDays)}`;

  return (
    <View className="">
      <Text className="text-sm text-zinc-500">2026-10-11까지</Text>
      <Text className="text-xl font-black text-pink">{dDayLabel}</Text>
    </View>
  );
};
