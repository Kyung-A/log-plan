import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Create() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [subList, setSubList] = useState<
    { id: string; title: string; count: number }[]
  >([]);

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
            // onPress={() => router.back()}
            className="absolute z-10 flex-row items-center gap-x-1 right-4"
          >
            <Text className="text-xl font-semibold text-pink">등록</Text>
          </Pressable>
        </View>

        <View className="p-6">
          <TextInput
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
              value={selectedDate}
              onChange={(event, date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              minimumDate={new Date()}
            />
          </View>

          <View className="mt-6">
            <Text className="text-xl">계획</Text>

            <FlatList
              data={subList}
              renderItem={({ item }) => (
                <View className="flex-row items-center justify-between mb-2">
                  <Pressable
                    onPress={() => {
                      setSubList((prev) => {
                        const remove = prev.filter((v) => v.id !== item.id);
                        return remove;
                      });
                    }}
                    className="w-7"
                  >
                    <Entypo name="circle-with-minus" size={20} color="#ccc" />
                  </Pressable>

                  <TextInput
                    className="flex-1 pb-1 text-xl"
                    placeholder="세부 계획"
                    maxLength={25}
                  />
                  <View className="flex-row items-center justify-center w-16 gap-x-1">
                    <TextInput
                      className="flex-1 p-0 pb-1 text-xl text-right"
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
                setSubList((prev) => [
                  ...prev,
                  { id: id, title: "", count: 0 },
                ]);
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
