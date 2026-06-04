import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useOnboardingStore } from "../store/onboardingStore";
import {
  cmToFeetInches,
  feetInchesToCm,
  formatWeightInput,
  normalizeWeightInput,
  UnitSystem,
} from "../lib/unitConversions";

const TOTAL_STEPS = 6;

const goals = [
  "Lose Fat",
  "Build Muscle",
  "Body Recomposition",
  "Improve Fitness",
];

const genders = ["Male", "Female"];

export default function Onboarding() {
  const [step, setStep] = useState(1);

  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateY = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(1 / TOTAL_STEPS)).current;

  const {
    goal,
    gender,
    age,
    height,
    weight,
    targetWeight,
    unitSystem,
    setGoal,
    setGender,
    setAge,
    setHeight,
    setWeight,
    setTargetWeight,
    setUnitSystem,
    setOnboardingCompleted,
  } = useOnboardingStore();

  const progress = step / TOTAL_STEPS;

  const isDisabled =
    (step === 1 && !goal) ||
    (step === 2 && !gender) ||
    (step === 3 && !age) ||
    (step === 4 && !height) ||
    (step === 5 && !weight) ||
    (step === 6 && !targetWeight);

  useEffect(() => {
    contentOpacity.setValue(0);
    contentTranslateY.setValue(16);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 360,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 360,
        useNativeDriver: false,
      }),
    ]).start();
  }, [contentOpacity, contentTranslateY, progress, progressAnimation, step]);

  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const goNext = async () => {
    if (isDisabled) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    setOnboardingCompleted(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    router.replace("/(tabs)/dashboard");
  };

  const goBack = async () => {
    if (step <= 1) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(step - 1);
  };

  const handleUnitChange = async (nextUnitSystem: UnitSystem) => {
    await Haptics.selectionAsync();
    setUnitSystem(nextUnitSystem);
  };

  const handleFeetChange = (feet: string) => {
    const { inches } = cmToFeetInches(height);
    setHeight(feetInchesToCm(feet, inches));
  };

  const handleInchesChange = (inches: string) => {
    const { feet } = cmToFeetInches(height);
    setHeight(feetInchesToCm(feet, inches));
  };

  const handleSelection = async (
    label: string,
    setValue: (value: string) => void
  ) => {
    await Haptics.selectionAsync();
    setValue(label);
  };

  const renderOption = (
    label: string,
    selectedValue: string,
    setValue: (value: string) => void
  ) => {
    const isSelected = selectedValue === label;

    return (
      <Pressable
        key={label}
        onPress={() => handleSelection(label, setValue)}
        style={{
          backgroundColor: isSelected ? "rgba(0, 255, 178, 0.12)" : "#131313",
          paddingVertical: 20,
          paddingHorizontal: 20,
          borderRadius: 22,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: isSelected ? "rgba(0, 255, 178, 0.6)" : "#242424",
          shadowColor: isSelected ? "#00FFB2" : "#000000",
          shadowOpacity: isSelected ? 0.08 : 0.18,
          shadowRadius: isSelected ? 12 : 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: isSelected ? 2 : 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Text
            style={{
              color: "white",
              flex: 1,
              fontSize: 19,
              fontWeight: "800",
              lineHeight: 25,
            }}
          >
            {label}
          </Text>

          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: isSelected ? "#00FFB2" : "#3A3A3A",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isSelected ? (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: "#00E6A4",
                }}
              />
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  };

  const renderInputStep = (
    title: string,
    subtitle: string,
    placeholder: string,
    value: string,
    setValue: (value: string) => void
  ) => (
    <>
      <StepHeader title={title} subtitle={subtitle} />

      <TextInput
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor="#666666"
        selectionColor="#00FFB2"
        style={{
          backgroundColor: "#131313",
          color: "white",
          paddingVertical: 22,
          paddingHorizontal: 20,
          borderRadius: 22,
          fontSize: 24,
          fontWeight: "800",
          borderWidth: 1,
          borderColor: value ? "rgba(0, 255, 178, 0.5)" : "#242424",
          shadowColor: "#000000",
          shadowOpacity: 0.18,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 1,
        }}
      />
    </>
  );

  const renderUnitToggle = (labels: { metric: string; imperial: string }) => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#101010",
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#242424",
        padding: 4,
        marginBottom: 16,
      }}
    >
      {(["metric", "imperial"] as UnitSystem[]).map((item) => {
        const isSelected = unitSystem === item;
        const label = item === "metric" ? labels.metric : labels.imperial;

        return (
          <Pressable
            key={item}
            onPress={() => handleUnitChange(item)}
            style={{
              flex: 1,
              backgroundColor: isSelected ? "#00FFB2" : "transparent",
              borderRadius: 999,
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: isSelected ? "#0B0B0B" : "#8E8E8E",
                fontSize: 14,
                fontWeight: "800",
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderHeightStep = () => {
    const imperialHeight = cmToFeetInches(height);

    return (
      <>
        <StepHeader
          title="How tall are you?"
          subtitle={
            unitSystem === "metric"
              ? "Enter your height in centimeters."
              : "Enter your height in feet and inches."
          }
        />

        {renderUnitToggle({ metric: "cm", imperial: "ft/in" })}

        {unitSystem === "metric" ? (
          <TextInput
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholder="Height in cm"
            placeholderTextColor="#666666"
            selectionColor="#00FFB2"
            style={inputStyle(height)}
          />
        ) : (
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TextInput
              value={imperialHeight.feet}
              onChangeText={handleFeetChange}
              keyboardType="numeric"
              placeholder="Feet"
              placeholderTextColor="#666666"
              selectionColor="#00FFB2"
              style={[inputStyle(height), { flex: 1 }]}
            />
            <TextInput
              value={imperialHeight.inches}
              onChangeText={handleInchesChange}
              keyboardType="numeric"
              placeholder="Inches"
              placeholderTextColor="#666666"
              selectionColor="#00FFB2"
              style={[inputStyle(height), { flex: 1 }]}
            />
          </View>
        )}
      </>
    );
  };

  const renderWeightStep = (
    title: string,
    subtitle: string,
    value: string,
    setValue: (value: string) => void,
    placeholderPrefix: string
  ) => (
    <>
      <StepHeader
        title={title}
        subtitle={`${subtitle} Use ${unitSystem === "metric" ? "kilograms" : "pounds"}.`}
      />

      {renderUnitToggle({ metric: "kg", imperial: "lbs" })}

      <TextInput
        value={formatWeightInput(value, unitSystem)}
        onChangeText={(text) => setValue(normalizeWeightInput(text, unitSystem))}
        keyboardType="numeric"
        placeholder={`${placeholderPrefix} in ${unitSystem === "metric" ? "kg" : "lbs"}`}
        placeholderTextColor="#666666"
        selectionColor="#00FFB2"
        style={inputStyle(value)}
      />
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 18,
            paddingBottom: 24,
          }}
        >
          <View style={{ marginBottom: 28 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <Text
                style={{
                  color: "#00E6A4",
                  fontSize: 12,
                  fontWeight: "800",
                  letterSpacing: 1,
                }}
              >
                STEP {step} OF {TOTAL_STEPS}
              </Text>

              {step > 1 ? (
                <Pressable
                  onPress={goBack}
                  hitSlop={12}
                  style={{
                    paddingVertical: 6,
                    paddingLeft: 14,
                  }}
                >
                  <Text
                    style={{
                      color: "#8E8E8E",
                      fontSize: 15,
                      fontWeight: "700",
                    }}
                  >
                    Back
                  </Text>
                </Pressable>
              ) : (
                <View style={{ width: 44 }} />
              )}
            </View>

            <View
              style={{
                height: 5,
                backgroundColor: "#242424",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <Animated.View
                style={{
                  width: progressWidth,
                  height: "100%",
                  backgroundColor: "#00E6A4",
                  borderRadius: 999,
                }}
              />
            </View>
          </View>

          <Animated.View
            style={{
              flex: 1,
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                paddingBottom: 96,
              }}
            >
              {step === 1 && (
                <>
                  <StepHeader
                    title="What’s your goal?"
                    subtitle="Choose the outcome you want to build toward."
                  />

                  {goals.map((item) => renderOption(item, goal, setGoal))}
                </>
              )}

              {step === 2 && (
                <>
                  <StepHeader
                    title="Tell us about you."
                    subtitle="This helps personalize your daily targets."
                  />

                  {genders.map((item) => renderOption(item, gender, setGender))}
                </>
              )}

              {step === 3 &&
                renderInputStep(
                  "How old are you?",
                  "A simple detail for smarter estimates.",
                  "Age",
                  age,
                  setAge
                )}

              {step === 4 && renderHeightStep()}

              {step === 5 &&
                renderWeightStep(
                  "What’s your weight?",
                  "Use your current weight.",
                  weight,
                  setWeight,
                  "Weight"
                )}

              {step === 6 &&
                renderWeightStep(
                  "What’s your target weight?",
                  "Choose a realistic direction to work toward.",
                  targetWeight,
                  setTargetWeight,
                  "Target weight"
                )}
            </View>
          </Animated.View>

          <View
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              bottom: 24,
            }}
          >
            <Pressable
              disabled={isDisabled}
              onPress={goNext}
              style={{
                backgroundColor: isDisabled ? "#2A2A2A" : "#00FFB2",
                paddingVertical: 18,
                borderRadius: 22,
                alignItems: "center",
                borderWidth: 1,
                borderColor: isDisabled ? "#2A2A2A" : "rgba(255,255,255,0.18)",
                shadowColor: "#00FFB2",
                shadowOpacity: isDisabled ? 0 : 0.14,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 6 },
                elevation: isDisabled ? 0 : 3,
              }}
            >
              <Text
                style={{
                  color: isDisabled ? "#777777" : "#0B0B0B",
                  fontSize: 16,
                  fontWeight: "800",
                }}
              >
                {step === TOTAL_STEPS ? "Build My Plan" : "Continue"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function inputStyle(value: string) {
  return {
    backgroundColor: "#131313",
    color: "white",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 22,
    fontSize: 24,
    fontWeight: "800" as const,
    borderWidth: 1,
    borderColor: value ? "rgba(0, 255, 178, 0.5)" : "#242424",
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  };
}

function StepHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={{ marginBottom: 34 }}>
      <Text
        style={{
          color: "white",
          fontSize: 40,
          fontWeight: "800",
          lineHeight: 46,
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: "#8E8E8E",
          fontSize: 17,
          lineHeight: 24,
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
