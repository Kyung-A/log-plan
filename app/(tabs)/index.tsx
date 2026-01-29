import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const sectionListData = [
  {
    id: 1,
    title: "몸무게 48kg 달성",
    deadline: "2025-06-01",
    totalRate: 32,
    data: [
      {
        id: 11,
        title: "스피닝 100회 하기",
        goal: 100,
        count: 80,
      },
      {
        id: 12,
        title: "주 2회 PT 가기",
        goal: 50,
        count: 10,
      },
      {
        id: 13,
        title: "마라톤 대회 3회 출전하기",
        goal: 3,
        count: 1,
      },
    ],
  },
  {
    id: 2,
    title: "몸무게 4123128kg 달성",
    deadline: "2025-06-01",
    totalRate: 100,
    data: [
      {
        id: 21,
        title: "스피닝 100회 하기",
        goal: 100,
        count: 80,
      },
      {
        id: 22,
        title: "주 2회 PT 가기",
        goal: 50,
        count: 10,
      },
      {
        id: 23,
        title: "마라톤 대회 3회 출전하기",
        goal: 3,
        count: 1,
      },
    ],
  },
];

interface IData {
  id: number;
  title: string;
  deadline: string;
  totalRate: number;
  data: {
    id: number;
    title: string;
    goal: number;
    count: number;
  }[];
}

export default function HomeScreen() {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [parentWidth, setParentWidth] = useState(0);

  const toggleSection = useCallback((id: number) => {
    setExpandedSections((prevSections) => {
      if (prevSections.includes(id)) {
        return prevSections.filter((t) => t !== id);
      } else {
        return [...prevSections, id];
      }
    });
  }, []);

  const renderSection = ({ item }: { item: IData }) => {
    const isExpanded = expandedSections.includes(item.id);

    const onLayout = (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setParentWidth(width);
    };

    const ContentText = ({ isInverted }: { isInverted: boolean }) => (
      <View
        style={{ width: parentWidth }}
        className="flex-row items-center justify-between px-6 py-4"
      >
        <View>
          <Text
            className={`text-lg font-semibold ${isInverted ? "text-white" : "text-pink"}`}
          >
            {item.title}
          </Text>
          <View className="flex-row items-center">
            <Text
              className={`text-base ${isInverted ? "text-white/70" : "text-zinc-400"}`}
            >
              {item.deadline}
            </Text>
            <Text
              className={`text-base ml-2 font-semibold ${isInverted ? "text-white/80" : "text-zinc-400"}`}
            >
              D-19
            </Text>
          </View>
        </View>
        <Text
          className={`text-xl font-semibold ${isInverted ? "text-white" : "text-pink"}`}
        >
          {item.totalRate}%
        </Text>
      </View>
    );

    return (
      <View className="w-full mb-2">
        <TouchableOpacity
          onLayout={onLayout}
          onPress={() => toggleSection(item.id)}
          activeOpacity={0.9}
          className="w-full border border-pink bg-beige rounded-full relative overflow-hidden justify-center"
        >
          <ContentText isInverted={false} />

          <View
            style={{
              width: `${item.totalRate}%`,
            }}
            className="overflow-hidden bg-pink bottom- top-0 left-0 absolute"
          >
            <ContentText isInverted={true} />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View className="w-[90%] -mt-2 mx-auto -z-10 border border-latte rounded-b-xl py-4 pt-6">
            {item.data.map((subItem) => (
              <View
                key={subItem.id}
                className="py-2 px-4 flex-row justify-between items-center"
              >
                <Text className="text-lg text-latte">{subItem.title}</Text>
                <View className="flex-row justify-center items-center">
                  <Text className="text-lg text-latte">{subItem.goal}</Text>
                  <Text className="text-lg text-latte mx-1">/</Text>
                  <Text className="text-lg text-latte font-semibold">
                    {subItem.count}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-beige p-6">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-3xl font-semibold px-2">목표</Text>
        <Pressable onPress={() => router.push("/create")}>
          <Ionicons name="add" size={26} color="black" />
        </Pressable>
      </View>
      <FlatList
        data={sectionListData}
        renderItem={renderSection}
        keyExtractor={(item) => item.title}
      />
    </View>
  );
}
