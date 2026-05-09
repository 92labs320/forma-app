import { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";

import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { useOnboardingStore } from "../../store/onboardingStore";
import { ProgressEntry, useProgressStore } from "../../store/progressStore";
import {
  calculateWeightRemaining,
  estimateTimeline,
} from "../../lib/fitnessCalculator";

export default function Progress() {
  const { weight, targetWeight } = useOnboardingStore();
  const { entries, addEntry, removeEntry } = useProgressStore();

  const [newWeight, setNewWeight] = useState("");

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(12)).current;

  const latestWeight = entries[0]?.weight || weight;
  const weightRemaining = calculateWeightRemaining(latestWeight, targetWeight);
  const timeline = estimateTimeline(latestWeight, targetWeight);
  const parsedWeight = Number(newWeight);
  const canAddEntry = Boolean(newWeight.trim()) && parsedWeight > 0;
  const checkInCount = entries.length;

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

  const handleAddEntry = async () => {
    if (!canAddEntry) return;

    addEntry(newWeight.trim());
    setNewWeight("");
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

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

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            <MetricTile label="Start" value={`${weight || "-"} kg`} />
            <MetricTile label="Current" value={`${latestWeight || "-"} kg`} accent />
          </View>

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 18 }}>
            <MetricTile label="Target" value={`${targetWeight || "-"} kg`} />
            <MetricTile
              label="Remaining"
              value={weightRemaining ? `${weightRemaining} kg` : "-"}
            />
          </View>

          <View
            style={{
              backgroundColor: "#0B0B0B",
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "#242424",
              padding: 18,
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
            placeholder="Current weight in kg"
            placeholderTextColor="#666666"
            style={{
              backgroundColor: "#0B0B0B",
              color: "white",
              padding: 18,
              borderRadius: 18,
              fontSize: 18,
              fontWeight: "700",
              borderWidth: 1,
              borderColor: canAddEntry ? "rgba(0, 255, 178, 0.55)" : "#242424",
              marginBottom: 16,
            }}
          />

          <PrimaryButton
            onPress={handleAddEntry}
            disabled={!canAddEntry}
            style={{
              shadowOpacity: canAddEntry ? 0.12 : 0,
              shadowRadius: 8,
              elevation: canAddEntry ? 2 : 0,
            }}
          >
            Add Check-In
          </PrimaryButton>
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
        padding: 22,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: accent ? "rgba(0, 255, 178, 0.22)" : "#242424",
        marginBottom: 22,
        shadowColor: accent ? "#00FFB2" : "#000000",
        shadowOpacity: accent ? 0.08 : 0.22,
        shadowRadius: accent ? 16 : 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: accent ? 3 : 2,
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
        borderRadius: 18,
        borderWidth: 1,
        borderColor: accent ? "rgba(0, 255, 178, 0.35)" : "#242424",
        padding: 16,
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
        padding: 24,
      }}
    >
      <View
        style={{
          width: 34,
          height: 4,
          borderRadius: 999,
          backgroundColor: "#00FFB2",
          opacity: 0.65,
          marginBottom: 18,
        }}
      />
      <Text
        style={{
          color: "white",
          fontSize: 19,
          fontWeight: "800",
          marginBottom: 8,
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
  onRemove,
}: {
  entry: ProgressEntry;
  index: number;
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
            {entry.weight} kg
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
