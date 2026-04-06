import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

export const ProgressBar = ({ progress = 0 }: { progress?: number }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolate = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="w-full">
      <View className="flex-row justify-between mb-2">
        <Text className="text-sm font-medium">목표 달성률</Text>
        <Text className="text-sm font-semibold">{progress}%</Text>
      </View>

      <View className="relative w-full h-3 rounded-full bg-zinc-200">
        <View className="w-full h-full overflow-hidden rounded-full">
          <Animated.View
            style={{ width: widthInterpolate }}
            className="h-full bg-pink"
          />
        </View>

        <Animated.View
          style={{
            position: "absolute",
            left: widthInterpolate,
            marginLeft: -10,
          }}
          className="top-[-4] h-5 w-5 rounded-full border-2 border-beige bg-latte shadow-sm"
        />
      </View>
    </View>
  );
};
