import { DDayCounter } from "@/components/DDayCounter";
import { Heatmap } from "@/components/Heatmap";
import { ProgressBar } from "@/components/ProgressBar";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailScreen() {
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
            <Text className="mb-1 text-2xl font-semibold">
              스피닝 100회 하기
            </Text>
            <DDayCounter />
          </View>

          <ProgressBar />
          <Heatmap />

          <View>
            <Text className="mb-2 text-lg">세부 계획</Text>
            <FlatList
              data={[1, 2, 3, 4, 5]}
              renderItem={() => (
                <TouchableOpacity
                  onPress={() => router.navigate("/sub-detail")}
                  className="flex-row flex-wrap items-start justify-between px-4 py-3 mb-2 rounded-full bg-zinc-200"
                >
                  <Text className="w-[66%] pr-2 text-base">
                    매일매일 출석하기
                  </Text>

                  <View className="flex-row items-center">
                    <Text className="text-base">999</Text>
                    <MaterialCommunityIcons
                      name="slash-forward"
                      size={16}
                      color="#a1a1aa"
                    />
                    <Text className="text-base font-semibold">999</Text>
                    <Text className="text-base text-zinc-500"> 회</Text>
                    <Entypo
                      name="chevron-small-right"
                      size={22}
                      color="#a1a1aa"
                    />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                aliquam lectus a lorem viverra sodales. In aliquet elit quis
                tellus placerat sollicitudin. Cras tellus risus, varius varius
                egestas eget, porta sit amet ante. Integer placerat fermentum
                justo, id elementum odio auctor ac. Donec sed justo vitae sem
                aliquet maximus. Nunc dui massa, dictum aliquam odio quis,
                tincidunt imperdiet lorem. Fusce hendrerit placerat laoreet.
                Nunc vitae iaculis mi. In tincidunt tellus quis arcu lobortis,
                in tincidunt tortor scelerisque.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
