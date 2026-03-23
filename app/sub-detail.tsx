import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};

LocaleConfig.defaultLocale = "ko";

export default function SubDetailScreen() {
  return (
    <View className="flex-1 p-6 bg-beige">
      <View className="flex-row items-center justify-between pb-6">
        <Pressable onPress={() => router.back()}>
          <Feather name="x" size={26} color="black" />
        </Pressable>

        <View className="flex-row items-center gap-x-4">
          <Pressable
            onPress={() => {
              Alert.alert("삭제", "정말 삭제하시겠습니까?", [
                { text: "예", onPress: () => console.log("") },
                {
                  text: "아니오",
                  onPress: () => console.log(""),
                  style: "cancel",
                },
              ]);
            }}
          >
            <Feather name="trash-2" size={24} color="#b91c1c" />
          </Pressable>
          <Pressable onPress={() => router.navigate("/sub-edit")}>
            <Feather name="edit" size={22} color="black" />
          </Pressable>
        </View>
      </View>

      <Text className="text-2xl font-semibold">스피닝 100회 하기</Text>

      <View className="mt-6 overflow-hidden border rounded-lg border-latte">
        <Calendar
          monthFormat="yyyy년 MM월"
          theme={{
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "bold",
            calendarBackground: "#f1eeeb",
            arrowColor: "#a09086",
            monthTextColor: "#a09086",
          }}
          markingType={"period"}
          markedDates={{
            "2026-03-15": {
              startingDay: true,
              color: "#c39d97",
              textColor: "white",
            },
            "2026-03-16": {
              endingDay: true,
              color: "#c39d97",
              textColor: "white",
            },
            "2026-03-21": {
              startingDay: true,
              color: "#c39d97",
              textColor: "white",
            },
            "2026-03-22": { color: "#c39d97", textColor: "white" },
            "2026-03-23": {
              color: "#c39d97",
              textColor: "white",
            },
            "2026-03-24": { color: "#c39d97", textColor: "white" },
            "2026-03-25": {
              endingDay: true,
              color: "#c39d97",
              textColor: "white",
            },
          }}
          enableSwipeMonths={true}
        />
      </View>

      <View className="mt-6">
        <Text className="text-lg font-semibold">완료 횟수</Text>
        <Text className="text-lg">10 / 50</Text>
      </View>
    </View>
  );
}
