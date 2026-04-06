import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};

LocaleConfig.defaultLocale = "ko";

interface IMarkedDates {
  [date: string]: {
    selected: boolean;
    selectedColor: string;
    textColor: string;
  };
}

export default function TaskDetailScreen() {
  const { taskId, target_count, title } = useLocalSearchParams<{
    taskId: string;
    target_count: string;
    title: string;
  }>();
  const db = useSQLiteContext();
  const [markedDates, setMarkedDates] = useState<IMarkedDates>({});
  const [totalCount, setTotalCount] = useState(0);

  const fetchTaskLogs = async () => {
    try {
      const logs = await db.getAllAsync<{ log_date: string }>(
        "SELECT log_date FROM daily_logs WHERE task_id = ? ORDER BY log_date ASC",
        [taskId],
      );

      const taskInfo = await db.getFirstAsync<{ current_count: number }>(
        "SELECT current_count FROM tasks WHERE id = ?",
        [taskId],
      );

      const marked: IMarkedDates = {};
      logs.forEach((log) => {
        marked[log.log_date] = {
          selected: true,
          selectedColor: "#c39d97",
          textColor: "white",
        };
      });

      setMarkedDates(marked);
      setTotalCount(taskInfo?.current_count || 0);
    } catch (error) {
      console.error("로그 조회 실패:", error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await db.runAsync(`DELETE FROM tasks WHERE id = ?`, [taskId]);
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      console.error("태스크 삭제 실패:", error);
    }
  };

  useEffect(() => {
    fetchTaskLogs();
  }, [taskId]);

  return (
    <View className="flex-1 p-6 bg-beige">
      <View className="flex-row items-center justify-between pb-6">
        <Pressable onPress={() => router.back()}>
          <Feather name="x" size={26} color="black" />
        </Pressable>

        <Pressable
          onPress={() => {
            Alert.alert("삭제", "정말 삭제하시겠습니까?", [
              { text: "예", onPress: () => deleteTask(taskId) },
              {
                text: "아니오",
                style: "cancel",
              },
            ]);
          }}
        >
          <Feather name="trash-2" size={24} color="black" />
        </Pressable>
      </View>

      <Text className="text-2xl font-semibold">{title}</Text>

      <View className="mt-6 overflow-hidden border rounded-lg border-latte">
        <Calendar
          monthFormat="yyyy년 MM월"
          theme={{
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "bold",
            calendarBackground: "#f1eeeb",
            arrowColor: "#a09086",
            monthTextColor: "#a09086",
            todayTextColor: "#FF6B6B",
          }}
          markedDates={markedDates}
          enableSwipeMonths={true}
        />
      </View>

      <View className="mt-6">
        <Text className="text-lg font-semibold">완료 횟수</Text>

        <View className="flex-row items-center">
          <Text className="text-lg">{totalCount}</Text>
          <MaterialCommunityIcons
            name="slash-forward"
            size={16}
            color="#a1a1aa"
          />

          <Text className="text-lg">{target_count}</Text>
        </View>
      </View>
    </View>
  );
}
