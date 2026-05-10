import { useEffect, useRef } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";

import * as Haptics from "expo-haptics";

import { useOnboardingStore } from "../../store/onboardingStore";
import { useWorkoutStore } from "../../store/workoutStore";
import { getWorkoutExercises } from "../../data/workoutExercises";

export default function Workout() {
  const { goal } = useOnboardingStore();
  const { completedWorkouts, toggleWorkout } = useWorkoutStore();

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(12)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  const workouts = getWorkoutExercises(goal);

  const completedCount = workouts.filter((workout) =>
    completedWorkouts.includes(workout.day)
  ).length;

  const totalCount = workouts.length;

  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslateY, {
        toValue: 0,
        duration: 520,
        useNativeDriver: true,
      }),
    ]).start();
  }, [screenOpacity, screenTranslateY]);

  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: progressPercent,
      duration: 520,
      useNativeDriver: false,
    }).start();
  }, [progressPercent, progressWidth]);

  const progressBarWidth = progressWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const handleWorkoutToggle = async (workoutDay: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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
        paddingTop: 72,
        paddingBottom: 92,
      }}
    >
      <Animated.View
        style={{
          opacity: screenOpacity,
          transform: [{ translateY: screenTranslateY }],
        }}
      >
        <View style={{ marginBottom: 26 }}>
          <Text
            style={{
              color: "white",
              fontSize: 34,
              fontWeight: "800",
              letterSpacing: 0,
              marginBottom: 8,
            }}
          >
            Workouts
          </Text>

          <Text
            style={{
              color: "#8E8E8E",
              fontSize: 16,
              lineHeight: 22,
            }}
          >
            Your training plan based on your goal.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#131313",
            padding: 22,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: "rgba(0, 255, 178, 0.22)",
            marginBottom: 30,
            shadowColor: "#00FFB2",
            shadowOpacity: 0.055,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 8 },
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 14,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#00FFB2",
                  fontSize: 13,
                  fontWeight: "800",
                  letterSpacing: 0.7,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Weekly Progress
              </Text>

              <Text
                style={{
                  color: "white",
                  fontSize: 28,
                  fontWeight: "800",
                  marginBottom: 6,
                }}
              >
                {completedCount} / {totalCount}
              </Text>

              <Text
                style={{
                  color: "#8E8E8E",
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                workouts completed this week
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "#0B0B0B",
                borderRadius: 999,
                borderWidth: 1,
                borderColor: "#263A34",
                paddingHorizontal: 14,
                paddingVertical: 9,
              }}
            >
              <Text
                style={{
                  color: "#00FFB2",
                  fontSize: 15,
                  fontWeight: "800",
                }}
              >
                {progressPercent}%
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 8,
              backgroundColor: "#252525",
              borderRadius: 999,
              overflow: "hidden",
              marginBottom: 14,
            }}
          >
            <Animated.View
              style={{
                width: progressBarWidth,
                height: "100%",
                backgroundColor: "#00FFB2",
                borderRadius: 999,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 8,
            }}
          >
            {workouts.map((workout) => {
              const isWorkoutComplete = completedWorkouts.includes(workout.day);

              return (
                <View
                  key={workout.day}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 2.5,
                    backgroundColor: isWorkoutComplete ? "#19E6A1" : "#2A2A2A",
                    opacity: isWorkoutComplete ? 0.76 : 0.62,
                  }}
                />
              );
            })}
          </View>
        </View>

        <Text
          style={{
            color: "white",
            fontSize: 21,
            fontWeight: "800",
            marginBottom: 16,
          }}
        >
          Training Plan
        </Text>

        {workouts.map((workout, index) => {
          const isCompleted = completedWorkouts.includes(workout.day);
          const isActiveWorkout = index === 0;

          return (
            <View
              key={workout.day}
              style={{
                backgroundColor: isCompleted ? "#14201D" : "#131313",
                paddingHorizontal: 22,
                paddingTop: 20,
                paddingBottom: 17,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: isCompleted
                  ? "#00FFB2"
                  : isActiveWorkout
                    ? "rgba(0, 255, 178, 0.32)"
                    : "#242424",
                marginBottom: 22,
                shadowColor: isCompleted || isActiveWorkout ? "#00FFB2" : "#000000",
                shadowOpacity: isCompleted ? 0.1 : isActiveWorkout ? 0.045 : 0.22,
                shadowRadius: isCompleted ? 14 : isActiveWorkout ? 9 : 18,
                shadowOffset: { width: 0, height: 10 },
                elevation: isCompleted || isActiveWorkout ? 4 : 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#00FFB2",
                      fontSize: 13,
                      fontWeight: "800",
                      letterSpacing: 0.7,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {workout.day}
                  </Text>

                  <Text
                    style={{
                      color: "white",
                      fontSize: 22,
                      fontWeight: "800",
                      lineHeight: 28,
                    }}
                  >
                    {workout.title}
                  </Text>
                </View>

                {isActiveWorkout || isCompleted ? (
                  <View
                    style={{
                      backgroundColor: "rgba(0, 255, 178, 0.09)",
                      borderRadius: 999,
                      paddingHorizontal: 11,
                      paddingVertical: 6,
                      opacity: 0.9,
                    }}
                  >
                    <Text
                      style={{
                        color: "#00FFB2",
                        fontSize: 11,
                        fontWeight: "800",
                      }}
                    >
                      {isCompleted ? "Done" : "TODAY"}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "rgba(255, 255, 255, 0.045)",
                }}
              >
                {workout.exercises.map((exercise) => (
                  <View
                    key={exercise.name}
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(255, 255, 255, 0.032)",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "800",
                        letterSpacing: -0.35,
                        lineHeight: 22,
                        marginBottom: 6,
                      }}
                    >
                      {exercise.name}
                    </Text>

                    <Text
                      style={{
                        color: "#8E8E8E",
                        fontSize: 12,
                        lineHeight: 20,
                        opacity: 0.82,
                      }}
                    >
                      {exercise.sets} sets / {exercise.reps} reps /{" "}
                      {exercise.rest} rest
                    </Text>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={() => handleWorkoutToggle(workout.day)}
                style={{
                  backgroundColor: isCompleted ? "transparent" : "#19E6A1",
                  borderWidth: 1,
                  borderColor: isCompleted ? "#00FFB2" : "#19E6A1",
                  minHeight: 56,
                  paddingVertical: 13,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 18,
                  shadowColor: "#19E6A1",
                  shadowOpacity: isCompleted ? 0 : 0.03,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: isCompleted ? 0 : 2,
                }}
              >
                <Text
                  style={{
                    color: isCompleted ? "#00FFB2" : "#0B0B0B",
                    fontWeight: "800",
                    fontSize: 15,
                  }}
                >
                  {isCompleted ? "Mark as Not Done" : "Complete Workout"}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </Animated.View>
    </ScrollView>
  );
}
