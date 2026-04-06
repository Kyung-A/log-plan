import { Goal } from "@/components/Goal";
import { GoalTask } from "@/components/GoalTask";
import { IGoal } from "@/types/goal";
import { ITask } from "@/types/task";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Crypto from "expo-crypto";
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const query = `
        SELECT 
            g.id,
            g.title,
            g.end_date,
            g.is_completed,
            -- 모든 세부 계획의 현재 횟수 총합
            IFNULL(SUM(t.current_count), 0) AS total_current,
            -- 모든 세부 계획의 목표 횟수 총합
            IFNULL(SUM(t.target_count), 0) AS total_target,
            -- 달성률 계산
            CASE 
                WHEN IFNULL(SUM(t.target_count), 0) > 0 
                THEN ROUND(CAST(SUM(t.current_count) AS FLOAT) / SUM(t.target_count) * 100, 1)
                ELSE 0 
            END AS achievement_rate
        FROM goals g
        LEFT JOIN tasks t ON g.id = t.goal_id
        GROUP BY g.id
        ORDER BY g.created_at DESC;
    `;

const renderSection = ({
  item,
  expandedSections,
  setExpandedSections,
  checkTask,
}: {
  item: IGoal;
  expandedSections: string[];
  setExpandedSections: React.Dispatch<React.SetStateAction<string[]>>;
  checkTask: (taskId: string) => Promise<void>;
}) => {
  const isExpanded = expandedSections.includes(item.id);

  return (
    <View className="w-full mb-2">
      <Goal data={item} setExpandedSections={setExpandedSections} />
      {isExpanded && (
        <GoalTask goalId={item.id} task={item.tasks} checkTask={checkTask} />
      )}
    </View>
  );
};

export default function HomeScreen() {
  const db = useSQLiteContext();

  const [goals, setGoals] = useState<IGoal[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const loadData = async (isActive: boolean) => {
    try {
      const goalsResult = await db.getAllAsync<IGoal>(query);

      const tasksResult = await db.getAllAsync<ITask>(`
        SELECT 
          t.*,
          (SELECT COUNT(*) FROM daily_logs 
          WHERE task_id = t.id AND log_date = date('now', 'localtime')) > 0 AS is_done_today
        FROM tasks t 
        ORDER BY t.id ASC
      `);

      const result = goalsResult.map((goal) => ({
        ...goal,
        tasks: tasksResult.filter((task) => task.goal_id === goal.id),
      }));

      if (isActive) setGoals(result);
    } catch (error) {
      console.error("데이터 조회 실패:", error);
    }
  };

  const checkTask = async (taskId: string) => {
    try {
      await db.withTransactionAsync(async () => {
        const today = new Date().toISOString().split("T")[0];

        const existingLog = await db.getFirstAsync<{ id: string }>(
          "SELECT id FROM daily_logs WHERE task_id = ? AND log_date = ?",
          [taskId, today],
        );

        if (existingLog) {
          await db.runAsync("DELETE FROM daily_logs WHERE id = ?", [
            existingLog.id,
          ]);
          await db.runAsync(
            "UPDATE tasks SET current_count = MAX(0, current_count - 1) WHERE id = ?",
            [taskId],
          );
        } else {
          await db.runAsync(
            "INSERT INTO daily_logs (id, task_id, log_date) VALUES (?, ?, ?)",
            [Crypto.randomUUID(), taskId, today],
          );
          await db.runAsync(
            "UPDATE tasks SET current_count = current_count + 1 WHERE id = ?",
            [taskId],
          );
        }
      });

      await loadData(true);
    } catch (error) {
      console.error("토글 실패:", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      loadData(isActive);

      return () => {
        isActive = false;
      };
    }, [db]),
  );

  return (
    <SafeAreaView className="flex-1 bg-beige" edges={["top", "left", "right"]}>
      <View className="flex-1 p-6 bg-beige">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="px-2 text-3xl font-semibold">목표</Text>
          <Pressable onPress={() => router.navigate("/create")}>
            <MaterialIcons name="add" size={26} color="black" />
          </Pressable>
        </View>

        <View className="flex-row items-center mb-6 gap-x-2">
          {["전체", "진행중", "완료"].map((v) => (
            <TouchableOpacity
              key={v}
              className="px-4 py-1 rounded-full bg-zinc-300"
            >
              <Text className="text-sm">{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={goals}
          renderItem={({ item }) =>
            renderSection({
              item,
              expandedSections,
              setExpandedSections,
              checkTask,
            })
          }
          keyExtractor={(item) => item.id}
          extraData={expandedSections}
        />
      </View>
    </SafeAreaView>
  );
}
