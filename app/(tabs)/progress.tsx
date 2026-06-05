import { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import {
  getSanitizedProfile,
  isProfileComplete,
  toSafeProfileNumber,
  useOnboardingStore,
} from "../../store/onboardingStore";
import { ProgressEntry, useProgressStore } from "../../store/progressStore";
import {
  calculateWeightRemaining,
  estimateTimeline,
} from "../../lib/fitnessCalculator";
import {
  formatWeight,
  normalizeWeightInput,
  UnitSystem,
} from "../../lib/unitConversions";

export default function Progress() {
  const onboardingProfile = useOnboardingStore();
  const hasHydrated = useOnboardingStore((state) => state.hasHydrated);
  const { entries, addEntry, removeEntry } = useProgressStore();

  const [newWeight, setNewWeight] = useState("");

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(12)).current;

  const profile = getSanitizedProfile(onboardingProfile);
  const profileComplete = isProfileComplete(profile);
  const parsedWeight = toSafeProfileNumber(newWeight);
  const canAddEntry = parsedWeight !== null;
  const checkInCount = entries.length;

  useEffect(() => {
    if (hasHydrated && !profileComplete) {
      router.replace("/onboarding");
    }
  }, [hasHydrated, profileComplete]);

  useEffect(() => {
    if (!hasHydrated || !profileComplete) return;

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
  }, [hasHydrated, profileComplete, screenOpacity, screenTranslateY]);

  const handleAddEntry = async () => {
    if (!canAddEntry) return;

    addEntry(normalizeWeightInput(newWeight.trim(), profile.unitSystem));
    setNewWeight("");
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (!hasHydrated || !profileComplete) {
    return <View style={{ flex: 1, backgroundColor: "#0B0B0B" }} />;
  }

  const latestWeight =
    toSafeProfileNumber(entries[0]?.weight) ?? profile.weight;
  const weightRemaining = calculateWeightRemaining(
    latestWeight,
    profile.targetWeight
  );
  const timeline = estimateTimeline(latestWeight, profile.targetWeight);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B0B0B" }}
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
              marginBottom: 8,
            }}
          >
            Progress
          </Text>

          <Text style={{ color: "#8E8E8E", fontSize: 16, lineHeight: 22 }}>
            Track your transformation without overcomplicating the week.
          </Text>
        </View>

        <PremiumCard accent>
          <SectionHeader
            title="Transformation"
            subtitle="Small check-ins, clear direction."
          />

          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            <MetricTile label="Start" value={formatWeight(profile.weight, profile.unitSystem)} />
            <MetricTile label="Current" value={formatWeight(latestWeight, profile.unitSystem)} accent />
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
            <MetricTile label="Target" value={formatWeight(profile.targetWeight, profile.unitSystem)} />
            <MetricTile
              label="Remaining"
              value={weightRemaining ? formatWeight(weightRemaining, profile.unitSystem) : "-"}
            />
          </View>

          <View
            style={{
              backgroundColor: "#0B0B0B",
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "#242424",
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#777777",
                    fontSize: 13,
                    fontWeight: "700",
                    marginBottom: 8,
                  }}
                >
                  Estimated Timeline
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "800",
                  }}
                >
                  {timeline || "-"}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "rgba(0, 255, 178, 0.12)",
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                }}
              >
                <Text
                  style={{
                    color: "#00FFB2",
                    fontSize: 12,
                    fontWeight: "800",
                  }}
                >
                  {checkInCount} logged
                </Text>
              </View>
            </View>
          </View>
        </PremiumCard>

        <PremiumCard>
          <SectionHeader
            title="Add Check-In"
            subtitle="Use the same scale and time of day for cleaner trends."
          />

          <TextInput
            value={newWeight}
            onChangeText={setNewWeight}
            keyboardType="numeric"
            placeholder={`Current weight in ${profile.unitSystem === "metric" ? "kg" : "lbs"}`}
            placeholderTextColor="#666666"
            style={{
              backgroundColor: "#0B0B0B",
              color: "white",
              padding: 18,
              paddingVertical: 16,
              borderRadius: 18,
              fontSize: 18,
              fontWeight: "700",
              borderWidth: 1,
              borderColor: canAddEntry ? "rgba(0, 255, 178, 0.55)" : "#242424",
              marginBottom: 12,
            }}
          />

          <CheckInButton
            onPress={handleAddEntry}
            disabled={!canAddEntry}
          >
            Add Check-In
          </CheckInButton>
        </PremiumCard>

        <PremiumCard>
          <SectionHeader
            title="History"
            subtitle={
              entries.length === 0
                ? "Your first check-in will appear here."
                : `${entries.length} check-in${entries.length === 1 ? "" : "s"} logged`
            }
          />

          {entries.length === 0 ? (
            <EmptyState />
          ) : (
            entries.map((entry, index) => (
              <AnimatedEntryRow
                key={entry.id}
                entry={entry}
                index={index}
                unitSystem={profile.unitSystem}
                onRemove={() => removeEntry(entry.id)}
              />
            ))
          )}
        </PremiumCard>
      </Animated.View>
    </ScrollView>
  );
}

function PremiumCard({
  children,
  accent = false,
}: {
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: "#131313",
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: accent ? "rgba(0, 255, 178, 0.22)" : "#242424",
        marginBottom: 20,
        shadowColor: accent ? "#00FFB2" : "#000000",
        shadowOpacity: accent ? 0.045 : 0.2,
        shadowRadius: accent ? 10 : 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: accent ? 2 : 2,
      }}
    >
      {children}
    </View>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text
        style={{
          color: "#00FFB2",
          fontSize: 13,
          fontWeight: "800",
          letterSpacing: 0.7,
          textTransform: "uppercase",
          marginBottom: subtitle ? 7 : 0,
        }}
      >
        {title}
      </Text>

      {subtitle ? (
        <Text
          style={{
            color: "#8E8E8E",
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function CheckInButton({
  children,
  disabled,
  onPress,
}: {
  children: ReactNode;
  disabled: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateScale = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 28,
      bounciness: 6,
    }).start();
  };

  const handlePress = async () => {
    if (disabled) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        shadowColor: "#00FFB2",
        shadowOpacity: disabled ? 0 : 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: disabled ? 0 : 2,
      }}
    >
      <Pressable
        disabled={disabled}
        onPress={handlePress}
        onPressIn={() => animateScale(0.97)}
        onPressOut={() => animateScale(1)}
        style={{
          minHeight: 54,
          backgroundColor: disabled ? "#101010" : "#00FFB2",
          borderRadius: 18,
          borderWidth: 1,
          borderColor: disabled ? "#282828" : "rgba(255,255,255,0.16)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: disabled ? "#666666" : "#0B0B0B",
            fontSize: 16,
            fontWeight: "800",
          }}
        >
          {children}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function MetricTile({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: accent ? "rgba(0, 255, 178, 0.35)" : "#242424",
        padding: 14,
      }}
    >
      <Text
        style={{
          color: "#777777",
          fontSize: 13,
          fontWeight: "700",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: accent ? "#00FFB2" : "white",
          fontSize: 19,
          fontWeight: "800",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: "#0B0B0B",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#242424",
        padding: 20,
      }}
    >
      <View
        style={{
          width: 28,
          height: 4,
          borderRadius: 999,
          backgroundColor: "#00FFB2",
          opacity: 0.65,
          marginBottom: 14,
        }}
      />
      <Text
        style={{
          color: "white",
          fontSize: 19,
          fontWeight: "800",
          marginBottom: 6,
          textAlign: "center",
        }}
      >
        No check-ins yet
      </Text>
      <Text
        style={{
          color: "#8E8E8E",
          fontSize: 14,
          lineHeight: 20,
          textAlign: "center",
        }}
      >
        Add a weekly weight to start building your trend.
      </Text>
    </View>
  );
}

function AnimatedEntryRow({
  entry,
  index,
  unitSystem,
  onRemove,
}: {
  entry: ProgressEntry;
  index: number;
  unitSystem: UnitSystem;
  onRemove: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: Math.min(index * 60, 240),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: Math.min(index * 60, 240),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        paddingVertical: 16,
        borderTopWidth: index === 0 ? 0 : 1,
        borderTopColor: "#242424",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            backgroundColor: "#00FFB2",
            opacity: 0.85,
          }}
        />

        <View style={{ flex: 1 }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "800" }}>
            {formatWeight(entry.weight, unitSystem)}
          </Text>

          <Text
            style={{
              color: "#777777",
              fontSize: 13,
              fontWeight: "600",
              marginTop: 5,
            }}
          >
            {new Date(entry.date).toLocaleDateString()}
          </Text>
        </View>

        <Pressable
          onPress={onRemove}
          style={{
            borderRadius: 999,
            borderWidth: 1,
            borderColor: "#3A2020",
            paddingHorizontal: 14,
            paddingVertical: 9,
          }}
        >
          <Text style={{ color: "#FF6B6B", fontSize: 13, fontWeight: "800" }}>
            Remove
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
