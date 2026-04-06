import dayjs from "dayjs";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

interface IHeatmapProps {
  startDate?: string;
  endDate?: Date | string;
  logs: { date: string; count_increment: number }[];
}

export const Heatmap = ({ startDate, endDate, logs }: IHeatmapProps) => {
  const heatmapData = useMemo(() => {
    if (!startDate) return [];

    const data = [];
    const today = dayjs();

    const start = dayjs(startDate).startOf("week");

    const targetEnd =
      endDate && dayjs(endDate).isBefore(today) ? dayjs(endDate) : today;

    const displayEnd = targetEnd.endOf("week");
    const diffDays = displayEnd.diff(start, "day");

    for (let i = 0; i <= diffDays; i++) {
      const current = start.add(i, "day");
      const dateStr = current.format("YYYY-MM-DD");

      const logEntry = logs.find((l) => l.date === dateStr);
      const count = logEntry ? logEntry.count_increment : 0;

      const isFuture = current.isAfter(today, "day");

      let level = 0;
      if (!isFuture) {
        if (count > 0 && count <= 1) level = 1;
        else if (count > 1 && count <= 3) level = 2;
        else if (count > 3 && count <= 5) level = 3;
        else if (count > 5) level = 4;
      }

      data.push({
        date: dateStr,
        month: current.month() + 1,
        dayOfMonth: current.date(),
        level: level,
        isFuture: isFuture,
      });
    }

    return data;
  }, [startDate, endDate, logs]);

  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      result.push(heatmapData.slice(i, i + 7));
    }
    return result;
  }, [heatmapData]);

  const getLevelColor = (level: number, isFuture: boolean) => {
    if (isFuture) return "bg-transparent";

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
        return "bg-zinc-200";
    }
  };

  const daysLabels = ["일", "", "화", "", "목", "", "토"];

  return (
    <View className="py-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View className="flex-row h-5 mb-1 ml-8">
            {weeks.map((week, index) => {
              const firstDay = week[0];
              const isFirstWeekOfMonth = firstDay.dayOfMonth <= 7;
              const hasVisibleDay = week.some((d) => !d.isFuture);

              return (
                <View key={index} style={{ width: 18 }}>
                  {isFirstWeekOfMonth && hasVisibleDay && (
                    <Text className="absolute text-[10px] text-zinc-500 w-10">
                      {firstDay.month}월
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          <View className="flex-row">
            <View className="justify-between py-[2px] mr-2">
              {daysLabels.map((day, i) => (
                <Text
                  key={i}
                  className="text-[9px] text-zinc-400 h-3.5 leading-3.5"
                >
                  {day}
                </Text>
              ))}
            </View>

            <View className="flex-row">
              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} className="flex-col">
                  {week.map((day, dayIndex) => (
                    <View
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3.5 h-3.5 m-[2px] rounded-sm ${getLevelColor(day.level, day.isFuture)}`}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-end mt-3">
        <Text className="mr-2 text-[10px] text-zinc-400">Less</Text>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <View
            key={lvl}
            className={`w-3 h-3 m-[1px] rounded-sm ${getLevelColor(lvl, false)}`}
          />
        ))}
        <Text className="ml-2 text-[10px] text-zinc-400">More</Text>
      </View>
    </View>
  );
};
