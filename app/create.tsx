import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IGoal {
  title: string;
  endDate: Date;
  taskList: { id: string; title: string; targetCount: number }[];
}

export default function CreateScreen() {
  const db = useSQLiteContext();

  const [form, setForm] = useState<IGoal>({
    title: "",
    endDate: new Date(),
    taskList: [],
  });

  const addNewGoal = useCallback(
    async (formData: IGoal): Promise<boolean> => {
      const { title, endDate, taskList } = formData;
      const dateString = endDate.toISOString().split("T")[0];
      const goalId = Crypto.randomUUID();

      try {
        await db.withTransactionAsync(async () => {
          await db.runAsync(
            `INSERT INTO goals (id, title, end_date) VALUES (?, ?, ?)`,
            [goalId, title, dateString],
          );

          for (const task of taskList) {
            await db.runAsync(
              `INSERT INTO tasks (goal_id, id, title, target_count) VALUES (?, ?, ?, ?)`,
              [goalId, task.id, task.title, task.targetCount],
            );
          }
        });

        return true;
      } catch (error) {
        console.error("목표 생성 실패:", error);
        return false;
      }
    },
    [db],
  );

  return (
    <SafeAreaView className="flex-1 bg-beige" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-beige">
        <View className="relative flex-row items-center justify-center w-full h-12 border-b border-zinc-300">
          <Pressable
            onPress={() => router.back()}
            className="absolute z-10 flex-row items-center gap-x-1 left-4"
          >
            <Feather name="chevron-left" size={22} color="#71717a" />
            <Text className="text-xl text-zinc-500">뒤로</Text>
          </Pressable>
          <Text className="w-full text-xl font-semibold text-center">
            목표 추가
          </Text>
          <Pressable
            onPress={async () => {
              const result = await addNewGoal(form);
              if (result) {
                router.navigate("/");
              }
            }}
            className="absolute z-10 flex-row items-center gap-x-1 right-4"
          >
            <Text className="text-xl font-semibold text-pink">등록</Text>
          </Pressable>
        </View>

        <View className="p-6">
          <TextInput
            defaultValue={form.title}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, title: text }))
            }
            className="py-2 text-2xl font-semibold"
            placeholder="새로운 목표"
            maxLength={25}
          />

          <View className="flex-row items-center justify-between mt-6">
            <Text className="text-xl">완료일</Text>

            <DateTimePicker
              mode="date"
              display="default"
              locale="ko-KR"
              value={form.endDate}
              onChange={(event, date) => {
                if (date) {
                  setForm((prev) => ({ ...prev, endDate: date }));
                }
              }}
              minimumDate={new Date()}
            />
          </View>

          <View className="mt-6">
            <Text className="text-xl">계획</Text>

            <FlatList
              data={form.taskList}
              renderItem={({ item }) => (
                <View className="flex-row items-center justify-between mb-2">
                  <Pressable
                    onPress={() => {
                      setForm((prev) => ({
                        ...prev,
                        taskList: prev.taskList.filter((v) => v.id !== item.id),
                      }));
                    }}
                    className="w-7"
                  >
                    <Entypo name="circle-with-minus" size={20} color="#ccc" />
                  </Pressable>

                  <TextInput
                    defaultValue={item.title}
                    onChangeText={(text) =>
                      setForm((prev) => ({
                        ...prev,
                        taskList: prev.taskList.map((v) =>
                          v.id === item.id ? { ...v, title: text } : v,
                        ),
                      }))
                    }
                    className="flex-1 text-xl leading-6"
                    placeholder="세부 계획"
                    maxLength={25}
                  />
                  <View className="flex-row items-center justify-center w-16 gap-x-1">
                    <TextInput
                      defaultValue={
                        item.targetCount ? String(item.targetCount) : ""
                      }
                      onChangeText={(text) =>
                        setForm((prev) => ({
                          ...prev,
                          taskList: prev.taskList.map((v) =>
                            v.id === item.id
                              ? { ...v, targetCount: Number(text) }
                              : v,
                          ),
                        }))
                      }
                      className="flex-1 text-xl leading-6 text-right"
                      placeholder="0"
                      keyboardType="numeric"
                      maxLength={3}
                    />
                    <Text className="text-lg shrink-0 text-zinc-500">회</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
              className="mt-2"
            />

            <Pressable
              onPress={() => {
                const id = Crypto.randomUUID();
                setForm((prev) => ({
                  ...prev,
                  taskList: [
                    ...prev.taskList,
                    { id: id, title: "", targetCount: 0 },
                  ],
                }));
              }}
              className="items-center w-12 py-1 mt-1 rounded-full bg-pink"
            >
              <MaterialIcons name="add" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
