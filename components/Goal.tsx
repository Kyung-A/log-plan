import { ddayCounter } from "@/lib/ddayCounter";
import { formatDateToInsert } from "@/lib/formatDateToInsert";
import { IGoal } from "@/types/goal";
import { useCallback, useState } from "react";
import { LayoutChangeEvent, Text, TouchableOpacity, View } from "react-native";

const ContentText = ({
  isInverted,
  data,
  parentWidth,
}: {
  isInverted: boolean;
  data: IGoal;
  parentWidth: number;
}) => (
  <View
    style={{ width: parentWidth }}
    className="flex-row items-center justify-between px-6 py-4"
  >
    <View>
      <Text
        className={`text-lg font-semibold max-w-72 ${isInverted ? "text-white" : "text-pink"}`}
      >
        {data.title}
      </Text>
      <View className="flex-row items-center">
        <Text
          className={`text-base ${isInverted ? "text-white/70" : "text-zinc-400"}`}
        >
          {formatDateToInsert(data.end_date)}
        </Text>
        <Text
          className={`text-base ml-2 font-semibold ${isInverted ? "text-white/80" : "text-zinc-400"}`}
        >
          {ddayCounter(formatDateToInsert(data.end_date))}
        </Text>
      </View>
    </View>
    <Text
      className={`text-xl font-semibold ${isInverted ? "text-white" : "text-pink"}`}
    >
      {data.achievement_rate}%
    </Text>
  </View>
);

export const Goal = ({
  data,
  setExpandedSections,
}: {
  data: IGoal;
  setExpandedSections: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [parentWidth, setParentWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setParentWidth(width);
  };

  const toggleSection = useCallback(
    (id: string) => {
      setExpandedSections((prevSections) => {
        if (prevSections.includes(id)) {
          return prevSections.filter((t) => t !== id);
        } else {
          return [...prevSections, id];
        }
      });
    },
    [setExpandedSections],
  );

  return (
    <TouchableOpacity
      onLayout={onLayout}
      onPress={() => toggleSection(data.id)}
      activeOpacity={0.9}
      className="relative justify-center w-full overflow-hidden border rounded-full border-pink bg-beige"
    >
      <ContentText isInverted={false} data={data} parentWidth={parentWidth} />

      <View
        style={{
          width: `${data.achievement_rate}%`,
        }}
        className="absolute top-0 left-0 overflow-hidden bg-pink bottom-"
      >
        <ContentText isInverted={true} data={data} parentWidth={parentWidth} />
      </View>
    </TouchableOpacity>
  );
};
