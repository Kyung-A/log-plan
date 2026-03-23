import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
import { SafeAreaView } from "react-native-safe-area-context";

const sectionListData = [
  {
    id: 1,
    title: "몸무게 4123128kg 달성 몸무게 4123128kg 달성",
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
    title: "몸무게 48kg 달성",
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
        title: "마라톤 대회 3회 출전하기 마라톤 대회 3회 출전하기",
        goal: 100,
        count: 200,
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
            className={`text-lg font-semibold max-w-72 ${isInverted ? "text-white" : "text-pink"}`}
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
          className="relative justify-center w-full overflow-hidden border rounded-full border-pink bg-beige"
        >
          <ContentText isInverted={false} />

          <View
            style={{
              width: `${item.totalRate}%`,
            }}
            className="absolute top-0 left-0 overflow-hidden bg-pink bottom-"
          >
            <ContentText isInverted={true} />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View className="w-[90%] -mt-4 mx-auto -z-10 border border-latte rounded-b-xl py-4 pt-6">
            {item.data.map((subItem) => (
              <View
                key={subItem.id}
                className="flex-row items-start justify-between flex-1 px-4 py-2"
              >
                <View className="flex-row items-start flex-1 gap-x-2">
                  <Pressable className="pt-[2.5px]">
                    <MaterialIcons
                      name="radio-button-unchecked"
                      size={20}
                      color="#a09086"
                    />
                  </Pressable>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => router.push("/sub-detail")}
                  >
                    <Text className="flex-1 text-lg max-w-52 text-balanc text-latte">
                      {subItem.title}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => router.push("/sub-detail")}
                  className="flex-row items-center justify-center"
                >
                  <Text className="text-lg text-latte">{subItem.goal}</Text>
                  <MaterialCommunityIcons
                    name="slash-forward"
                    size={16}
                    color="#a09086"
                  />
                  <Text className="text-lg font-semibold text-latte">
                    {subItem.count}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-beige" edges={["top", "left", "right"]}>
      <View className="flex-1 p-6 bg-beige">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="px-2 text-3xl font-semibold">목표</Text>
          <Pressable onPress={() => router.navigate("/create")}>
            <MaterialIcons name="add" size={26} color="black" />
          </Pressable>
        </View>
        <FlatList
          data={sectionListData}
          renderItem={renderSection}
          keyExtractor={(item) => item.title}
        />
      </View>
    </SafeAreaView>
  );
}
