import { router } from "expo-router";
import { View, Text, Pressable, TextInput } from "react-native";
import { useState } from "react";

import { useOnboardingStore } from "../store/onboardingStore";

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

  const {
    goal,
    gender,
    age,
    height,
    weight,
    targetWeight,
    setGoal,
    setGender,
    setAge,
    setHeight,
    setWeight,
    setTargetWeight,
  } = useOnboardingStore();

  const progress = (step / TOTAL_STEPS) * 100;

  const isDisabled =
    (step === 1 && !goal) ||
    (step === 2 && !gender) ||
    (step === 3 && !age) ||
    (step === 4 && !height) ||
    (step === 5 && !weight) ||
    (step === 6 && !targetWeight);

  const goNext = () => {
    if (isDisabled) return;

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }

    router.push("/(tabs)/dashboard");
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
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
        onPress={() => setValue(label)}
        style={{
          backgroundColor: isSelected ? "#00FFB2" : "#151515",
          padding: 18,
          borderRadius: 16,
          marginBottom: 14,
          borderWidth: 1,
          borderColor: isSelected ? "#00FFB2" : "#262626",
        }}
      >
        <Text
          style={{
            color: isSelected ? "#0B0B0B" : "white",
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
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
      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "bold",
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: "#9A9A9A",
          fontSize: 16,
          marginBottom: 32,
        }}
      >
        {subtitle}
      </Text>

      <TextInput
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        placeholder={placeholder}
        placeholderTextColor="#666666"
        style={{
          backgroundColor: "#151515",
          color: "white",
          padding: 20,
          borderRadius: 16,
          fontSize: 18,
          borderWidth: 1,
          borderColor: "#262626",
        }}
      />
    </>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
        padding: 24,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          height: 8,
          backgroundColor: "#1C1C1C",
          borderRadius: 999,
          marginBottom: 20,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#00FFB2",
          }}
        />
      </View>

      <Text style={{ color: "#00FFB2", fontSize: 14, marginBottom: 12 }}>
        Step {step} of {TOTAL_STEPS}
      </Text>

      {step === 1 && (
        <>
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 12 }}>
            What is your goal?
          </Text>

          <Text style={{ color: "#9A9A9A", fontSize: 16, marginBottom: 32 }}>
            Choose your main transformation goal.
          </Text>

          {goals.map((item) => renderOption(item, goal, setGoal))}
        </>
      )}

      {step === 2 && (
        <>
          <Text style={{ color: "white", fontSize: 32, fontWeight: "bold", marginBottom: 12 }}>
            Gender
          </Text>

          <Text style={{ color: "#9A9A9A", fontSize: 16, marginBottom: 32 }}>
            Select your gender.
          </Text>

          {genders.map((item) => renderOption(item, gender, setGender))}
        </>
      )}

      {step === 3 &&
        renderInputStep(
          "Your Age",
          "Enter your age to personalize your plan.",
          "Age",
          age,
          setAge
        )}

      {step === 4 &&
        renderInputStep(
          "Your Height",
          "Enter your height in centimeters.",
          "Height in cm",
          height,
          setHeight
        )}

      {step === 5 &&
        renderInputStep(
          "Your Weight",
          "Enter your current weight in kilograms.",
          "Weight in kg",
          weight,
          setWeight
        )}

      {step === 6 &&
        renderInputStep(
          "Target Weight",
          "Enter your target weight in kilograms.",
          "Target weight in kg",
          targetWeight,
          setTargetWeight
        )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 40,
        }}
      >
        {step > 1 ? (
          <Pressable
            onPress={goBack}
            style={{
              backgroundColor: "#151515",
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Back</Text>
          </Pressable>
        ) : (
          <View />
        )}

        <Pressable
          disabled={isDisabled}
          onPress={goNext}
          style={{
            backgroundColor: isDisabled ? "#333333" : "#00FFB2",
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              color: isDisabled ? "#777777" : "#0B0B0B",
              fontWeight: "bold",
            }}
          >
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}