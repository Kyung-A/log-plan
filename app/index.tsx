import { Goal } from "@/components/Goal";
import { GoalTask } from "@/components/GoalTask";
import { IGoal } from "@/types/goal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const renderSection = ({ item }: { item: IGoal }) => {
    const isExpanded = expandedSections.includes(item.id);

    return (
      <View className="w-full mb-2">
        <Goal data={item} setExpandedSections={setExpandedSections} />

        {isExpanded && <GoalTask task={item.tasks} />}
      </View>
    );
  };

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
          data={[]}
          renderItem={renderSection}
          keyExtractor={(item) => item.title}
        />
      </View>
    </SafeAreaView>
  );
}
