import { ScrollView, Text, View, Pressable } from "react-native";

import * as Haptics from "expo-haptics";

import { useOnboardingStore } from "../../store/onboardingStore";
import { useWorkoutStore } from "../../store/workoutStore";
import { getWorkoutExercises } from "../../data/workoutExercises";

export default function Workout() {
  const { goal } = useOnboardingStore();

  const {
    completedWorkouts,
    toggleWorkout,
  } = useWorkoutStore();

  const workouts = getWorkoutExercises(goal);

  const completedCount = workouts.filter((workout) =>
    completedWorkouts.includes(workout.day)
  ).length;

  const totalCount = workouts.length;

  const progressPercent =
    totalCount > 0
      ? Math.round(
          (completedCount / totalCount) * 100
        )
      : 0;

  const handleWorkoutToggle = async (
    workoutDay: string
  ) => {
    await Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Medium
    );

    toggleWorkout(workoutDay);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
      }}
      contentContainerStyle={{
        padding: 24,
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 12,
        }}
      >
        Workouts
      </Text>

      <Text
        style={{
          color: "#9A9A9A",
          fontSize: 16,
          marginBottom: 24,
        }}
      >
        Your training plan based on your goal.
      </Text>

      {/* WEEKLY PROGRESS */}
      <View
        style={{
          backgroundColor: "#151515",
          padding: 24,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: "#262626",
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            color: "#00FFB2",
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          Weekly Progress
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          {completedCount} / {totalCount} completed
        </Text>

        <Text
          style={{
            color: "#9A9A9A",
            fontSize: 15,
            marginBottom: 16,
          }}
        >
          {progressPercent}% consistency this week
        </Text>

        <View
          style={{
            height: 10,
            backgroundColor: "#262626",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              backgroundColor: "#00FFB2",
            }}
          />
        </View>
      </View>

      {/* WORKOUTS */}
      {workouts.map((workout) => {
        const isCompleted =
          completedWorkouts.includes(workout.day);

        return (
          <View
            key={workout.day}
            style={{
              backgroundColor: "#151515",
              padding: 24,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: isCompleted
                ? "#00FFB2"
                : "#262626",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "#00FFB2",
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              {workout.day}
            </Text>

            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              {workout.title}
            </Text>

            {isCompleted && (
              <Text
                style={{
                  color: "#00FFB2",
                  fontSize: 14,
                  fontWeight: "bold",
                  marginBottom: 16,
                }}
              >
                Completed
              </Text>
            )}

            {workout.exercises.map((exercise) => (
              <View
                key={exercise.name}
                style={{
                  paddingVertical: 14,
                  borderTopWidth: 1,
                  borderTopColor: "#262626",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 17,
                    fontWeight: "600",
                    marginBottom: 6,
                  }}
                >
                  {exercise.name}
                </Text>

                <Text
                  style={{
                    color: "#9A9A9A",
                    fontSize: 14,
                  }}
                >
                  {exercise.sets} sets •{" "}
                  {exercise.reps} reps •{" "}
                  {exercise.rest} rest
                </Text>
              </View>
            ))}

            <Pressable
              onPress={() =>
                handleWorkoutToggle(workout.day)
              }
              style={{
                backgroundColor: isCompleted
                  ? "#151515"
                  : "#00FFB2",

                borderWidth: 1,
                borderColor: "#00FFB2",

                paddingVertical: 16,
                borderRadius: 16,

                alignItems: "center",

                marginTop: 16,
              }}
            >
              <Text
                style={{
                  color: isCompleted
                    ? "#00FFB2"
                    : "#0B0B0B",

                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {isCompleted
                  ? "Mark as Not Done"
                  : "Complete Workout"}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}