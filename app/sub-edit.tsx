import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

export default function SubEditScreen() {
  return (
    <View className="flex-1 p-6 bg-beige">
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
        placeholder="세부 계획"
        defaultValue="자전거 100번 연습하기"
        maxLength={25}
      />

      <View className="mt-6">
        <Text className="text-lg font-semibold">완료횟수</Text>

        <View className="flex-row items-center">
          <Text className="text-lg">25</Text>
          <MaterialCommunityIcons
            name="slash-forward"
            size={16}
            color="black"
            className="mx-2"
          />
          <TextInput
            className="pb-1 text-lg"
            placeholder="0"
            keyboardType="numeric"
            maxLength={3}
          />
          <Text className="ml-1 text-lg">회</Text>
        </View>
      </View>
    </View>
  );
}
