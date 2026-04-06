import { Heatmap } from "@/components/Heatmap";
import { ProgressBar } from "@/components/ProgressBar";
import { ddayCounter } from "@/lib/ddayCounter";
import { formatDateToInsert } from "@/lib/formatDateToInsert";
import { IGoal } from "@/types/goal";
import { ITask } from "@/types/task";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();

  const [data, setData] = useState<IGoal | null>(null);
  const [heatmapLogs, setHeatmapLogs] = useState<
    { date: string; count_increment: number }[]
  >([]);

  const loadDetailData = async () => {
    try {
      const goalResult = await db.getFirstAsync<IGoal | null>(
        `
          SELECT 
              g.*, 
              -- 모든 세부 계획의 현재 횟수 총합
              IFNULL(SUM(t.current_count), 0) AS total_current,
              -- 모든 세부 계획의 목표 횟수 총합
              IFNULL(SUM(t.target_count), 0) AS total_target,
              -- 달성률 계산
              CASE 
                  WHEN IFNULL(SUM(t.target_count), 0) > 0 
                  THEN ROUND(CAST(SUM(t.current_count) AS FLOAT) / SUM(t.target_count) * 100, 1)
                  ELSE 0 
              END AS achievement_rate,
              COUNT(t.id) AS task_count
          FROM goals g
          LEFT JOIN tasks t ON g.id = t.goal_id
          WHERE g.id = ?
          GROUP BY g.id;
         `,
        [id as string],
      );

      const tasksResult = await db.getAllAsync<ITask>(
        `SELECT * FROM tasks WHERE goal_id = ? ORDER BY id ASC`,
        [id as string],
      );

      if (!goalResult) return;

      setData({
        ...goalResult,
        end_date: new Date(goalResult.end_date),
        tasks: tasksResult,
      });
    } catch (error) {
      console.error("상세 데이터 조회 실패:", error);
    }
  };

  const fetchHeatmap = async () => {
    const rows = await db.getAllAsync<{ date: string; count: number }>(
      `SELECT l.log_date AS date, SUM(l.count_increment) AS count_increment
        FROM daily_logs l
        JOIN tasks t ON l.task_id = t.id
        WHERE t.goal_id = ?
        GROUP BY l.log_date
      `,
      [id as string],
    );
    setHeatmapLogs(rows);
  };

  useEffect(() => {
    if (id) fetchHeatmap();
  }, [id]);

  useEffect(() => {
    if (id) loadDetailData();
  }, [id]);

  return (
    <SafeAreaView className="flex-1 bg-beige" edges={["top", "left", "right"]}>
      <ScrollView className="flex-1 bg-beige">
        <View className="flex-row items-center w-full h-12 px-4 border-b border-zinc-300">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-x-1"
          >
            <Feather name="chevron-left" size={22} color="#71717a" />
            <Text className="text-xl text-zinc-500">뒤로</Text>
          </Pressable>
        </View>

        <View className="px-6 py-6 pb-40 gap-y-6">
          <View>
            <Text className="mb-1 text-2xl font-semibold">{data?.title}</Text>
            <View className="">
              <Text className="text-sm text-zinc-500">
                {data?.end_date && formatDateToInsert(data.end_date)} 까지
              </Text>
              <Text className="text-xl font-black text-pink">
                {data?.end_date &&
                  ddayCounter(formatDateToInsert(data.end_date))}
              </Text>
            </View>
          </View>

          <ProgressBar progress={data?.achievement_rate} />
          <Heatmap
            startDate={data?.created_at}
            endDate={data?.end_date}
            logs={heatmapLogs}
          />

          <View>
            <Text className="mb-2 text-lg">세부 계획</Text>

            {data?.tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => router.navigate("/sub-detail")}
                className="flex-row flex-wrap items-start justify-between px-4 py-3 mb-2 rounded-full bg-zinc-200"
              >
                <Text className="w-[66%] pr-2 text-base">{task.title}</Text>

                <View className="flex-row items-center">
                  <Text className="text-base">{task.current_count}</Text>
                  <MaterialCommunityIcons
                    name="slash-forward"
                    size={16}
                    color="#a1a1aa"
                  />
                  <Text className="text-base font-semibold">
                    {task.target_count}
                  </Text>
                  <Text className="text-base text-zinc-500"> 회</Text>
                  <Entypo
                    name="chevron-small-right"
                    size={22}
                    color="#a1a1aa"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View>
            <Text className="text-lg">달성 회고</Text>

            <View className="relative mt-2 overflow-hidden rounded-lg min-h-40">
              <BlurView
                intensity={20}
                tint="light"
                className="absolute top-0 left-0 z-10 flex-row items-center justify-center h-full p-4 min-h-40"
              >
                <Text className="w-full text-base text-center text-zinc-800">
                  목표를 달성 후 나만의 회고록을 작성할 수 있습니다!
                </Text>
              </BlurView>

              <Text className="p-4 text-base bg-zinc-200 min-h-40">
                {data?.retrospective ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus a lorem viverra sodales. In aliquet elit quis tellus placerat Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus a lorem viverra sodales. In aliquet elit quis tellus placerat Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus a lorem viverra sodales. In aliquet elit quis tellus placerat"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
