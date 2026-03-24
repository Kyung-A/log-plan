import React from "react";
import { ScrollView, Text, View } from "react-native";

// 1. 실제 날짜 기반 데이터 생성 (최근 12주)
const generateDateData = () => {
  const data = [];
  const today = new Date();
  // 일요일(0)부터 시작하도록 맞추기 위해 시작 날짜 계산 (12주 전)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 83); // 12주 * 7일 - 1

  for (let i = 0; i <= 83; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    data.push({
      id: i,
      date: currentDate,
      month: currentDate.getMonth() + 1, // 1~12
      dayOfMonth: currentDate.getDate(),
      level: Math.floor(Math.random() * 5),
    });
  }
  return data;
};

const chunkArray = (arr: any[], size: number) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );
};

export const Heatmap = () => {
  const rawData = generateDateData();
  const weeks = chunkArray(rawData, 7);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-pink opacity-30";
      case 2:
        return "bg-pink opacity-60";
      case 3:
        return "bg-pink";
      case 4:
        return "bg-[#A6716D]";
      default:
        return "bg-zinc-300";
    }
  };

  const days = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* 상단 월 라벨 영역 */}
          <View className="flex-row h-4 mb-2 ml-8">
            {weeks.map((week, index) => {
              // 이번 주의 첫 번째 날이 1일~7일 사이라면 해당 월의 시작점으로 간주
              const firstDayOfWeek = week[0];
              const isMonthStart = firstDayOfWeek.dayOfMonth <= 7;

              return (
                <View key={index} style={{ width: 18 + 4 }}>
                  {/* 박스 너비(w-3.5=14) + 마진(m-[2px]*2=4) = 18px */}
                  {isMonthStart && (
                    <Text className="absolute w-10 text-xs">
                      {firstDayOfWeek.month}월
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          <View className="flex-row">
            {/* 요일 라벨 */}
            <View className="justify-between py-[2px] mr-3">
              {days.map((day) => (
                <Text
                  key={day}
                  className="text-[10px] text-zinc-500 h-3.5 leading-3.5"
                >
                  {day}
                </Text>
              ))}
            </View>

            {/* 데이터 그리드 */}
            <View className="flex-row">
              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} className="flex-col">
                  {week.map((day) => (
                    <View
                      key={day.id}
                      className={`w-3.5 h-3.5 m-[2px] rounded-sm ${getLevelColor(day.level)}`}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 범례 */}
      <View className="flex-row items-center justify-end mt-4">
        <Text className="mr-2 text-xs text-zinc-400">Less</Text>
        <View className="flex-row gap-x-1">
          <View className="w-3 h-3 rounded-sm bg-zinc-300" />
          <View className="w-3 h-3 rounded-sm bg-pink opacity-30" />
          <View className="w-3 h-3 rounded-sm bg-pink opacity-60" />
          <View className="w-3 h-3 rounded-sm bg-pink" />
          <View className="w-3 h-3 bg-[#A6716D] rounded-sm" />
        </View>
        <Text className="ml-2 text-xs text-zinc-400">More</Text>
      </View>
    </View>
  );
};
