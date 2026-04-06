import { formatDateToInsert } from "@/lib/formatDateToInsert";
import { IGoal } from "@/types/goal";
import { ITask } from "@/types/task";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();

  const [formData, setFormData] = useState<IGoal | null>(null);

  const loadDetailData = async () => {
    try {
      const goalResult = await db.getFirstAsync<IGoal | null>(
        `SELECT g.*, 
         (SELECT COUNT(*) FROM tasks WHERE goal_id = g.id) as task_count 
         FROM goals g WHERE g.id = ?`,
        [id as string],
      );

      const tasksResult = await db.getAllAsync<ITask>(
        `SELECT * FROM tasks WHERE goal_id = ? ORDER BY id ASC`,
        [id as string],
      );

      if (!goalResult) return;

      setFormData({
        ...goalResult,
        end_date: new Date(goalResult.end_date),
        tasks: tasksResult,
      });
    } catch (error) {
      console.error("상세 데이터 조회 실패:", error);
    }
  };

  const handleUpdate = async () => {
    if (!formData) return;
    const { title, end_date, tasks } = formData;

    const dateString = formatDateToInsert(end_date);

    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `UPDATE goals SET title = ?, end_date = ? WHERE id = ?`,
          [title, dateString, id as string],
        );
        await db.runAsync(`DELETE FROM tasks WHERE goal_id = ?`, [
          id as string,
        ]);

        for (const task of tasks) {
          await db.runAsync(
            `INSERT INTO tasks (id, goal_id, title, current_count, target_count)
           VALUES (?, ?, ?, ?, ?)`,
            [
              task.id,
              id as string,
              task.title,
              task.current_count,
              task.target_count,
            ],
          );
        }
      });

      return true;
    } catch (error) {
      console.error("수정 실패:", error);
      return false;
    }
  };

  useEffect(() => {
    if (id) loadDetailData();
  }, [id]);

  return (
    <ScrollView className="flex-1 p-6 bg-beige">
      <View className="flex-row items-center justify-between pb-6">
        <Pressable onPress={() => router.back()}>
          <Feather name="x" size={26} color="black" />
        </Pressable>

        <View className="flex-row items-center gap-x-4">
          <Pressable
            onPress={async () => {
              const result = await handleUpdate();
              if (result) {
                router.navigate("/");
              }
            }}
          >
            <Text className="text-xl font-semibold text-pink">완료</Text>
          </Pressable>
        </View>
      </View>

      <TextInput
        className="py-2 text-2xl font-semibold"
        placeholder="새로운 목표"
        defaultValue={formData?.title}
        onChangeText={(text) => {
          setFormData((prev) => (prev ? { ...prev, title: text } : prev));
        }}
        maxLength={25}
      />

      <View className="flex-row items-center justify-between mt-6">
        <Text className="text-xl">완료일</Text>

        <DateTimePicker
          mode="date"
          display="default"
          locale="ko-KR"
          value={formData?.end_date ? new Date(formData.end_date) : new Date()}
          onChange={(event, date) => {
            if (date) {
              setFormData((prev) =>
                prev ? { ...prev, end_date: date } : prev,
              );
            }
          }}
          minimumDate={new Date()}
        />
      </View>

      <View className="mt-6">
        <Text className="text-xl">계획</Text>

        {formData?.tasks.map((item) => (
          <View
            key={item.id}
            className="flex-row items-center justify-between my-2"
          >
            <Pressable
              onPress={() => {
                if (item.current_count > 0) {
                  Alert.alert("삭제", "정말 삭제하시겠습니까?", [
                    {
                      text: "예",
                      onPress: () => {
                        setFormData((prev) => {
                          if (!prev) return prev;
                          const remove = prev.tasks.filter(
                            (v) => v.id !== item.id,
                          );
                          return { ...prev, tasks: remove };
                        });
                      },
                    },
                    {
                      text: "아니오",
                      style: "cancel",
                    },
                  ]);
                  return;
                }

                setFormData((prev) => {
                  if (!prev) return prev;
                  const remove = prev.tasks.filter((v) => v.id !== item.id);
                  return { ...prev, tasks: remove };
                });
              }}
              className="w-7"
            >
              <Entypo name="circle-with-minus" size={20} color="#ccc" />
            </Pressable>

            <TextInput
              className="flex-1 pr-2 text-xl leading-6"
              placeholder="세부 계획"
              defaultValue={item.title}
              onChangeText={(text) =>
                setFormData((prev) => {
                  if (!prev) return prev;
                  const update = prev.tasks.map((v) =>
                    v.id === item.id ? { ...v, title: text } : v,
                  );
                  return { ...prev, tasks: update };
                })
              }
              maxLength={25}
            />
            <View className="flex-row items-center w-[110px] justify-between">
              <Text className="w-2/6 text-xl">{item.current_count}</Text>
              <MaterialCommunityIcons
                name="slash-forward"
                size={18}
                color="#71717a"
                className="w-1/6"
              />
              <TextInput
                className="w-2/6 pr-1 text-xl leading-6 text-right"
                placeholder="0"
                defaultValue={String(item.target_count)}
                onChangeText={(text) =>
                  setFormData((prev) => {
                    if (!prev) return prev;
                    const update = prev.tasks.map((v) =>
                      v.id === item.id
                        ? { ...v, target_count: Number(text) }
                        : v,
                    );
                    return { ...prev, tasks: update };
                  })
                }
                keyboardType="numeric"
                maxLength={3}
              />
              <Text className="w-1/6 text-lg text-zinc-500">회</Text>
            </View>
          </View>
        ))}

        <Pressable
          onPress={() => {
            const taskId = Crypto.randomUUID();
            setFormData((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                tasks: [
                  ...prev.tasks,
                  {
                    goal_id: id as string,
                    id: taskId,
                    title: "",
                    target_count: 0,
                    current_count: 0,
                  },
                ],
              };
            });
          }}
          className="items-center w-12 py-1 mt-1 rounded-full bg-pink"
        >
          <MaterialIcons name="add" size={20} color="#fff" />
        </Pressable>

        <View className="pb-40 mt-10">
          <Text className="text-xl">달성 회고</Text>

          <View className="relative mt-2 overflow-hidden rounded-lg min-h-40">
            <BlurView
              intensity={20}
              tint="light"
              className="absolute top-0 left-0 z-10 flex-row items-center justify-center h-full p-4 min-h-40"
            >
              <Text className="w-full text-base text-center">
                목표를 달성 후 나만의 회고록을 작성할 수 있습니다!
              </Text>
            </BlurView>

            <TextInput
              className="p-4 text-base bg-zinc-200 min-h-40"
              defaultValue={
                formData?.retrospective ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus a lorem viverra sodales. In aliquet elit quis tellus placerat"
              }
              onChangeText={(text) => {
                setFormData((prev) =>
                  prev ? { ...prev, retrospective: text } : prev,
                );
              }}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
