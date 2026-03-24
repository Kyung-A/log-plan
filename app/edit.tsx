import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [subList, setSubList] = useState<
    { id: string; title: string; count: number }[]
  >([
    { id: "1", title: "계획", count: 53 },
    { id: "2", title: "계획", count: 999 },
  ]);

  return (
    <ScrollView className="flex-1 p-6 bg-beige">
      <View className="flex-row items-center justify-between pb-6">
        <Pressable onPress={() => router.back()}>
          <Feather name="x" size={26} color="black" />
        </Pressable>

        <View className="flex-row items-center gap-x-4">
          <Pressable>
            <Text className="text-xl font-semibold text-pink">완료</Text>
          </Pressable>
        </View>
      </View>

      <TextInput
        className="py-2 text-2xl font-semibold"
        placeholder="새로운 목표"
        defaultValue="줄넘기 100회 하기"
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
                  if (item.count > 0) {
                    Alert.alert("삭제", "정말 삭제하시겠습니까?", [
                      {
                        text: "예",
                        onPress: () => {
                          setSubList((prev) => {
                            const remove = prev.filter((v) => v.id !== item.id);
                            return remove;
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
                className="flex-1 pr-2 text-xl leading-6"
                placeholder="세부 계획"
                defaultValue={item.title}
                maxLength={25}
              />
              <View className="flex-row items-center w-[110px] justify-between">
                <Text className="w-2/6 text-xl">999</Text>
                <MaterialCommunityIcons
                  name="slash-forward"
                  size={18}
                  color="#71717a"
                  className="w-1/6"
                />
                <TextInput
                  className="w-2/6 pr-1 text-xl leading-6 text-right"
                  placeholder="0"
                  defaultValue={String(item.count)}
                  keyboardType="numeric"
                  maxLength={3}
                />
                <Text className="w-1/6 text-lg text-zinc-500">회</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          className="mt-2"
        />

        <Pressable
          onPress={() => {
            const id = Crypto.randomUUID();
            setSubList((prev) => [...prev, { id: id, title: "", count: 0 }]);
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
              defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam lectus a lorem viverra sodales. In aliquet elit quis tellus placerat"
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
