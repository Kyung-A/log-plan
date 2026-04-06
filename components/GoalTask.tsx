import { ITask } from "@/types/task";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { RelativePathString, router } from "expo-router";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";

export const GoalTask = ({
  goalId,
  task,
  checkTask,
}: {
  goalId: string;
  task: ITask[];
  checkTask: (taskId: string) => Promise<void>;
}) => {
  return (
    <View className="w-[90%] -mt-4 mx-auto -z-10">
      <View className="py-4 pt-6 border rounded-bl-lg border-latte">
        {task && task.length > 0 ? (
          task.map((subItem) => (
            <View
              key={subItem.id}
              className="flex-row items-start justify-between flex-1 px-4 py-2"
            >
              <View className="flex-row items-start flex-1 gap-x-2">
                <Pressable
                  onPress={() => checkTask(subItem.id)}
                  className="pt-[2.5px]"
                >
                  <MaterialIcons
                    name={
                      subItem.is_done_today
                        ? "check-circle"
                        : "radio-button-unchecked"
                    }
                    size={20}
                    color="#a09086"
                  />
                </Pressable>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() =>
                    router.navigate({
                      pathname:
                        `/${goalId}/${subItem.id}` as RelativePathString,
                      params: {
                        title: subItem.title,
                        target_count: subItem.target_count,
                      },
                    })
                  }
                >
                  <Text
                    className={`flex-1 text-lg max-w-52 text-balanc text-latte ${subItem.is_done_today ? "line-through" : ""}`}
                  >
                    {subItem.title}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  router.navigate({
                    pathname: `/${goalId}/${subItem.id}` as RelativePathString,
                    params: {
                      title: subItem.title,
                      target_count: subItem.target_count,
                    },
                  })
                }
                className="flex-row items-center justify-center"
              >
                <Text className="text-lg text-latte">
                  {subItem.current_count}
                </Text>
                <MaterialCommunityIcons
                  name="slash-forward"
                  size={16}
                  color="#a09086"
                />
                <Text className="text-lg font-semibold text-latte">
                  {subItem.target_count}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text className="font-semibold text-center text-latte">
            아직 등록된 계획이 없어요.
          </Text>
        )}
      </View>

      <View className="flex-row items-center w-40 ml-auto border border-t-0 rounded-b-lg border-latte">
        <TouchableOpacity
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
          className="w-1/3 py-1 border-r border-latte"
        >
          <Feather
            name="trash-2"
            size={18}
            color="#a09086"
            className="mx-auto"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate(`/${goalId}/edit`)}
          className="w-1/3 py-1 border-r border-latte"
        >
          <Feather name="edit" size={18} color="#a09086" className="mx-auto" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate(`/${goalId}`)}
          className="w-1/3 py-1"
        >
          <MaterialCommunityIcons
            name="view-dashboard"
            size={18}
            color="#a09086"
            className="mx-auto"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
